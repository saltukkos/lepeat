import React, {ChangeEvent, FC, useContext, useState} from "react";
import ToastContext from "../../contexts/ToastContext";
import ProfileContext from "../../contexts/ProfileContext";
import {AttributeDefinition} from "../../model/AttributeDefinition";
import {markProfileDirty} from "../../services/Persistence";
import {CButton, CFormInput, CFormSelect, CInputGroup, CInputGroupText} from "@coreui/react";
import {useNavigate, useParams} from "react-router-dom";
import {TermDefinition} from "../../model/TermDefinition";

const TermDefinitionSelection: FC<{
    onChangeSelect: (e: ChangeEvent<HTMLSelectElement>) => void,
    selectedDefinition: TermDefinition
}> = ({onChangeSelect, selectedDefinition}) => {
    const {profile} = useContext(ProfileContext);
    const termDefinitions = profile.termDefinitions;

    const selectedDefinitionIdx = termDefinitions.findIndex(e => e === selectedDefinition)

    return (<CFormSelect
        onChange={onChangeSelect}
        options={
            termDefinitions.map((e, idx) => ({label: e.name, value: `${idx}`})
            )
        }
        value={selectedDefinitionIdx}
        className="mb-4"
    />)
}

function getInitTermData(termDefinition: TermDefinition) {
    const attributeValues = new Map<AttributeDefinition, string>();
    termDefinition.attributes.forEach(e => attributeValues.set(e, ""));

    return {
        termDefinition,
        attributeValues
    }
}

function TermModificationPage() {
    const {id} = useParams();
    const navigate = useNavigate();
    const isEditMode = id !== undefined;

    //TODO validate id

    const {showToast} = useContext(ToastContext)
    const {profile} = useContext(ProfileContext);

    const termDefinitions = profile.termDefinitions;
    const terms = profile.terms;
    const [shownTerm, setShownTerm] = useState(
        () => isEditMode ? profile.terms.find(e => e.id === +id)! :
        getInitTermData(termDefinitions[0]));

    const onChangeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
        setShownTerm({
            ...shownTerm,
            termDefinition: termDefinitions[+e.target.value],
        })
    }

    const onChangeInput = (value: string, attribute: AttributeDefinition) => {
        shownTerm.attributeValues.set(attribute, value);
        setShownTerm({...shownTerm});
    }

    const onSaveClicked = () => {
        const newTermAttributesData = new Map<AttributeDefinition, string>();
        shownTerm.termDefinition.attributes.forEach(e => newTermAttributesData.set(e, shownTerm.attributeValues.get(e) ?? ""));

        if (isEditMode) {
            const currentWord = terms.find(e => e.id === +id)!;
            currentWord.attributeValues = newTermAttributesData;
            currentWord.termDefinition = shownTerm.termDefinition;
        } else {
            const maxId = terms.reduce((max, term) => Math.max(max, term.id), 0);
            terms.push({
                id: maxId + 1,
                termDefinition: shownTerm.termDefinition,
                attributeValues: newTermAttributesData,
                isBacklog: true
            })
        }

        markProfileDirty(profile);
        showToast(isEditMode ? "Word edited" : "Word added", "success")

        if (isEditMode) {
            navigate(-1)
        }
    }

    return <div>
        <TermDefinitionSelection onChangeSelect={onChangeSelect} selectedDefinition={shownTerm.termDefinition}/>
        {shownTerm.termDefinition.attributes.map((attribute, idx) => {
            let data = shownTerm.attributeValues.get(attribute) ?? "";
            return (
                <CInputGroup className="mb-3" key={idx}>
                    <CInputGroupText id="basic-addon3">{attribute.name}</CInputGroupText>
                    <CFormInput id={`${data}-${idx}`} value={data} aria-describedby="basic-addon3"
                                onChange={(e) => onChangeInput(e.target.value, attribute)}/>
                </CInputGroup>
            );
        })}
        <CButton onClick={onSaveClicked} color="primary">Save</CButton>
    </div>

}

export default TermModificationPage;