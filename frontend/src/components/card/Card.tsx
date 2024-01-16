import React, {useEffect, useState} from "react";
import {CCard, CCardFooter, CCardText, CCardTitle} from "@coreui/react";
import {Status, TermTrainingProgress} from "../../model/TrainingProgress";

type CardProps = {
    question: string;
    answer: string;
    termTrainingProgress: TermTrainingProgress;
};

function Card({question, answer, termTrainingProgress}: CardProps) {
    const [mode, setMode] = useState<"QUESTION" | "ANSWER">("QUESTION");

    useEffect(() => {
        setMode("QUESTION")
    }, [question, answer]);

    const onClick = () => {
        setMode(mode === "QUESTION" ? "ANSWER" : "QUESTION");
    }

    const getIterationsDescription = () => {
        const readableIteration = termTrainingProgress.iterationNumber + 1;
        switch (termTrainingProgress.status) {
            case Status.Learning:
                return `Learn: iteration ${readableIteration}`;
            case Status.Repetition:
                return `Repeat: iteration ${readableIteration}`;
            case Status.Relearning:
                return `Relearn: back from iteration ${readableIteration}`;
        }
    }    
    return (
        <CCard 
            className="text-center"
            style={{ minWidth: '19rem' }}>

            <div className="m-2" onClick={onClick}>
                <CCardTitle>{mode}</CCardTitle>
                <CCardText className="m-2 d-flex align-items-center justify-content-center" style={{ minHeight: '3rem' }}>
                    {mode === "QUESTION" ? question : answer}
                </CCardText>
            </div>
            <CCardFooter className="text-body-secondary py-1" onClick={onClick}>
                <small>
                    {getIterationsDescription()}
                </small>
            </CCardFooter>
        </CCard>
    )
}


export default Card;