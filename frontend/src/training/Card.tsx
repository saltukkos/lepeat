import React from "react";
import './card.scss';

type CardProps = {
    textToShow: string;
    onClick: () => void
};
function Card({textToShow, onClick} : CardProps) {
    return (   
        <div className="card" onClick={onClick}>
            {textToShow}
        </div>
    )
}


export default Card;