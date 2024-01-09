import { legacy_createStore as createStore } from 'redux'
import {deserializeProfileFromLocalStorage} from "../services/Persistence";

const initialState = {
    sidebarShow: true,
    theme: 'light',
}

const changeState = (state = initialState, { type, ...rest }) => {
    switch (type) {
        case 'set':
            return { ...state, ...rest }
        default:
            return state
    }
}

function getStore() {
    let store = createStore(changeState);
    store.dispatch({type: 'set', profile: deserializeProfileFromLocalStorage()});
    return store;
}

const store = getStore()
export default store
