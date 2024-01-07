import React, {CSSProperties, useContext, useState} from 'react';
import {Container} from 'react-bootstrap';
import {LepeatProfile} from "../../model/LepeatProfile";
import {deserializeProfile, serializeProfile} from "../../services/ProfileSerializer";
import {useDispatch, useSelector} from "react-redux";
import ToastContext from "../../contexts/ToastContext";

function ProfileImportExport() {
    const profile = useSelector<any>((state) => state.profile) as LepeatProfile; //TODO save types
    const dispatch = useDispatch()

    const [textBoxData, setTextBoxData] = useState(serializeProfile(profile));

    const { showToast } = useContext(ToastContext)

    const copyToClipboard = () => {
        navigator.clipboard.writeText(textBoxData);
        showToast("Profile is copied to clipboard", "success");
    };

    const setProfileFromTextBoxData = () => {
        // assuming setProfile is expecting a string
        let newProfile = deserializeProfile(textBoxData);
        if (newProfile) {
            dispatch({ type: 'set', profile: newProfile });
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