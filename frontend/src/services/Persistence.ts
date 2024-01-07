import {LepeatProfile} from "../model/LepeatProfile";
import {deserializeProfile, serializeProfile} from "./ProfileSerializer";
import store from "../redux/store";
import {germanProfile} from "../model/DefaultModel";

export function serializeProfileToLocalStorage(){
    const profile = store.getState().profile as LepeatProfile;
    const serializedProfile = serializeProfile(profile);
    localStorage.setItem('profile', serializedProfile)
}

export function deserializeProfileFromLocalStorage(){
    const loadedData = localStorage.getItem('profile');
    if (loadedData) {
        const deserializedProfile = deserializeProfile(loadedData);
        if (deserializedProfile) {
            // store.dispatch({type: 'set', profile: deserializedProfile});
            // return true;
            return deserializedProfile;
        } else {
            return germanProfile;
        }
    }
    
    return germanProfile;
}

