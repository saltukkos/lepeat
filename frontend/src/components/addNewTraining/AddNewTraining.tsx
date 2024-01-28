import React, {useCallback, useContext, useMemo, useRef, useState} from "react";
import ProfileContext from "../../contexts/ProfileContext";
import TermTraining from "./TermTraining";
import {CButton, CFormInput, CInputGroup, CInputGroupText} from "@coreui/react";
import TrainingIntervals from "./TrainingIntervals";
import {
    DEFAULT_LEARNING_INTERVALS,
    DEFAULT_REPETITION_INTERVALS,
    TermTrainingRule
} from "../../model/TrainingDefinition";
import {TermDefinition} from "../../model/TermDefinition";
import {validateConfiguration, validateTrainingData} from "./validation";
import ToastContext from "../../contexts/ToastContext";
import {indexifyFunction} from "../../utils/utils";
import {markProfileDirty} from "../../services/Persistence";

const getTermsTrainingInitData = (termDefinitions: TermDefinition[]) => termDefinitions.map(e => ({
    termDefinition: e,
    questionString: "",
    answerString: "",
    isEnabled: true
}));

function AddNewTraining() {
    const {profile} = useContext(ProfileContext);
    const {showToast} = useContext(ToastContext)

    const termDefinitions = profile.termDefinitions;

    const [termsTrainingData, setTermsTrainingData] = useState(getTermsTrainingInitData(termDefinitions));

    const [learningIntervals, setLearningIntervals] = useState(DEFAULT_LEARNING_INTERVALS);
    const [repetitionIntervals, setRepetitionIntervals] = useState(DEFAULT_REPETITION_INTERVALS);

    const [trainingName, setTrainingName] = useState("");

    const setInitState = useCallback(() => {
        setTrainingName("");
        setTermsTrainingData(getTermsTrainingInitData(termDefinitions));
        setLearningIntervals(DEFAULT_LEARNING_INTERVALS)
        setRepetitionIntervals(DEFAULT_REPETITION_INTERVALS)
    }, [setTrainingName, setTermsTrainingData]);

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

    const trainingNameChanged = (newTrainingName: string) => {
        setTrainingName(newTrainingName);
    }

    const onLearningIntervalsChanges = (intervals: number[]) => {
        setLearningIntervals([...intervals])
    }
    const onRepetitionIntervalsChanges = (intervals: number[]) => {
        setRepetitionIntervals([...intervals])
    }

    const onSaveClicked = () => {
        const validationError = validateTrainingData(profile, trainingName, learningIntervals, repetitionIntervals);

        if (validationError) {
            showToast(validationError, "danger");
            return;
        }

        const configuration = new Map<TermDefinition, TermTrainingRule>;
        termsTrainingData.filter(e => e.isEnabled).forEach(e => configuration.set(e.termDefinition, {
            questionPattern: e.questionString,
            answerPattern: e.answerString
        }));

        const configurationError = validateConfiguration(configuration);
        if (configurationError) {
            showToast(configurationError, "danger");
            return;
        }

        profile.trainingDefinitions.push({
            name: trainingName,
            configuration: configuration,
            learningIntervals: learningIntervals,
            repetitionIntervals: repetitionIntervals
        });
        markProfileDirty(profile);
        showToast("Training successfully saved", "success");

        setInitState();
    }

    console.log(trainingName)
    console.log(termsTrainingData)
    console.log(learningIntervals)
    console.log(repetitionIntervals)

    return (
        <div>
            <CFormInput className="w-50 mb-4" placeholder={"Training name"}
                        onChange={(e) => trainingNameChanged(e.target.value)} value={trainingName}/>
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

            <div className="d-flex flex-column gap-4">
                <TrainingIntervals title={"Learning intervals (in minutes)"} intervals={learningIntervals}
                                   onIntervalsChanges={onLearningIntervalsChanges}/>
                <TrainingIntervals title={"Repetition intervals (in days)"} intervals={repetitionIntervals}
                                   onIntervalsChanges={onRepetitionIntervalsChanges}/>
            </div>


            <CButton className="mt-3" color={"info"} onClick={() => onSaveClicked()}>Save</CButton>
        </div>
    )
}

export default AddNewTraining;