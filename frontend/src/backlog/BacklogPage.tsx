import React, {useContext, useState} from "react";
import ProfileContext from "../contexts/ProfileContext";
import {
    CButton,
    CFormInput,
    CInputGroup, CInputGroupText,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableRow
} from "@coreui/react";
import {markProfileDirty} from "../services/Persistence";
import {LepeatProfile} from "../model/LepeatProfile";
import ToastContext from "../contexts/ToastContext";

const getBacklogTerms = (profile: LepeatProfile) => {
    return profile.terms.map((e, idx) => ({
        ...e,
        idx
    })).filter(e => e.isBacklog)
}
function BacklogPage() {
    const { showToast } = useContext(ToastContext)
    const {profile} = useContext(ProfileContext);
    const [termsToRender, setTermsToRender] = useState(getBacklogTerms(profile))
    const [termToLearnCount, setTermToLearnCount] = useState(Math.min(30, termsToRender.length));

    const moveToLearn = (idx: number) => {
        const term = profile.terms[idx];
        term.isBacklog = false;
        markProfileDirty(profile);
        setTermsToRender(getBacklogTerms(profile))
    }

    const moveAllToLearn = () => {
        termsToRender.forEach(t => profile.terms[t.idx].isBacklog = false);
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

        termsToRender.slice(0, termToLearnCount).forEach(t => profile.terms[t.idx].isBacklog = false);
        markProfileDirty(profile);
        setTermsToRender(getBacklogTerms(profile));
    }

    const onInputChange = (value: string) => {
        setTermToLearnCount(+value);
    }

    return (
        <>
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <CButton onClick={moveAllToLearn} color="primary">Learn all terms</CButton>
                <CInputGroup className="w-25" >
                    <CInputGroupText id="inputGroup-sizing-default">Learn</CInputGroupText>
                    <CFormInput type="number" min={0} max={termsToRender.length} id={"termsToLearnCountInput"} value={termToLearnCount} aria-describedby="basic-addon3" onChange={(e) => onInputChange(e.target.value)}/>
                    <CButton color="primary" onClick={moveNFirstToLearn}>First terms</CButton>
                </CInputGroup>
            </div>
            <CTable>
                <CTableBody>
                    {termsToRender.map((t, idx) =>
                        <CTableRow key={`term-${idx}`} color={idx % 2 == 0 ? "light" : ""}>
                            <CTableDataCell
                                className="w-75">{Array.from(t.attributeValues.values()).join("; ")}</CTableDataCell>
                            <CTableDataCell><CButton className="mx-1" color={"success"}
                                                     onClick={() => moveToLearn(t.idx)}>To
                                Learn</CButton></CTableDataCell>
                        </CTableRow>)}
                </CTableBody>
            </CTable>
        </>

    )
}

export default BacklogPage;