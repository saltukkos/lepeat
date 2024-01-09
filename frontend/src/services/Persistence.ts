import {LepeatProfile} from "../model/LepeatProfile";
import {deserializeProfile, serializeProfile} from "./ProfileSerializer";
import {germanProfile} from "../model/DefaultModel";

export function serializeProfileToLocalStorage(profile: LepeatProfile){
    const serializedProfile = serializeProfile(profile);
    localStorage.setItem('profile', serializedProfile)
}

export function deserializeProfileFromLocalStorage(){
    const loadedData = localStorage.getItem('profile');
    if (loadedData) {
        const deserializedProfile = deserializeProfile(loadedData);
        if (deserializedProfile) {
            return deserializedProfile;
        } else {
            return undefined;
        }
    }
    
    return germanProfile;
}

