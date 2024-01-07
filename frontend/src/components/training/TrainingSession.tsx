import React, {useState} from "react";
import {Container} from "react-bootstrap";
import Card from '../card/Card';
import './wordCheck.scss';
import {useLocation} from "react-router-dom";
import {getTermsToTrain} from "../../services/TrainingStarter";
import {profileSelector} from "../../slices/profileSlice";
import {useAppSelector} from "../../redux/hooks";

function TrainingSession() {
    const location = useLocation();
    const trainingName = location.state.trainingName;
    const profile = useAppSelector(profileSelector).profile;
    const trainingDefinition = profile.trainingDefinitions.find(value => value.name === trainingName);

    const [currentTermIdx, setCurrentTermIdx] = useState(0);

    if (!trainingDefinition){
        return ("Unknown training");
    } 

    const termTrainingProgress = getTermsToTrain(profile, trainingDefinition);
    
    if (currentTermIdx >= termTrainingProgress.length) {
        return (
            <div>
                Finished
            </div>)
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
            <button onClick={onRightClicked}>Right</button>
            <button onClick={onWrongClicked}>Wrong</button>
            <button onClick={onSkipClicked}>Skip</button>
        </Container>
    );
}

export default TrainingSession;