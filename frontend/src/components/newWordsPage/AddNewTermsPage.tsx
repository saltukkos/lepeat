import React, {ChangeEvent, useContext, useState} from "react";
import {AttributeDefinition} from "../../model/AttributeDefinition";
import ToastContext from "../../contexts/ToastContext";
import ProfileContext from "../../contexts/ProfileContext";

function AddNewTermsPage() {
    const { showToast } = useContext(ToastContext)
    const { profile } = useContext(ProfileContext);

    const termDefinitions = profile.termDefinitions;
    const terms = profile.terms;

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
        showToast("Word added", "success")
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
    </div>
}

export default AddNewTermsPage;