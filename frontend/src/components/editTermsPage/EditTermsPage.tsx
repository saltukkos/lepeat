import React, {useContext, useEffect, useState} from "react";
import {AttributeDefinition} from "../../model/AttributeDefinition";
import {LepeatProfile} from "../../model/LepeatProfile";
import ProfileContext from "../../contexts/ProfileContext";
import {germanProfile} from "../../model/DefaultModel";

function EditTermsPage() {
    const { getLepeatProfile } = useContext(ProfileContext);
    const [profile, setProfile] = useState<LepeatProfile>(germanProfile);

    useEffect(() => {
        setProfile(getLepeatProfile());
    }, [getLepeatProfile]);

    const terms = profile.terms;

    const [editableTermIdx, setEditableTermIdx] = useState(-1);
    const [inputsData, setInputsData] = useState<[AttributeDefinition, string][]>([]);

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
                                    <input key={`${attributeData[1]}-${attrIdx}`} type="text" id="idx" value={attributeData[1]}
                                           onChange={(e) => onChangeInput(attributeData[0], e.target.value, attrIdx)}/>
                            )
                            })
                        }
                    </> : Array.from(t.attributeValues.values()).join("; ");

                return (
                    <div key={`term-${idx}`}>
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