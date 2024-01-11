import React, {useContext, useState} from "react";
import {Container} from "react-bootstrap";
import Card from '../card/Card';
import './wordCheck.scss';
import {useLocation, useNavigate} from "react-router-dom";
import {getTermsToTrain} from "../../services/TrainingStarter";
import {CButton} from "@coreui/react";
import ProfileContext from "../../contexts/ProfileContext";
import {markProfileDirty} from "../../services/Persistence";

function TrainingSession() {
    const navigate = useNavigate();
    const location = useLocation();
    const {trainingName, trainingType} = location.state;

    const {profile} = useContext(ProfileContext);
    const trainingDefinition = profile.trainingDefinitions.find(value => value.name === trainingName);

    const termTrainingProgress = React.useMemo(() => trainingDefinition ? getTermsToTrain(profile, trainingDefinition, trainingType) : undefined, [profile, trainingDefinition, trainingType]);
    const [currentTermIdx, setCurrentTermIdx] = useState(0);

    if (!trainingDefinition || !termTrainingProgress) {
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
        termTrainingProgress[currentTermIdx].iterationNumber += 1;
        termTrainingProgress[currentTermIdx].lastTrainingDate = Date.now();
        markProfileDirty(profile);
        setCurrentTermIdx((currentValue) => currentValue + 1)
    }
    const onWrongClicked = () => {
        termTrainingProgress[currentTermIdx].iterationNumber = 0;
        termTrainingProgress[currentTermIdx].lastTrainingDate = Date.now();
        markProfileDirty(profile);
        setCurrentTermIdx((currentValue) => currentValue + 1)
    }

    const onSkipClicked = () => {
        setCurrentTermIdx((currentValue) => currentValue + 1);
    }

    return (
        <Container className="page gap-3">
            <Card question={question}
                  answer={answer}
                  onRightClicked={onRightClicked}
                  onSkipClicked={onSkipClicked}
                  onWrongClicked={onWrongClicked}/>
            {/*<Container className="gap-4 ">*/}
            {/*    <CButton color={"danger"} onClick={onWrongClicked}>Wrong</CButton>*/}
            {/*    <CButton color={"info"} onClick={onSkipClicked}>Skip</CButton>*/}
            {/*    <CButton color={"success"} onClick={onRightClicked}>Right</CButton>*/}
            {/*</Container>*/}
        </Container>
    );
}

export default TrainingSession;