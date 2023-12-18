import React, { useState } from "react";
import { Container } from "react-bootstrap";
import Card from './Card';
import './wordCheck.scss';
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from '../slices/trainingSlice'



function WordCheckComponent() {
  const [word, setWord] = useState("Example Word");
  const [definition, setDefinition] = useState("Example Definition");
  const count = useSelector((state) => state.training.value)
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

export default WordCheckComponent;