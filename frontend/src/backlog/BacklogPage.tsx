import React, {useContext, useState} from "react";
import ProfileContext from "../contexts/ProfileContext";
import {CButton, CTable, CTableBody, CTableDataCell, CTableHeaderCell, CTableRow} from "@coreui/react";
import {markProfileDirty} from "../services/Persistence";
import {LepeatProfile} from "../model/LepeatProfile";

const getBacklogTerms = (profile: LepeatProfile) => {
    return profile.terms.map((e, idx) => ({
        ...e,
        idx
    })).filter(e => e.isBacklog)
}
function BacklogPage() {
    const {profile} = useContext(ProfileContext);
    const [termsToRender, setTermsToRender] = useState(getBacklogTerms(profile))

    //Add buttons: Add all / Add N
    const moveToLearn = (idx: number) => {
        const term = profile.terms[idx];
        term.isBacklog = false;
        markProfileDirty(profile);
        setTermsToRender(getBacklogTerms(profile))
    }

    return (
        <CTable>
            <CTableBody>
                {termsToRender.map((t, idx) =>
                    <CTableRow key={`term-${idx}`} color={idx % 2 == 0 ? "light" : ""}>
                        <CTableDataCell
                            className="w-75">{Array.from(t.attributeValues.values()).join("; ")}</CTableDataCell>
                        <CTableDataCell><CButton className="mx-1" color={"success"}
                                                 onClick={() => moveToLearn(t.idx)}>To Learn</CButton></CTableDataCell>
                    </CTableRow>)}
            </CTableBody>
        </CTable>
    )
}

export default BacklogPage;