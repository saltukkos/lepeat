import React, {useState} from "react";
import {Container} from "react-bootstrap";
import Card from '../card/Card';
import './wordCheck.scss';
import {useLocation, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {LepeatProfile} from "../../model/LepeatProfile";
import {getTermsToTrain} from "../../services/TrainingStarter";
import {CButton} from "@coreui/react";

function TrainingSession(
) {
    const navigate = useNavigate();
    const location = useLocation();
    const trainingName = location.state.trainingName;
    const profile = useSelector<any>((state) => state.profile) as LepeatProfile; //TODO save types
    const trainingDefinition = profile.trainingDefinitions.find(value => value.name === trainingName);

    const termTrainingProgress = React.useMemo(() => trainingDefinition ? getTermsToTrain(profile, trainingDefinition) : undefined, []);
    const [currentTermIdx, setCurrentTermIdx] = useState(0);

    if (!trainingDefinition || !termTrainingProgress){
        return ("Unknown training");
    }

    console.log("terms to train:" + termTrainingProgress.length)
    
    if (currentTermIdx >= termTrainingProgress.length) {
        return (
            <Container className="page">
                Finished
                <CButton color="primary" onClick={() => navigate('/')}>Back to the Dashboard</CButton>
            </Container>)
    }

    let currentTermProgress = termTrainingProgress[currentTermIdx];
    let currentTerm = currentTermProgress.term;

    let currentTermDefinition = currentTerm.termDefinition;
    let currentRule = trainingDefinition.configuration.get(currentTermDefinition)!; // TODO think on corner case
    let question = currentRule.attributesToShow.map(a => currentTerm.attributeValues.get(a)).join(" ");
    let answer = currentRule.attributesToGuess.map(a => currentTerm.attributeValues.get(a)).join(" ");

    const onRightClicked = () => {
        termTrainingProgress[currentTermIdx].iterationNumber = termTrainingProgress[currentTermIdx].iterationNumber + 1;
        termTrainingProgress[currentTermIdx].lastTrainingDate = Date.now();
        setCurrentTermIdx((currentValue) => currentValue + 1)
    }
    const onWrongClicked = () => {
        termTrainingProgress[currentTermIdx].iterationNumber = 0;
        termTrainingProgress[currentTermIdx].lastTrainingDate = Date.now();
        setCurrentTermIdx((currentValue) => currentValue + 1)
    }

    const onSkipClicked = () => {
        setCurrentTermIdx((currentValue) => currentValue + 1);
    }

    return (
        <Container className="page">
            <Card question={question} answer={answer}/>
            {/*<button onClick={onHomeButtonClicked}> Home</button>*/}
            <button onClick={onRightClicked}>Right</button>
            <button onClick={onWrongClicked}>Wrong</button>
            <button onClick={onSkipClicked}>Skip</button>
        </Container>
    );
}

export default TrainingSession;