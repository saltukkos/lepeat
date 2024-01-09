import React, {useState, useEffect, ReactElement, FC, useContext} from 'react';
import ProfileContext from "./ProfileContext";
import {deserializeProfileFromLocalStorage} from "../services/Persistence";
import {LepeatProfile} from "../model/LepeatProfile";
import ToastContext from "./ToastContext";
import {emptyProfile, germanProfile} from "../model/DefaultModel";

interface Props extends React.PropsWithChildren {
    children: ReactElement
}

const ProfileProvider: FC<Props> = ({children}) => {
    const { showToast } = useContext(ToastContext);
    const [profile, setProfile] = useState<LepeatProfile>(emptyProfile);

    useEffect(() => {
        const profileFromLocalStorage = deserializeProfileFromLocalStorage();
        if (profileFromLocalStorage){
            setProfile(profileFromLocalStorage);
        }
        else {
            showToast("Could not deserialize profile data, using default");
            setProfile(germanProfile); //TODO some default profile data
        }

        // TODO think on this
        // return () => {
        //     serializeProfile(lepeatProfile!!);
        // }
    }, []);

    return (
        <ProfileContext.Provider value={{profile, setProfile}}>
            {children}
        </ProfileContext.Provider>
    );
};

export default ProfileProvider;