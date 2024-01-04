import React, {CSSProperties, useState} from 'react';
import { Container } from 'react-bootstrap';
import {LepeatProfile} from "../../model/LepeatProfile";
import {deserializeProfile, serializeProfile} from "../../services/ProfileSerializer";

interface ProfileImportExportProps {
    profile: LepeatProfile,
    setProfile: (profile: LepeatProfile) => void,
    onHomeButtonClicked: () => void,
}

function ProfileImportExport({ profile, setProfile, onHomeButtonClicked }: ProfileImportExportProps) {
    const [textBoxData, setTextBoxData] = useState(serializeProfile(profile));

    const copyToClipboard = () => {
        navigator.clipboard.writeText(textBoxData);
    };

    const setProfileFromTextBoxData = () => {
        // assuming setProfile is expecting a string
        let newProfile = deserializeProfile(textBoxData);
        if (newProfile) {
            setProfile(newProfile);
        } else {
            alert("Can't deserialize profile")
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
            <button onClick={onHomeButtonClicked}> Home</button>
        </Container>
    );
}

export default ProfileImportExport;