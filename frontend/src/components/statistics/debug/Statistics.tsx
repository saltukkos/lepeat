import React from "react";
import {profileSelector} from "../../../slices/profileSlice";
import {useAppSelector} from "../../../redux/hooks";

function Statistics() {
    const profile = useAppSelector(profileSelector).profile;
    const terms = profile.terms;
    const trainingProgresses = profile.trainingProgresses;

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
                let lastTrainingDate = termProgress.lastTrainingDate;
                let progressInfo = `${termProgress.iterationNumber}; ${lastTrainingDate ? new Date(lastTrainingDate) : undefined}`
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


    return (
        <div>
            <table>{table}</table>
        </div>);
}

export default Statistics;