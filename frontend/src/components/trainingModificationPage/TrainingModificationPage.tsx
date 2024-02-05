import React, {useCallback, useContext, useEffect, useState} from "react";
import ProfileContext from "../../contexts/ProfileContext";
import ToastContext from "../../contexts/ToastContext";
import {TermDefinition} from "../../model/TermDefinition";
import {
    DEFAULT_LEARNING_INTERVALS,
    DEFAULT_REPETITION_INTERVALS,
    TermTrainingRule
} from "../../model/TrainingDefinition";
import {useNavigate, useParams} from "react-router-dom";
import {CBreadcrumb, CBreadcrumbItem, CButton, CFormInput} from "@coreui/react";
import TermTraining from "./TermTraining";
import {indexifyFunction} from "../../utils/utils";
import TrainingIntervals from "./TrainingIntervals";
import {validateConfiguration, validateTrainingData} from "./validation";
import {markProfileDirty} from "../../services/Persistence";
import { v4 as uuidv4 } from "uuid";

const getTermsTrainingInitData = (termDefinitions: TermDefinition[]) => termDefinitions.map(e => ({
    termDefinition: e,
    questionString: "",
    answerString: "",
    isEnabled: true
}));

const copyTermsTrainingInitData = (allTermDefinitions: TermDefinition[], configuration: Map<TermDefinition, TermTrainingRule>) =>
    (allTermDefinitions.map(termDefinition => ({
        termDefinition,
        questionString: configuration.get(termDefinition)?.questionPattern ?? "",
        answerString: configuration.get(termDefinition)?.answerPattern ?? "",
        isEnabled: configuration.has(termDefinition)
    })));

function TrainingModificationPage() {
    const {id} = useParams();
    const navigate = useNavigate();
    const {profile} = useContext(ProfileContext);
    const {showToast} = useContext(ToastContext)
    const isEditMode = id !== undefined;

    const [trainingName, setTrainingName] = useState("");
    const [termsTrainingData, setTermsTrainingData] = useState(getTermsTrainingInitData(profile.termDefinitions));
    const [learningIntervals, setLearningIntervals] = useState(DEFAULT_LEARNING_INTERVALS);
    const [repetitionIntervals, setRepetitionIntervals] = useState(DEFAULT_REPETITION_INTERVALS);

    const [isIdCorrect, setIsIdCorrect] = useState(true);


    useEffect(() => {
        if (isEditMode) {
            const selectedTraining = profile.trainingDefinitions.find(e => e.id === id)
            if (!selectedTraining) {
                setIsIdCorrect(false);
            } else {
                setTrainingName(selectedTraining.name);
                setLearningIntervals(selectedTraining.learningIntervals);
                setRepetitionIntervals(selectedTraining.repetitionIntervals);
                setTermsTrainingData(copyTermsTrainingInitData(profile.termDefinitions, selectedTraining.configuration));
            }
        }
    }, []);

    const trainingNameChanged = (newTrainingName: string) => {
        setTrainingName(newTrainingName);
    }

    const setEmptyTrainingState = useCallback(() => {
        setTrainingName("");
        setTermsTrainingData(getTermsTrainingInitData(profile.termDefinitions));
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

    const onLearningIntervalsChanges = (intervals: number[]) => {
        setLearningIntervals([...intervals])
    }
    const onRepetitionIntervalsChanges = (intervals: number[]) => {
        setRepetitionIntervals([...intervals])
    }

    const onSaveClicked = () => {
        const validationError = validateTrainingData(profile, trainingName, learningIntervals, repetitionIntervals, id);

        if (validationError) {
            showToast(validationError, "danger");
            return;
        }

        const configuration = new Map<TermDefinition, TermTrainingRule>;
        termsTrainingData.filter(e => e.isEnabled).forEach(e => configuration.set(e.termDefinition, {
            id: uuidv4(),
            lastEditDate: Date.now(),
            questionPattern: e.questionString,
            answerPattern: e.answerString
        }));

        const configurationError = validateConfiguration(configuration);
        if (configurationError) {
            showToast(configurationError, "danger");
            return;
        }

        if (isEditMode) {
            const selectedTraining = profile.trainingDefinitions.find(e => e.id === id)!
            selectedTraining.name = trainingName;
            selectedTraining.configuration = configuration;
            selectedTraining.learningIntervals = learningIntervals;
            selectedTraining.repetitionIntervals = repetitionIntervals;
            selectedTraining.lastEditDate = Date.now();
        } else {
            profile.trainingDefinitions.push({
                id: uuidv4(),
                lastEditDate: Date.now(),
                name: trainingName,
                configuration: configuration,
                learningIntervals: learningIntervals,
                repetitionIntervals: repetitionIntervals
            });
        }

        markProfileDirty(profile);
        if (isEditMode) {
            showToast("Training successfully updated", "success");
            navigate(-1);
        } else {
            showToast("Training successfully created", "success");
            setEmptyTrainingState();
        }
    }

    const onDeleteClicked = () => {
        if (!id) {
            return;
        }
        const selectedTraining = profile.trainingDefinitions.find(e => e.id === id)!
        profile.trainingProgresses.delete(selectedTraining);
        profile.trainingDefinitions = profile.trainingDefinitions.filter(t => t.id !== selectedTraining.id);

        markProfileDirty(profile)
        showToast("Training removed", "success")
        navigate(-1)
    }


    return isIdCorrect ? (
        <div>
            <CBreadcrumb>
                <CBreadcrumbItem href="#/trainings">Trainings</CBreadcrumbItem>
                <CBreadcrumbItem active>{isEditMode ? "Edit training" : "Add training"}</CBreadcrumbItem>
            </CBreadcrumb>
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


                <div className="mt-5 d-flex justify-content-between">
                    <CButton onClick={onSaveClicked} color="primary">Save</CButton>
                    {isEditMode ? <CButton onClick={onDeleteClicked} color="danger">Delete</CButton> : null}
                </div>
            </div>
        </div>
    ) : <div>Id is not correct</div>;
}

export default TrainingModificationPage;