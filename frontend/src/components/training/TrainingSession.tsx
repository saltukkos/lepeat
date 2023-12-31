import React, {useContext, useEffect, useState} from "react";
import {Container} from "react-bootstrap";
import Card from '../card/Card';
import './wordCheck.scss';
import {useLocation, useNavigate} from "react-router-dom";
import {LepeatProfile} from "../../model/LepeatProfile";
import {getTermsToTrain} from "../../services/TrainingStarter";
import {CButton} from "@coreui/react";
import ProfileContext from "../../contexts/ProfileContext";
import {germanProfile} from "../../model/DefaultModel";

function TrainingSession(
) {
    const navigate = useNavigate();
    const location = useLocation();
    const trainingName = location.state.trainingName;

    const { getLepeatProfile } = useContext(ProfileContext);
    const [profile, setProfile] = useState<LepeatProfile>(germanProfile);

    useEffect(() => {
        setProfile(getLepeatProfile());
    }, [getLepeatProfile]);

    const trainingDefinition = profile.trainingDefinitions.find(value => value.name === trainingName);

    const termTrainingProgress = React.useMemo(() => trainingDefinition ? getTermsToTrain(profile, trainingDefinition) : undefined, [profile, trainingDefinition]);
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
        <Container className="page gap-3">
            <Card question={question} answer={answer}/>
            <CButton color={"success"} onClick={onRightClicked}>Right</CButton>
            <CButton color={"warning"} onClick={onWrongClicked}>Wrong</CButton>
            <CButton color={"primary"} onClick={onSkipClicked}>Skip</CButton>
        </Container>
    );
}

export default TrainingSession;