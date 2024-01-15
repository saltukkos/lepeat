import {getTrainingStatistics} from "../../services/TrainingStatistics";
import {CButton, CCard, CCardBody, CCardHeader, CCardText, CCardTitle, CCol} from "@coreui/react";
import {CChartRadar} from "@coreui/react-chartjs";
import {printTermWord} from "../../services/L18n";
import React, {useEffect, useReducer} from "react";
import {TrainingDefinition} from "../../model/TrainingDefinition";
import {LepeatProfile} from "../../model/LepeatProfile";
import {useNavigate} from "react-router-dom";
import {TrainingType} from "../../services/TrainingService";
import { formatDistance } from 'date-fns'


export function TrainingCard(training: TrainingDefinition, profile: LepeatProfile) {
    const navigate = useNavigate();
    const navigateToTraining = (name: string, trainingType: TrainingType) => {
        navigate('/training_session', {
            state: {
                trainingName: name,
                trainingType: trainingType
            }
        });
    };

    let {overallStatistics, thisTimeStatistics, minimalTimeToUpdate} = getTrainingStatistics(training, profile);
    const termsToRepeat = thisTimeStatistics.slice(1).reduce((sum, value) => sum + value, 0);
    const allTermsCount = overallStatistics.reduce((sum, num) => sum + num, 0);
    const termsToLearn = thisTimeStatistics[0];

    const [, forceUpdate] = useReducer(x => x + 1, 0);
    useEffect(() => {
        if (minimalTimeToUpdate > 2147483647){ //longer is not available according to the spec
            return () => {};
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
        minimalTimeToUpdate = Math.max(minimalTimeToUpdate, 10 * 1000); // do not update too often
        minimalTimeToUpdate = Math.min(minimalTimeToUpdate, 2 * 60 * 1000); // update at least once in 2 minutes to keep "Next training in" up-to-date

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
                            labels: ['Learning']
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
                    <CCardText>You have {printTermWord(termsToLearn)} to learn and {printTermWord(termsToRepeat)} to repeat ouf of {allTermsCount}.</CCardText>

                    <div className="d-grid gap-2 col-10 mx-auto">
                        {termsToLearn > 0 && termsToRepeat > 0 ? (
                            <>
                                <CButton color="primary"
                                         onClick={() => navigateToTraining(training.name, TrainingType.All)}>
                                    Start training
                                </CButton>

                                <CButton color="primary"
                                         onClick={() => navigateToTraining(training.name, TrainingType.OnlyNew)}>
                                    Only learn new terms
                                </CButton>

                                <CButton color="primary"
                                         onClick={() => navigateToTraining(training.name, TrainingType.OnlyRepeat)}>
                                    Only repeat terms
                                </CButton>
                            </>
                        ) : termsToLearn > 0 ? (
                            <CButton color="primary"
                                     onClick={() => navigateToTraining(training.name, TrainingType.OnlyNew)}>
                                Learn new terms
                            </CButton>
                        ) : termsToRepeat > 0 ? (
                            <CButton color="primary"
                                     onClick={() => navigateToTraining(training.name, TrainingType.OnlyRepeat)}>
                                Repeat terms
                            </CButton>
                        ) : (
                            <CButton color="primary" disabled>
                                Next training in {formatDistance(Date.now(), new Date(Date.now() + minimalTimeToUpdate), {includeSeconds: false})}
                            </CButton>
                        )}

                    </div>
                </CCardBody>
            </CCard>
        </CCol>
)
}