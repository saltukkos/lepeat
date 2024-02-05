import React, {useContext, useMemo, useState} from "react";
import ProfileContext from "../contexts/ProfileContext";
import {
    CButton,
    CFormInput,
    CInputGroup, CInputGroupText,
} from "@coreui/react";
import {markProfileDirty} from "../services/Persistence";
import {LepeatProfile} from "../model/LepeatProfile";
import ToastContext from "../contexts/ToastContext";
import {Column} from "react-table";
import Table from "../components/table/Table";
import {MoveToLearn, MoveToLearnWithoutMarkingProfileDirty} from "../services/TermsEditing";

const getBacklogTerms = (profile: LepeatProfile) => {
    return profile.terms.map((e, idx) => ({
        ...e,
        idx
    })).filter(e => e.isBacklog)
}

interface DataType {
    id: string,
    word: string,
    actions: any
}


function BacklogPage() {
    const {showToast} = useContext(ToastContext)
    const {profile} = useContext(ProfileContext);
    const [termsToRender, setTermsToRender] = useState(getBacklogTerms(profile))
    const [termToLearnCount, setTermToLearnCount] = useState(Math.min(30, termsToRender.length));

    let columns: Column<DataType>[] = useMemo(() => [
        {
            Header: 'Word',
            accessor: 'word',
        },
        {
            Header: 'Action',
            accessor: 'actions',
            Cell: ({row}) =>
                <CButton className="mx-1" color={"success"}
                         onClick={() => moveToLearn(row.original.id)}>To Learn</CButton>,
        }
    ], []);

    const moveToLearn = (id: string) => {
        const term = profile.terms.find(e => e.id === id);
        if (term) {
            MoveToLearn(term, profile);
            term.isBacklog = false;
            markProfileDirty(profile);
            setTermsToRender(getBacklogTerms(profile))
        }
    }

    const moveAllToLearn = () => {
        termsToRender.forEach(t => MoveToLearnWithoutMarkingProfileDirty(profile.terms[t.idx]));
        markProfileDirty(profile);
        setTermsToRender(getBacklogTerms(profile));
    }

    const moveNFirstToLearn = () => {
        if (termsToRender.length < termToLearnCount) {
            showToast(`${termToLearnCount} is more than available terms to learn ${termsToRender.length}`, "warning")
            return;
        }

        if (termToLearnCount < 0) {
            showToast(`${termToLearnCount} is negative value`, "warning")
            return;
        }

        termsToRender.slice(0, termToLearnCount).forEach(t => MoveToLearnWithoutMarkingProfileDirty(profile.terms[t.idx]));
        markProfileDirty(profile);
        setTermsToRender(getBacklogTerms(profile));
    }

    const onInputChange = (value: string) => {
        setTermToLearnCount(+value);
    }

    const data = termsToRender.map(e => ({
        id: e.id,
        word: Array.from(e.attributeValues.values()).join("; ")
    }));

    const header = <>
        <CButton onClick={moveAllToLearn} color="primary">Learn all terms</CButton>
        <CInputGroup className="w-25">
            <CInputGroupText id="inputGroup-sizing-default">Learn</CInputGroupText>
            <CFormInput type="number" min={0} max={termsToRender.length} id={"termsToLearnCountInput"}
                        value={termToLearnCount} aria-describedby="basic-addon3"
                        onChange={(e) => onInputChange(e.target.value)}/>
            <CButton color="primary" onClick={moveNFirstToLearn}>First terms</CButton>
        </CInputGroup></>

    return (
        <>
            <Table data={data} columns={columns} additionalHeaderElements={header}/>
        </>

    )
}

export default BacklogPage;