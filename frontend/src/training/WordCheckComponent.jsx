import React, { useState } from "react";
import { Container } from "react-bootstrap";
import Card from './Card';
import './wordCheck.scss';

function WordCheckComponent() {
  const [word, setWord] = useState("Example Word");
  const [definition, setDefinition] = useState("Example Definition");

  const cardStyle = {
    width: "18rem",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  const onClick = () => {
    alert("I was clicked")
  }

  return (
    <Container className="page">
        <div>
          Question:
        </div>
        <Card textToShow={"Some text to show"} onClick={onClick}/>
    </Container>
  );
}

export default WordCheckComponent;