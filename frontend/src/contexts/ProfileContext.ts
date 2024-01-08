import React from 'react';
import {LepeatProfile} from "../model/LepeatProfile";

interface ProfileContextState {
    getLepeatProfile: () => LepeatProfile,
    setLepeatProfile: (profile: LepeatProfile) => void;
}

const initialState : ProfileContextState = {
    getLepeatProfile: () => {
        return {termDefinitions: [], trainingDefinitions: [], terms: [], trainingProgresses: new Map(), intervals: []};
    },
    setLepeatProfile: (profile) => {}
};

const ProfileContext = React.createContext(initialState);

export default ProfileContext;