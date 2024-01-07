import {createSlice, PayloadAction} from '@reduxjs/toolkit'

import {RootState} from "../redux/store";

export interface SidebarSlice {
    sidebarShow: boolean,
    unfoldable: boolean
}

const initialState: SidebarSlice = {
    sidebarShow: true,
    unfoldable: false
}


export const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        setSidebarShow: (state, action: PayloadAction<boolean>) => {
            state.sidebarShow = action.payload
        },
        setUnfoldable: (state, action: PayloadAction<boolean>) => {
            state.unfoldable = action.payload
        }
    },
})

export const { setSidebarShow, setUnfoldable } = sidebarSlice.actions

export const sidebarSelector = (state: RootState) => state.sidebar;

export default sidebarSlice.reducer