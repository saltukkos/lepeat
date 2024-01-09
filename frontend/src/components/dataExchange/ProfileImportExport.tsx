import React, {CSSProperties, useContext, useState} from 'react';
import {Container} from 'react-bootstrap';
import {deserializeProfile, serializeProfile} from "../../services/ProfileSerializer";
import ToastContext from "../../contexts/ToastContext";
import ProfileContext from "../../contexts/ProfileContext";

function ProfileImportExport() {
    const { profile, setProfile } = useContext(ProfileContext);
    const [textBoxData, setTextBoxData] = useState(serializeProfile(profile));
    const { showToast } = useContext(ToastContext)

    const copyToClipboard = () => {
        navigator.clipboard.writeText(textBoxData).then(r => {
            showToast("Profile is copied to clipboard", "success")
        });
    };

    const setProfileFromTextBoxData = () => {
        // assuming setProfile is expecting a string
        let newProfile = deserializeProfile(textBoxData);
        if (newProfile) {
            setProfile(newProfile);
            showToast("Profile is loaded", "success");
        } else {
            showToast("Can't deserialize profile", "danger");
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
        </Container>
    );
}

export default ProfileImportExport;