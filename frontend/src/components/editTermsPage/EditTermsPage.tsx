import React, {useContext, useState} from "react";
import {AttributeDefinition} from "../../model/AttributeDefinition";
import ProfileContext from "../../contexts/ProfileContext";
import {markProfileDirty} from "../../services/Persistence";
import {CButton, CFormInput, CFormLabel, CTable, CTableBody, CTableHeaderCell, CTableRow} from "@coreui/react";

function EditTermsPage() {
    const { profile } = useContext(ProfileContext);

    const [editableTermIdx, setEditableTermIdx] = useState(-1);
    const [inputsData, setInputsData] = useState<[AttributeDefinition, string][]>([]);
    const [termsToRender, setTermsToRender] = useState(profile.terms);

    const editTerm = (idx: number) => {
        setInputsData(Array.from(termsToRender[idx].attributeValues.entries()));
        console.log(idx);
        setEditableTermIdx(idx);
    }

    const removeTerm = (idx: number) => {
        profile.terms.splice(idx, 1);
        setTermsToRender([...profile.terms]);
        markProfileDirty(profile);
    }

    const onChangeInput = (attribute: AttributeDefinition, newValue: string, idx: number) => {
        setInputsData(inputs => {
            inputs[idx] = [attribute, newValue];
            return [...inputs];
        })
    }

    const onSaveEdition = () => {
        const newTermAttributesData = new Map<AttributeDefinition, string>();
        for (let i = 0; i < inputsData.length; i++) {
            newTermAttributesData.set(inputsData[i][0], inputsData[i][1]);
        }

        termsToRender[editableTermIdx].attributeValues = newTermAttributesData
        markProfileDirty(profile);
        setEditableTermIdx(-1);
    }

    return (
        <CTable>
            <CTableBody>
                {termsToRender.map((t, idx) => {
                    const termRow = idx === editableTermIdx ?
                        <>
                            {
                                inputsData.map((attributeData, attrIdx) => {
                                    return (
                                        <CFormInput key={`${attrIdx}`} type="text" id="idx" value={attributeData[1]}
                                               onChange={(e) => onChangeInput(attributeData[0], e.target.value, attrIdx)}/>
                                    )
                                })
                            }
                        </> : <CFormLabel>{Array.from(t.attributeValues.values()).join("; ")}</CFormLabel> ;

                    return (
                        <CTableRow key={`term-${idx}`} color={idx % 2 == 0 ? "light" : ""}>
                            <CTableHeaderCell className="w-75">{termRow}</CTableHeaderCell>
                            <CTableHeaderCell>
                                {idx === editableTermIdx ?<CButton className="mx-2" color={"info"} onClick={() => onSaveEdition()}>Save</CButton> : <CButton className="mx-2" color={"success"} onClick={() => editTerm(idx)}>Edit</CButton>}
                            </CTableHeaderCell>
                            <CTableHeaderCell>
                                <CButton className="mx-1" color={"warning"} onClick={() => removeTerm(idx)}>Remove</CButton>
                            </CTableHeaderCell>
                        </CTableRow>
                    )
                })}
            </CTableBody>
        </CTable>
    )
}

export default EditTermsPage