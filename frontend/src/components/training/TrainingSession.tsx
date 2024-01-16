import React, {ChangeEvent, FC, useContext, useMemo, useRef, useState} from "react";
import {Container} from "react-bootstrap";
import Card from '../card/Card';
import './wordCheck.scss';
import {useLocation, useNavigate} from "react-router-dom";
import {
    copyTermTrainingProgress,
    getTermsToTrain,
    updateTermProgressDontKnown,
    updateTermProgressEasy,
    updateTermProgressHard,
    updateTermProgressKnown,
    updateTermTrainingProgress
} from "../../services/TrainingService";
import {CButton, CButtonGroup, CFormSelect, CInputGroup, CInputGroupText} from "@coreui/react";
import ProfileContext from "../../contexts/ProfileContext";
import {Status, TermTrainingProgress} from "../../model/TrainingProgress";
import {cilActionUndo, cilChevronDoubleRight} from "@coreui/icons";
import CIcon from "@coreui/icons-react";

const MAX_PREV_TERMS_MEMOIZATION = 10;

const UndoButton: FC<{undo: () => void, className: string}> = ({undo, className}) => {
    return <CButton className={className} color={"secondary"} onClick={undo}>
        <CIcon icon={cilActionUndo} className="me-2"/>
        Undo
    </CButton>
}

type Order = 'dateAdded' | 'dateAddedReverse' | 'lastTrained' | 'lastTrainedReverse' | 'random';

const orderOptions: { label: string; value: Order }[] = [
    {label: "Date added: oldest first", value: 'dateAdded'},
    {label: "Date added: newest first", value: 'dateAddedReverse'},
    {label: "Date last trained: oldest first", value: 'lastTrained'},
    {label: "Date last trained: latest first", value: 'lastTrainedReverse'},
    {label: "Shuffled", value: 'random'}
];

