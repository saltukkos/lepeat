import React, {useContext, useMemo, useState} from "react";
import ProfileContext from "../../../contexts/ProfileContext";
import Table from "../../table/Table";
import {dateInHhMmDdMmYyyy} from "../../../utils/time";

const COLUMNS_PREDEFINED = [
    {
        Header: 'ID',
        accessor: 'id_number',
    },
    {
        Header: 'Term',
        accessor: 'term',
    }
];

//TODO support bran new Trainings
//TODO try to get rid of any
//TODO add memo for columns and data
function Statistics() {
    const {profile} = useContext(ProfileContext);

    const terms = profile.terms;
    const trainingProgresses = profile.trainingProgresses;

    let columns: any[] = [...COLUMNS_PREDEFINED]
    Array.from(trainingProgresses.keys()).forEach((trainingDefinition, idx) => {
        columns.push({
            Header: trainingDefinition.name,
            columns: [
                {
                    Header: "Iteration",
                    accessor: `training-${idx}-iteration`
                },
                {
                    Header: "Last training time",
                    accessor: `training-${idx}-time`
                }
            ]
        })
    });


    const data: any[] = []
    terms.forEach((term) => {
        let termStringRepresentation = Array.from(term.attributeValues.values()).join('; ');

        const termData: any = {id_number: term.id, term: termStringRepresentation};
        // here i relay on order in map. should be fixed in the future
        Array.from(trainingProgresses.values()).forEach((trainingProgress, idx) => {
            let termProgress = trainingProgress.progress.get(term);

            termData[`training-${idx}-iteration`] = termProgress ? termProgress.iterationNumber : "-"
            termData[`training-${idx}-time`] = termProgress ? termProgress.lastTrainingDate ?  dateInHhMmDdMmYyyy(termProgress.lastTrainingDate) : '-' : '-';
        })
        data.push(termData)
    })

    return <Table columns={columns} data={data}/>
}

export default Statistics;