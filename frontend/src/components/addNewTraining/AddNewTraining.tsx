import React, {ChangeEvent, FC, useContext, useState} from "react";
import {TermDefinition} from "../../model/TermDefinition";
import ProfileContext from "../../contexts/ProfileContext";
import TermTraining from "./TermTraining";
import {cilTrash} from "@coreui/icons";

function AddNewTraining() {
    const {profile} = useContext(ProfileContext);
    const termDefinitions = profile.termDefinitions;

    const [termsTrainingData, setTermsTrainingData] = useState(termDefinitions.map(e => ({
        termDefinition: e,
        questionString: "",
        answerString: "",
        isEnabled: true
    })));

    const indexifyFunction = <Type, >(idx: number, f: (idx: number, value: Type) => void) => {
        return (value: Type) => f(idx, value)
    }

    const onQuestionStringChanges = (idx: number, value: string) => {
        termsTrainingData[idx].questionString = value;
        setTermsTrainingData([...termsTrainingData]);
    }
    const onAnswerStringChanges = (idx: number, value: string) => {
        termsTrainingData[idx].answerString = value;
        setTermsTrainingData([...termsTrainingData]);
    }

    const changeEnableState = (idx: number) => {
        termsTrainingData[idx].isEnabled = !termsTrainingData[idx].isEnabled;
        setTermsTrainingData([...termsTrainingData]);
    }

    console.log(termsTrainingData)

    return (
        <div>
            {termsTrainingData.map((e, idx) => {
                return (
                    <TermTraining
                        key={idx}
                        questionString={e.questionString}
                        answerString={e.answerString}
                        termDefinition={e.termDefinition}
                        questionInputChanged={indexifyFunction(idx, onQuestionStringChanges)}
                        answerInputChanged={indexifyFunction(idx, onAnswerStringChanges)}
                        checkBoxClicked={() => changeEnableState(idx)}
                        isEnabled={e.isEnabled}/>
                )
            })
            }
        </div>
    )
}

export default AddNewTraining;