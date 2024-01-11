import React, {ChangeEvent, useContext, useMemo, useState} from "react";
import {Container} from "react-bootstrap";
import Card from '../card/Card';
import './wordCheck.scss';
import {useLocation, useNavigate} from "react-router-dom";
import {getTermsToTrain} from "../../services/TrainingStarter";
import {CButton, CFormSelect, CInputGroup, CInputGroupText} from "@coreui/react";
import ProfileContext from "../../contexts/ProfileContext";
import {markProfileDirty} from "../../services/Persistence";

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

    if (currentTermIdx >= termTrainingProgress.length) {
        return (
            <Container className="page">
                Finished
                <CButton color="primary" onClick={() => navigate('/')}>Back to the Dashboard</CButton>
            </Container>)
    }

    let currentTermProgress = termTrainingProgress[currentTermIdx];
    let currentTerm = currentTermProgress.term;

    let currentTermDefinition = currentTerm.termDefinition;
    let currentRule = trainingDefinition.configuration.get(currentTermDefinition)!; // TODO think on corner case
    let question = currentRule.attributesToShow.map(a => currentTerm.attributeValues.get(a)).join(" ");
    let answer = currentRule.attributesToGuess.map(a => currentTerm.attributeValues.get(a)).join(" ");

    const onRightClicked = () => {
        termTrainingProgress[currentTermIdx].iterationNumber += 1;
        termTrainingProgress[currentTermIdx].lastTrainingDate = Date.now();
        markProfileDirty(profile);
        setCurrentTermIdx((currentValue) => currentValue + 1)
    }
    const onWrongClicked = () => {
        termTrainingProgress[currentTermIdx].iterationNumber = 0;
        termTrainingProgress[currentTermIdx].lastTrainingDate = Date.now();
        markProfileDirty(profile);
        setCurrentTermIdx((currentValue) => currentValue + 1)
    }

    const onSkipClicked = () => {
        setCurrentTermIdx((currentValue) => currentValue + 1);
    }

    const onChangeOrder = (e : ChangeEvent<HTMLSelectElement>) => {
        setOrderObject({order: e.target.value as Order});
        setCurrentTermIdx(0);
    };

    return (
        <Container className="page gap-3">

            {/* TODO: save the last selection? */}
            <CInputGroup className="mb-3 flex-grow-0 w-auto">
                <CInputGroupText component="label">Order:</CInputGroupText>
                <CFormSelect
                    aria-label="Default select example"
                    onChange={onChangeOrder}
                    options={orderOptions}
                />
            </CInputGroup>

            <Card question={question}
                  answer={answer}
                  onRightClicked={onRightClicked}
                  onSkipClicked={onSkipClicked}
                  onWrongClicked={onWrongClicked}/>
            {/*<Container className="gap-4 ">*/}
            {/*    <CButton color={"danger"} onClick={onWrongClicked}>Wrong</CButton>*/}
            {/*    <CButton color={"info"} onClick={onSkipClicked}>Skip</CButton>*/}
            {/*    <CButton color={"success"} onClick={onRightClicked}>Right</CButton>*/}
            {/*</Container>*/}
        </Container>
    );
}

export default TrainingSession;