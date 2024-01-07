import React, {CSSProperties, useRef, useState} from 'react';
import {Container} from 'react-bootstrap';
import {LepeatProfile} from "../../model/LepeatProfile";
import {deserializeProfile, serializeProfile} from "../../services/ProfileSerializer";
import {useDispatch, useSelector} from "react-redux";
import {CToast, CToastBody, CToaster,} from '@coreui/react'

function ProfileImportExport() {
    const profile = useSelector<any>((state) => state.profile) as LepeatProfile; //TODO save types
    const dispatch = useDispatch()

    const [textBoxData, setTextBoxData] = useState(serializeProfile(profile));

    const [toast, addToast] = useState(0)
    const toaster = useRef<HTMLDivElement>(null!)

    const copyToClipboard = () => {
        navigator.clipboard.writeText(textBoxData);
    };

    const setProfileFromTextBoxData = () => {
        // assuming setProfile is expecting a string
        let newProfile = deserializeProfile(textBoxData);
        if (newProfile) {
            dispatch({ type: 'set', profile: newProfile });

            // @ts-expect-error This shit does not work
            addToast((
                <CToast autohide={true} delay={2000}>
                    <CToastBody>Profile is loaded</CToastBody>
                </CToast>
            ))
        } else {
            // @ts-expect-error This shit does not work
            addToast((
                <CToast autohide={true} delay={2000} color={"danger"}>
                    <CToastBody>Can't deserialize profile</CToastBody>
                </CToast>
            ))
        }
    };

    const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTextBoxData(event.target.value);
    };

    const textAreaStyle: CSSProperties = {
        width: '80%',
        height: '80%',
        margin: '0 auto',
    };

    const containerStyle: CSSProperties = {
        height: '90vh',
    };

    
    return (
        <Container className="page d-flex flex-column align-items-center" style={containerStyle}>
            <textarea style={textAreaStyle} value={textBoxData} onChange={handleInput}/>
            <button onClick={copyToClipboard}>Copy textbox data to clipboard</button>
            <button onClick={setProfileFromTextBoxData}>Set profile from textbox data</button>
            <CToaster ref={toaster}
                // @ts-expect-error This shit does not work
                      push={toast}
                      placement="top-end"/>
        </Container>
    );
}

export default ProfileImportExport;