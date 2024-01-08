import {LepeatProfile} from "../model/LepeatProfile";
import {deserializeProfile, serializeProfile} from "./ProfileSerializer";
import store from "../redux/store";
import {germanProfile} from "../model/DefaultModel";
import {useContext, useEffect, useState} from "react";
import ProfileContext from "../contexts/ProfileContext";

export function serializeProfileToLocalStorage(profile: LepeatProfile){
    const serializedProfile = serializeProfile(profile);
    console.log("serProfile")
    console.log(serializedProfile)
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

