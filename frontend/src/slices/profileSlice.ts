import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {LepeatProfile} from "../model/LepeatProfile";
import {TrainingDefinition} from "../model/TrainingDefinition";
import {TrainingProgress} from "../model/TrainingProgress";
import {
    articlesTrainingProgress,
    articleTrainingDefinition,
    germanNounDefinition,
    germanVerbDefinition, noun1, noun2, noun3, noun4, noun5,
    translationsTrainingDefinition, translationTrainingProgress, verb1, verb2, verb3, verb4, verb5
} from "../model/DefaultModel";
import {RootState} from "../redux/store";

export interface ProfileSlice {
    profile: LepeatProfile
}

const initialState: ProfileSlice = {
    profile: {
        termDefinitions: [germanNounDefinition, germanVerbDefinition],
        trainingDefinitions: [translationsTrainingDefinition, articleTrainingDefinition],
        terms: [noun1, noun2, noun3, noun4, noun5, verb1, verb2, verb3, verb4, verb5],
        trainingProgresses: new Map<TrainingDefinition, TrainingProgress>(
            [[translationsTrainingDefinition, translationTrainingProgress],
                [articleTrainingDefinition, articlesTrainingProgress]]
        ),
        intervals: [0, 1, 3, 7, 15, 30],
    }
}


export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setProfile: (state, action: PayloadAction<ProfileSlice>) => {
            state.profile = action.payload.profile
        }
    },
})

export const { setProfile } = profileSlice.actions

export const profileSelector = (state: RootState) => state.profile;

export default profileSlice.reducer