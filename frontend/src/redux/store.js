import { legacy_createStore as createStore } from 'redux'
import {germanProfile} from "../model/DefaultModel";

const initialState = {
    sidebarShow: true,
    theme: 'light',
    profile: germanProfile
}

const changeState = (state = initialState, { type, ...rest }) => {
    switch (type) {
        case 'set':
            return { ...state, ...rest }
        default:
            return state
    }
}

const store = createStore(changeState)
export default store
