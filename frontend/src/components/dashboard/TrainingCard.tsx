import {getTrainingStatistics} from "../../services/TrainingStatistics";
import {CButton, CCard, CCardBody, CCardHeader, CCardText, CCardTitle, CCol} from "@coreui/react";
import {CChartRadar} from "@coreui/react-chartjs";
import {printTermWord} from "../../services/L18n";
import React, {useEffect, useReducer} from "react";
import {TrainingDefinition} from "../../model/TrainingDefinition";
import {LepeatProfile} from "../../model/LepeatProfile";
import {useNavigate} from "react-router-dom";


export function TrainingCard(training: TrainingDefinition, profile: LepeatProfile) {
    const navigate = useNavigate();
    const navigateToTraining = (name: string) => {
        navigate('/training_session', {
            state: {
                trainingName: name,
            }
        });
    };

    let {overallStatistics, thisTimeStatistics, minimalTimeToUpdate} = getTrainingStatistics(training, profile);
    const termsToRepeat = thisTimeStatistics.slice(1).reduce((sum, value) => sum + value, 0);

    minimalTimeToUpdate = Math.max(minimalTimeToUpdate, 10000); // do not update too often

    const [, forceUpdate] = useReducer(x => x + 1, 0);
    useEffect(() => {
        if (minimalTimeToUpdate > 2147483647){ //longer is not available according to the spec
            return () => {};
        } 

        const timerId = setTimeout(() => {
            forceUpdate();
        }, minimalTimeToUpdate);

        return () => {
            clearTimeout(timerId);
        };
    });

    return (
        <CCol sm={6} xl={4} xxl={3} key={training.name}>
            <CCard className="mb-4">
                <CCardHeader>
                    <CChartRadar
                        data={{
                            labels: ['Not started']
                                .concat(Array.from(
                                    {length: overallStatistics.length - 1},
                                    (_, i) => `${i + 1} iteration`)),
                            datasets: [
                                {
                                    label: 'Terms to train now',
                                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                    borderColor: 'rgba(255, 99, 132, 1)',
                                    pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                                    pointBorderColor: '#fff',
                                    /*@ts-expect-error*/
                                    pointHighlightFill: '#fff',
                                    pointHighlightStroke: 'rgba(151, 187, 205, 1)',
                                    data: thisTimeStatistics,
                                },
                                {
                                    label: 'Terms on iteration',
                                    backgroundColor: 'rgba(151, 187, 205, 0.2)',
                                    borderColor: 'rgba(151, 187, 205, 1)',
                                    pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                                    pointBorderColor: '#fff',
                                    /*@ts-expect-error*/
                                    pointHighlightFill: '#fff',
                                    pointHighlightStroke: 'rgba(220, 220, 220, 1)',
                                    data: overallStatistics,
                                },
                            ],
                        }}
                        options={{
                            scales: {
                                r: {
                                    ticks: {
                                        showLabelBackdrop: false, //remove white background around ticks
                                        precision: 0, //do not allow fractional numbers
                                        z: 1,
                                    },
                                }
                            },
                        }}
                    />
                </CCardHeader>
                <CCardBody>
                    <CCardTitle>{training.name}</CCardTitle>
                    <CCardText>You have {printTermWord(overallStatistics[0])} to learn and {printTermWord(termsToRepeat)} to repeat.</CCardText>
                    <CButton color="primary" onClick={() => navigateToTraining(training.name)}>
                        Start training
                    </CButton>
                </CCardBody>
            </CCard>
        </CCol>
    )
}