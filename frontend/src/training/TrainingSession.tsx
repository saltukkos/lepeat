import React, { useState } from "react";
import { Container } from "react-bootstrap";
import Card from './Card';
import './wordCheck.scss';
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from '../slices/trainingSessionSlice'
import {RootState} from "../redux/store";

function TrainingSession(wordsToTrain: any) {
  const dispatch = useDispatch();
  const count = useSelector((state: RootState) => state.trainingSession.value)

  const onClick = () => {
    alert("I was clicked")
  }

  return (
    <Container className="page">
        <div>
          Question:
        </div>
        <Card textToShow={"Some text to show"} onClick={onClick}/>
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