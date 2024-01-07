import React from 'react'
import { useNavigate } from 'react-router-dom';

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCardText,
  CCardTitle,
  CCol,
  CRow,
} from '@coreui/react'

import { CChartRadar } from '@coreui/react-chartjs'
import {useSelector} from "react-redux";
import {getTrainingStatistics} from "../../services/TrainingStatistics";
import {getTermsToTrain} from "../../services/TrainingStarter";

const Dashboard = () => {
  const profile = useSelector((state) => state.profile)
  const navigate = useNavigate();
  const navigateToTraining = (name) => {
    navigate('/training_session', {
      state: {
        trainingName: name,
      }
    });
  };

  return (
    <>
      <CRow className="mb-4" xs={{ gutter: 4 }}>
        {profile.trainingDefinitions.map((training, index) => {
          const termsToTrain = getTermsToTrain(profile, training);
          const trainingStatistics = getTrainingStatistics(training, profile);
          return (
              <CCol sm={6} xl={4} xxl={3} key={index}>
                <CCard className="mb-4">
                  <CCardHeader>
                    <CChartRadar
                        data={{
                          labels: ['Not started']
                              .concat(Array.from(
                                  { length: trainingStatistics.length - 1 },
                                  (_, i) => `${i + 1} iteration`)),
                          datasets: [
                            {
                              label: 'Terms on iteration',
                              backgroundColor: 'rgba(151, 187, 205, 0.2)',
                              borderColor: 'rgba(151, 187, 205, 1)',
                              pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                              pointBorderColor: '#fff',
                              pointHighlightFill: '#fff',
                              pointHighlightStroke: 'rgba(151, 187, 205, 1)',
                              data: trainingStatistics,
                            },
                          ],
                        }}
                    />
                  </CCardHeader>
                  <CCardBody>
                    <CCardTitle>{training.name}</CCardTitle>
                    <CCardText>You have {termsToTrain.length} terms to learn and repeat.</CCardText>
                    <CButton color="primary" onClick={() => navigateToTraining(training.name)}>
                      Start training
                    </CButton>
                  </CCardBody>
                </CCard>
              </CCol>
          )
        })}
      </CRow>
    </>
  )
}

export default Dashboard
