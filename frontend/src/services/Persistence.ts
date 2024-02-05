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

export function markProfileDirty(profile: LepeatProfile, isCloudSynchronized?: boolean) {
    if (!isCloudSynchronized){
        // TODO: mark as "not synchronized"
    }
    serializeProfileToLocalStorage(profile); //TODO: more complex logic can be implemented: we can throttle ot write async
}