import React, {useContext, useRef, useState} from "react";
import ProfileContext from "../../contexts/ProfileContext";
import TermTraining from "./TermTraining";
import {CButton, CFormInput, CInputGroup, CInputGroupText} from "@coreui/react";
import TrainingIntervals from "./TrainingIntervals";
import {DEFAULT_LEARNING_INTERVALS, DEFAULT_REPETITION_INTERVALS} from "../../model/TrainingDefinition";

function AddNewTraining() {
    const {profile} = useContext(ProfileContext);
    const termDefinitions = profile.termDefinitions;

    const [termsTrainingData, setTermsTrainingData] = useState(termDefinitions.map(e => ({
        termDefinition: e,
        questionString: "",
        answerString: "",
        isEnabled: true
    })));

    const learningIntervals = useRef(DEFAULT_LEARNING_INTERVALS);
    const repetitionIntervals = useRef(DEFAULT_REPETITION_INTERVALS);

    const [trainingName, setTrainingName] = useState("");

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

    const onSaveClicked = () => {
        console.log(learningIntervals.current)
        console.log(repetitionIntervals.current)
    }

    const trainingNameChanged = (newTrainingName: string) => {
        setTrainingName(newTrainingName);
    }

    const onLearningIntervalsChanges = (intervals: number[]) => {
        learningIntervals.current = intervals
    }
    const onRepetitionIntervalsChanges = (intervals: number[]) => {
        repetitionIntervals.current = intervals
    }

    return (
        <div>
            <CFormInput className="w-50 mb-4" placeholder={"Training name"} onChange={(e) => trainingNameChanged(e.target.value)} value={trainingName}/>
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
                )})
            }

            <div className="d-flex flex-column gap-4">
                <TrainingIntervals title={"Learning intervals (in minutes)"} intervals={learningIntervals.current} onIntervalsChanges={onLearningIntervalsChanges}/>
                <TrainingIntervals title={"Repetition intervals (in days)"} intervals={repetitionIntervals.current} onIntervalsChanges={onRepetitionIntervalsChanges}/>
            </div>


            <CButton className="mt-3" color={"info"} onClick={() => onSaveClicked()}>Save</CButton>
        </div>
    )
}

export default AddNewTraining;