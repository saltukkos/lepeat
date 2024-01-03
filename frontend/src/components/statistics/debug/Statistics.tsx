import React from "react";
import {Term} from "../../../model/Term";
import {TrainingDefinition} from "../../../model/TrainingDefinition";
import {TrainingProgress} from "../../../model/TrainingProgress";

interface StatisticsProps {
    terms: Term[],
    trainingProgresses: Map<TrainingDefinition, TrainingProgress>

}

function Statistics({terms, trainingProgresses}: StatisticsProps) {
    let tableData: string[][] = [];

    let firstLine: string[] = [];
    firstLine.push("");

    trainingProgresses.forEach((_, key) => {
        firstLine.push(key.name)
    });

    tableData.push(firstLine);

    terms.forEach((term) => {
        let termRow: string[] = [];

        let termStringRepresentation = Array.from(term.attributeValues.values()).join('; ');
        termRow.push(termStringRepresentation);

        // here i relay on order in map. should be fixed in the future
        trainingProgresses.forEach((trainingProgress, definition) => {
            let termProgress = trainingProgress.progress.get(term);

            if (!!termProgress) {
                let progressInfo = `${termProgress.iterationNumber}; ${termProgress.lastTrainingDate}`
                termRow.push(progressInfo);
            } else {
                termRow.push("--"); //empty value
            }
        })
        tableData.push(termRow);
    })

    let table = tableData.map((row) => {
        return <tr>{
            row.map((column) => {
                return <td>{column}</td>
            })
        }</tr>
    });


    return <table>{table}</table>
}

export default Statistics;