import React, {useContext} from 'react'

import {CRow,} from '@coreui/react'
import ProfileContext from "../../contexts/ProfileContext";
import {TrainingCard} from "./TrainingCard";

const Dashboard = () => {
  const { profile } = useContext(ProfileContext);
  return (
    <>
      <CRow className="mb-4" xs={{ gutter: 4 }}>
        {profile.trainingDefinitions.map((training, index) => {
          return TrainingCard(training, profile);
        })}
      </CRow>
    </>
  )
}

export default Dashboard
