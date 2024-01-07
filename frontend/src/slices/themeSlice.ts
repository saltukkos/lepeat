import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {LepeatProfile} from "../model/LepeatProfile";
import {TrainingDefinition} from "../model/TrainingDefinition";
import {TrainingProgress} from "../model/TrainingProgress";

import {RootState} from "../redux/store";

export interface ThemeSlice {
    theme: "light" | "dark"
}

const initialState: ThemeSlice = {
    theme: "light"
}


export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<ThemeSlice>) => {
            state.theme = action.payload.theme
        }
    },
})

export const { setTheme } = themeSlice.actions

export const themeSelector = (state: RootState) => state.theme;

export default themeSlice.reducer