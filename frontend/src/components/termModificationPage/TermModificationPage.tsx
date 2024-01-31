import React, {ChangeEvent, FC, useContext, useEffect, useState} from "react";
import ToastContext from "../../contexts/ToastContext";
import ProfileContext from "../../contexts/ProfileContext";
import {AttributeDefinition} from "../../model/AttributeDefinition";
import {markProfileDirty} from "../../services/Persistence";
import {CButton, CFormInput, CFormSelect, CInputGroup, CInputGroupText} from "@coreui/react";
import {useNavigate, useParams} from "react-router-dom";
import {TermDefinition} from "../../model/TermDefinition";
import {Term} from "../../model/Term";

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

function copyTermData(term: Term) {
    return {...term, attributeValues: new Map(term.attributeValues)}
}

function TermModificationPage() {
    const {id} = useParams();
    const navigate = useNavigate();
    const isEditMode = id !== undefined;

    const {profile} = useContext(ProfileContext);
    const {showToast} = useContext(ToastContext)

    const termDefinitions = profile.termDefinitions;
    const terms = profile.terms;
    const [shownTerm, setShownTerm] = useState(getInitTermData(termDefinitions[0]));
    const [isIdCorrect, setIsIdCorrect] = useState(true);

    useEffect(() => {
        if (isEditMode) {
            const selectedTerm = profile.terms.find(e => e.id === +id)
            if (!selectedTerm) {
                setIsIdCorrect(false);
            } else {
                setShownTerm(copyTermData(selectedTerm))
            }
        }
    }, [])

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

    const onDeleteClicked = () => {
        console.log("here")
        console.log(id)
        if (!id) {
            return;
        }
        profile.terms = profile.terms.filter(e => e.id !== +id);
        markProfileDirty(profile)
        showToast("Word removed")
        navigate(-1)
    }

    return isIdCorrect ? (<div>
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
        <div className="mt-5 d-flex justify-content-between">
            <CButton onClick={onSaveClicked} color="primary">Save</CButton>
            {isEditMode ? <CButton onClick={onDeleteClicked} color="danger">Delete</CButton> : null}
        </div>
    </div>) : <div>Id is not correct</div>;

}

export default TermModificationPage;