import React, {useEffect, useState} from "react";
import {CButton, CCard, CCardFooter, CCardHeader, CCardText, CCardTitle} from "@coreui/react";

type CardProps = {
    question: string;
    answer: string;
    onWrongClicked: () => void,
    onRightClicked: () => void,
    onSkipClicked: () => void
};

function Card({question, answer, onRightClicked, onWrongClicked, onSkipClicked}: CardProps) {
    const [mode, setMode] = useState<"QUESTION" | "ANSWER">("QUESTION");

    useEffect(() => {
        setMode("QUESTION")
    }, [question, answer]);

    const onClick = () => {
        setMode(mode === "QUESTION" ? "ANSWER" : "QUESTION");
    }

    return (
        <CCard>
            <div className="m-2 text-center" onClick={onClick}>
                <CCardTitle>{mode}</CCardTitle>
                <CCardText>
                    {mode === "QUESTION" ? question : answer}
                </CCardText>
            </div>
            <CCardFooter>
                <CButton className="mx-2" color={"danger"} onClick={onWrongClicked}>Wrong</CButton>
                <CButton className="mx-2" color={"info"} onClick={onSkipClicked}>Skip</CButton>
                <CButton className="mx-2" color={"success"} onClick={onRightClicked}>Right</CButton>
            </CCardFooter>
        </CCard>
    )
}


export default Card;