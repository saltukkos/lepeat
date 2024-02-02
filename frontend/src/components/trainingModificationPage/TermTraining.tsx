import React, {ChangeEvent, FC, useEffect, useState} from "react";
import {CCardText, CFormCheck, CFormInput, CFormSelect, CInputGroup, CInputGroupText} from "@coreui/react";
import {TermDefinition} from "../../model/TermDefinition";

interface TermTrainingProps {
    questionString: string,
    answerString: string,
    termDefinition: TermDefinition,
    questionInputChanged: (value: string) => void;
    answerInputChanged: (value: string) => void;
    checkBoxClicked: () => void;
    isEnabled: boolean;
}

// TODO: exclude already existing terms in training from termDefinitions Array
const TermTraining: FC<TermTrainingProps> = (props) => {
    const {
        questionString,
        answerString,
        termDefinition,
        questionInputChanged,
        answerInputChanged,
        checkBoxClicked,
        isEnabled
    } = props;
    const onCheckBoxClicked = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        e.preventDefault();
        checkBoxClicked();
    }

    return (
        <div className="d-flex justify-content-between">
            <CFormCheck id="termEnabled" onClick={(e) => onCheckBoxClicked(e)} defaultChecked={isEnabled}/>
            <div className="mb-3 w-100 ms-2">
                <CFormInput className="mb-2"  type="text" placeholder={termDefinition.name} disabled/>

                <CInputGroup className="mb-3">
                    <CInputGroupText id="inputGroup-sizing-default">Question</CInputGroupText>
                    <CFormInput value={questionString}
                                disabled={!isEnabled}
                                onChange={(e) => questionInputChanged(e.target.value)}/>
                </CInputGroup>

                <CInputGroup className="mb-3">
                    <CInputGroupText id="inputGroup-sizing-default">Answer</CInputGroupText>
                    <CFormInput value={answerString}
                                disabled={!isEnabled}
                                onChange={(e) => answerInputChanged(e.target.value)}/>
                </CInputGroup>
            </div>
        </div>
    )
}

export default TermTraining;