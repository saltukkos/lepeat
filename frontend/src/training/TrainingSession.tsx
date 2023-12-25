import React, { useState } from "react";
import { Container } from "react-bootstrap";
import Card from './Card';
import './wordCheck.scss';
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from '../slices/trainingSessionSlice'
import {RootState} from "../redux/store";
import {TrainingDefinition} from "../model/TrainingDefinition";
import {TermTrainingProgress} from "../model/TrainingProgress";

interface TrainingSessionProps {
    trainingDefinition: TrainingDefinition,
    termTrainingProgress: TermTrainingProgress[]
}

function TrainingSession({trainingDefinition, termTrainingProgress}: TrainingSessionProps) {
  const dispatch = useDispatch();
  const count = useSelector((state: RootState) => state.trainingSession.value);

  const [currentTermIdx, setCurrentTermIdx] = useState(0);

  if (currentTermIdx >= termTrainingProgress.length) {
      return <div>Finished</div>
  }

  let currentTermProgress = termTrainingProgress[currentTermIdx];
  let currentTerm = currentTermProgress.term;

  let currentTermDefinition = currentTerm.termDefinition;
  let currentRule = trainingDefinition.configuration.get(currentTermDefinition)!; // TODO think on corner case
  let question = currentRule.attributesToShow.map(a => currentTerm.attributeValues.get(a)).join(" ");
  let answer = currentRule.attributesToGuess.map(a => currentTerm.attributeValues.get(a)).join(" ");

  return (
    <Container className="page">
        <div>
          Question:
        </div>
        <Card question = {question} answer = {answer} />
        <span>{count}</span>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>

    </Container>
  );
}

export default TrainingSession;