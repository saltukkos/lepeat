import React, {ChangeEvent, useState} from "react";
import {TermDefinition} from "../../model/TermDefinition";
import {Term} from "../../model/Term";
import {AttributeDefinition} from "../../model/AttributeDefinition";

interface AddNewTermsPageProps {
    termDefinitions: TermDefinition[],
    onHomeButtonClicked: () => void,
    terms: Term[]
}
function AddNewTermsPage({termDefinitions, onHomeButtonClicked, terms} : AddNewTermsPageProps) {
    const [selectedTermDefinitionsIdx, setSelectedTermDefinitionsIdx] = useState(0);

    const selectedTermDefinition = termDefinitions[selectedTermDefinitionsIdx];

    const t: string[] = []
    const [inputsData, setInputsData] = useState(t);

    const onChangeSelect = (e : ChangeEvent<HTMLSelectElement>) => {
        setSelectedTermDefinitionsIdx(+e.target.value)
        setInputsData([])
    }

    const onChangeInput = (value: string, attributeIdx: number) => {
        setInputsData(e => {
            e[attributeIdx] = value
            return [...e];
        })
    }

    const onSaveClicked = () => {
        const newTermAttributesData = new Map<AttributeDefinition, string>();
        for (let i = 0; i < selectedTermDefinition.attributes.length; i++) {
            newTermAttributesData.set(selectedTermDefinition.attributes[i], inputsData[i]);
        }
        const maxId = terms.reduce((max, term) => Math.max(max, term.id), 0);
        terms.push({id: maxId + 1, termDefinition: selectedTermDefinition, attributeValues: newTermAttributesData})
        setInputsData([]);
    }

    return <div>

        <select name="termDefinition" id="termDefinition" onChange={onChangeSelect}>
            {termDefinitions.map((e, idx) => {
                return (
                    <option value={`${idx}`}>{e.name}</option>
                )
            })}
        </select>


        {selectedTermDefinition.attributes.map((e, idx) => {
            return (
                <div>
                    <label>{e.name}</label>
                    <input type="text" id="idx" value={inputsData[idx] ?? ""} onChange={(e) => onChangeInput(e.target.value, idx)}/><br/><br/>
                </div>
            );
        })}
        <button onClick={onSaveClicked}>Save</button>


        <button onClick={onHomeButtonClicked}>Home</button>
    </div>
}

export default AddNewTermsPage;