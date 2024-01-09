import React, {ChangeEvent, useContext, useState} from "react";
import {AttributeDefinition} from "../../model/AttributeDefinition";
import ToastContext from "../../contexts/ToastContext";
import ProfileContext from "../../contexts/ProfileContext";
import {markProfileDirty} from "../../services/Persistence";
import {CButton, CFormInput, CFormSelect, CInputGroup, CInputGroupText} from "@coreui/react";

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
        markProfileDirty(profile);
        showToast("Word added", "success")
        setInputsData([]);
    }

    return <div>

        <CFormSelect
            aria-label="Default select example"
            onChange={onChangeSelect}
            options={
                termDefinitions.map((e, idx) => ({label: e.name, value: `${idx}`})
                )
            }
            className="mb-4"
        />


        {selectedTermDefinition.attributes.map((e, idx) => {
            let data = inputsData[idx] ?? "";
            return (
                <CInputGroup className="mb-3">
                    <CInputGroupText id="basic-addon3">{e.name}</CInputGroupText>
                    <CFormInput id={`${data}-${idx}`} value={data} aria-describedby="basic-addon3" onChange={(e) => onChangeInput(e.target.value, idx)}/>
                </CInputGroup>
            );
        })}
        <CButton onClick={onSaveClicked} color="primary">Save</CButton>
    </div>
}

export default AddNewTermsPage;