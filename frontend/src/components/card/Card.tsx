import React, {useState} from "react";
import './card.scss';

type CardProps = {
    question: string;
    answer: string;
};

function Card({question, answer}: CardProps) {
    const [mode, setMode] = useState<"QUESTION" | "ANSWER">("QUESTION");

    const onClick = () => {
        setMode(mode === "QUESTION" ? "ANSWER" : "QUESTION");
    }

    return (
        <div className="card" onClick={onClick}>
            <div>
                {mode}
            </div>
            {mode === "QUESTION" ? question : answer}
        </div>
    )
}


export default Card;