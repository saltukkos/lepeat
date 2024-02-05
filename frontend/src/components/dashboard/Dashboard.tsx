import React, {useContext} from 'react'

import {CRow,} from '@coreui/react'
import ProfileContext from "../../contexts/ProfileContext";
import {TrainingCard} from "./TrainingCard";

const Dashboard = () => {
  const { profile } = useContext(ProfileContext);
  return (
    <>
      <CRow className="mb-4" xs={{ gutter: 4 }}>
        {profile.trainingDefinitions.map((training) => {
            return <TrainingCard training={training} profile={profile} key={training.id} />
        })}
      </CRow>
    </>
  )
}

export default Dashboard
