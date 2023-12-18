import React, { useState } from "react";
import './card.scss';

function Card({ textToShow, onClick }) {
    return (   
        <div className="card" onClick={onClick}>
            {textToShow}
        </div>
    )
}


export default Card;