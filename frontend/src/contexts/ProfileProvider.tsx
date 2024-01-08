import React, {useState, useRef, useEffect, ReactElement, FC, useContext} from 'react';
import ProfileContext from "./ProfileContext";
import {deserializeProfileFromLocalStorage} from "../services/Persistence";
import {LepeatProfile} from "../model/LepeatProfile";
import ToastContext from "./ToastContext";
import {germanProfile} from "../model/DefaultModel";

interface Props extends React.PropsWithChildren {
    children: ReactElement
}

const ProfileProvider: FC<Props> = ({children}) => {
    const { showToast } = useContext(ToastContext);
    const [lepeatProfile, setLepeatProfile] = useState<LepeatProfile | undefined>();

    useEffect(() => {
        try {
            setLepeatProfile(deserializeProfileFromLocalStorage());
        } catch (e) {
            showToast("Could not deserialize profile data");
            setLepeatProfile(germanProfile); //TODO some default profile data
        }

        // TODO think on this
        // return () => {
        //     serializeProfile(lepeatProfile!!);
        // }
    }, []);

    const getLepeatProfile = () => {
        return lepeatProfile!!;
    }


    return (
        <ProfileContext.Provider value={{getLepeatProfile, setLepeatProfile}}>
            {children}
        </ProfileContext.Provider>
    );
};

export default ProfileProvider;