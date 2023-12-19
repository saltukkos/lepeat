import React, { useState } from "react";
import { Container } from "react-bootstrap";
import Card from './Card';
import './wordCheck.scss';
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from '../slices/trainingSlice'

function TrainingSession(wordsToTrain) {
  const dispatch = useDispatch()

  const onClick = () => {
    alert("I was clicked")
  }

  return (
    <Container className="page">
        <div>
          Question:
        </div>
        <Card textToShow={"Some text to show"} onClick={onClick}/>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <span>{count}</span>
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