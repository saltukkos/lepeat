import React, { useState } from "react";
import { Container } from "react-bootstrap";
import Card from '../card/Card';
import './wordCheck.scss';
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from '../../slices/trainingSessionSlice'
import {RootState} from "../../redux/store";
import {TrainingDefinition} from "../../model/TrainingDefinition";
import {TermTrainingProgress} from "../../model/TrainingProgress";

interface TrainingSessionProps {
    trainingDefinition: TrainingDefinition,
    termTrainingProgress: TermTrainingProgress[],
    onHomeButtonClicked: () => void
}

function TrainingSession({trainingDefinition, termTrainingProgress, onHomeButtonClicked}: TrainingSessionProps) {
  const [currentTermIdx, setCurrentTermIdx] = useState(0);

  if (currentTermIdx >= termTrainingProgress.length) {
      return (
          <div>
              Finished
              <button onClick={onHomeButtonClicked}> Home </button>
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
    termTrainingProgress[currentTermIdx].lastTrainingDate =  new Date(Date.now());
    setCurrentTermIdx((currentValue) => currentValue + 1)
  }
  const onWrongClicked = () => {
      termTrainingProgress[currentTermIdx].iterationNumber = 0;
      termTrainingProgress[currentTermIdx].lastTrainingDate =  new Date(Date.now());
      setCurrentTermIdx((currentValue) => currentValue + 1)
  }

  return (
      <Container className="page">
          <Card question={question} answer={answer}/>
          <button onClick={onHomeButtonClicked}> Home</button>
          <button onClick={onRightClicked}>Right</button>
          <button onClick={onWrongClicked}>Wrong</button>
      </Container>
  );
}

export default TrainingSession;