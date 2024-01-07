import React, {useState} from "react";
import {AttributeDefinition} from "../../model/AttributeDefinition";
import {useAppSelector} from "../../redux/hooks";
import {profileSelector} from "../../slices/profileSlice";

function EditTermsPage() {
    const profile = useAppSelector(profileSelector).profile;
    const terms = profile.terms;

    const [editableTermIdx, setEditableTermIdx] = useState(-1);

    const t: [AttributeDefinition, string][] = []
    const [inputsData, setInputsData] = useState(t);

    const editTerm = (idx: number) => {
        setInputsData(Array.from(terms[idx].attributeValues.entries()));
        setEditableTermIdx(idx);
    }

    //TODO implement
    const removeTerm = (idx: number) => {}

    const onChangeInput = (attribute: AttributeDefinition, newValue: string, idx: number) => {
        setInputsData(id => {
            id[idx] = [attribute, newValue];
            return [...id];
        })
    }

    const onSaveEdition = () => {
        const newTermAttributesData = new Map<AttributeDefinition, string>();
        for (let i = 0; i < inputsData.length; i++) {
            newTermAttributesData.set(inputsData[i][0], inputsData[i][1]);
        }

        terms[editableTermIdx].attributeValues = newTermAttributesData
        setEditableTermIdx(-1);
    }


    return (
        <div>
            {terms.map((t, idx) => {
                const termRow = idx === editableTermIdx ?
                    <>
                        {
                            inputsData.map((attributeData, attrIdx) => {
                                return (
                                    <input type="text" id="idx" value={attributeData[1]}
                                           onChange={(e) => onChangeInput(attributeData[0], e.target.value, attrIdx)}/>
                            )
                            })
                        }
                    </> : Array.from(t.attributeValues.values()).join("; ");

                return (
                    <div>
                        {termRow}
                        {idx === editableTermIdx ?<button onClick={() => onSaveEdition()}>Save</button> : <button onClick={() => editTerm(idx)}>Edit</button>}
                        <button>Remove</button>
                    </div>
                )
            })}
        </div>
    )
}

export default EditTermsPage