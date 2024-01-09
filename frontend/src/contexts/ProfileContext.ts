import React from 'react';
import {LepeatProfile} from "../model/LepeatProfile";

interface ProfileContextState {
    profile: LepeatProfile,
    setProfile: (profile: LepeatProfile) => void;
}

const initialState : ProfileContextState = {
    profile: {
        termDefinitions: [],
        trainingDefinitions: [],
        terms: [],
        trainingProgresses: new Map(),
        intervals: []
    },
    setProfile: (profile) => {}
};

const ProfileContext = React.createContext(initialState);

export default ProfileContext;