function TrainingSession() {
    const navigate = useNavigate();
    const location = useLocation();
    const {trainingName, trainingType} = location.state;

    const {profile} = useContext(ProfileContext);
    const trainingDefinition = profile.trainingDefinitions.find(value => value.name === trainingName);
    const oldTermProgress = useRef<TermTrainingProgress[]>([]);

    const [currentTermIdx, setCurrentTermIdx] = useState(0);
    const [orderObject, setOrderObject] = useState<{ order: Order }>({order: 'dateAdded'});
    // hack: we wrap Order in a new object to force memo reevaluation since we can change the order in the middle
    // of a train, and then we don't want to traverse already trained terms

    const termTrainingProgress = useMemo(() => {
        if (trainingDefinition) {
            const termsToTrain = getTermsToTrain(profile, trainingDefinition, trainingType);
            const order = orderObject.order;
            switch(order) {
                case 'dateAdded':
                    return termsToTrain;
                case 'dateAddedReverse':
                    return termsToTrain.reverse();
                case 'lastTrained':
                    return termsToTrain.sort((a, b) =>
                        (a.lastTrainingDate || Number.MAX_VALUE) - (b.lastTrainingDate || Number.MAX_VALUE)
                    );
                case 'lastTrainedReverse':
                    return termsToTrain.sort((a, b) =>
                        (b.lastTrainingDate || Number.MIN_VALUE) - (a.lastTrainingDate || Number.MIN_VALUE)
                    );
                case 'random':
                    return termsToTrain.sort(() => Math.random() - 0.5);
                default:
                    return termsToTrain;
            }
        }
        return undefined;
    }, [profile, trainingDefinition, trainingType, orderObject]);

    if (!trainingDefinition || !termTrainingProgress) {
        return ("Unknown training");
    }

    console.log("terms to train:" + termTrainingProgress.length)

    const undo = () => {
        let data = oldTermProgress.current;
        let prevTermProgressData = data.pop();
        if (!prevTermProgressData) {
            console.log("Cannot undo on empty memo-data. Do nothing.");
            return;
        }
        
        updateTermTrainingProgress(prevTermProgressData, termTrainingProgress[currentTermIdx - 1], profile);
        setCurrentTermIdx((currentValue) => currentValue - 1);
    }

    if (currentTermIdx >= termTrainingProgress.length) {
        return (
            <Container className="page">
                Finished
                <CButton color="primary" onClick={() => navigate('/')}>Back to the Dashboard</CButton>
                {oldTermProgress.current.length > 0 && <UndoButton className={"mx-2"} undo={undo}/>}
            </Container>)
    }

    const currentTermProgress = termTrainingProgress[currentTermIdx];
    const currentTerm = currentTermProgress.term;

    const currentTermDefinition = currentTerm.termDefinition;
    const currentRule = trainingDefinition.configuration.get(currentTermDefinition)!; // TODO think on corner case
    const question = currentRule.attributesToShow.map(a => currentTerm.attributeValues.get(a)).join(" ");
    const answer = currentRule.attributesToGuess.map(a => currentTerm.attributeValues.get(a)).join(" ");

    const canShowAdditionalActions = currentTermProgress.status !== Status.Relearning;

    const onRightClicked = () => {
        const previousData = termTrainingProgress[currentTermIdx];
        memoizeOldProgress(previousData);
        
        updateTermProgressKnown(termTrainingProgress[currentTermIdx], trainingDefinition, profile);
        setCurrentTermIdx((currentValue) => currentValue + 1)
    }

    const onEasyClicked = () => {
        const previousData = termTrainingProgress[currentTermIdx];
        memoizeOldProgress(previousData);

        updateTermProgressEasy(termTrainingProgress[currentTermIdx], profile);
        setCurrentTermIdx((currentValue) => currentValue + 1)
    }

    const onWrongClicked = () => {
        const oldProgress = termTrainingProgress[currentTermIdx];
        memoizeOldProgress(oldProgress);
        
        updateTermProgressDontKnown(termTrainingProgress[currentTermIdx], profile);
        setCurrentTermIdx((currentValue) => currentValue + 1)
    }

    const onHardClicked = () => {
        const oldProgress = termTrainingProgress[currentTermIdx];
        memoizeOldProgress(oldProgress);

        updateTermProgressHard(termTrainingProgress[currentTermIdx], profile);
        setCurrentTermIdx((currentValue) => currentValue + 1)
    }
    
    const memoizeOldProgress = (termTrainingProgress: TermTrainingProgress) => {
        let data = oldTermProgress.current;
        data.push(copyTermTrainingProgress(termTrainingProgress))
        if (data.length > MAX_PREV_TERMS_MEMOIZATION) {
            data.shift();
        }
    }

    const onSkipClicked = () => {
        setCurrentTermIdx((currentValue) => currentValue + 1);
    }

    const onChangeOrder = (e : ChangeEvent<HTMLSelectElement>) => {
        setOrderObject({order: e.target.value as Order});
        setCurrentTermIdx(0);
        oldTermProgress.current.length = 0;
    };

    return (
        <Container className="page gap-3">

            {/* TODO: save the last selection? */}
            <CInputGroup size="sm" className="mb-3 flex-grow-0 w-auto">
                <CInputGroupText component="label">Order:</CInputGroupText>
                <CFormSelect
                    aria-label="Default select example"
                    onChange={onChangeOrder}
                    options={orderOptions}
                />
            </CInputGroup>

            <div className="d-flex flex-column gap-3 justify-content-center align-items-center">

                <Card question={question} answer={answer} termTrainingProgress={currentTermProgress}/>

                <div className="d-flex justify-content-between w-100">
                    <CButtonGroup vertical role="group" aria-label="Vertical button group">
                        <CButton className="mb-2 py-2" color={"danger"} onClick={onWrongClicked}>
                            ← Wrong&nbsp;&nbsp;
                        </CButton>
                        {canShowAdditionalActions && <CButton className="py-2" color={"danger"} variant={"outline"} onClick={onHardClicked}>Hard</CButton>}
                    </CButtonGroup>

                    <CButtonGroup vertical role="group" aria-label="Vertical button group">
                        <CButton className="mb-2 py-2" color={"success"} onClick={onRightClicked}>
                            &nbsp;&nbsp;Right →
                        </CButton>
                        {canShowAdditionalActions && <CButton className="py-2" color={"success"} variant={"outline"} onClick={onEasyClicked}>Easy</CButton>}
                    </CButtonGroup>
                </div>
                
                <div className="d-flex flex-column gap-2 mt-5">
                    <CButton className="px-5 w-100" color={"info"} onClick={onSkipClicked}>
                        <CIcon icon={cilChevronDoubleRight} className="me-2"/>
                        Skip
                    </CButton>
                    {oldTermProgress.current.length > 0 && <UndoButton className={"px-4 w-100"} undo={undo}/>}
                </div>
                </div>
        </Container>
);
}

export default TrainingSession;