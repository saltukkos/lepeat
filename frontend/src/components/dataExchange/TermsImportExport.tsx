import React, {CSSProperties, useContext, useEffect, useState} from 'react';
import { Container } from 'react-bootstrap';
import {LepeatProfile} from "../../model/LepeatProfile";
import {deserializeTerms, serializeTerms} from "../../services/TermsSerializer";
import {useSelector} from "react-redux";
import ToastContext from "../../contexts/ToastContext";
import ProfileContext from "../../contexts/ProfileContext";
import {germanProfile} from "../../model/DefaultModel";

function TermsImportExport() {
    const { showToast } = useContext(ToastContext)
    const { getLepeatProfile } = useContext(ProfileContext);
    const [profile, setProfile] = useState<LepeatProfile>(germanProfile);

    useEffect(() => {
        const lProfile = getLepeatProfile();
        setProfile(lProfile);
        setTextBoxData(serializeTerms(lProfile.terms))
    }, [getLepeatProfile]);


    const [textBoxData, setTextBoxData] = useState(serializeTerms(profile.terms));

    const copyToClipboard = () => {
        navigator.clipboard.writeText(textBoxData);
        showToast("Words are copied to clipboard", "success");
    };

    const setTermsFromTextBoxData = () => {
        let newTerms = deserializeTerms(textBoxData, profile);
        profile.terms = Array.from(newTerms.values());
        console.log("terms")
        console.log(newTerms)
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
            <button onClick={setTermsFromTextBoxData}>Import words from textbox data (overwrites existing)</button>
        </Container>
    );
}

export default TermsImportExport;