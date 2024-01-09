import React, {CSSProperties, useContext, useState} from 'react';
import { Container } from 'react-bootstrap';
import {deserializeTerms, serializeTerms} from "../../services/TermsSerializer";
import ToastContext from "../../contexts/ToastContext";
import ProfileContext from "../../contexts/ProfileContext";

function TermsImportExport() {
    const { showToast } = useContext(ToastContext)
    const { profile } = useContext(ProfileContext);
    const [textBoxData, setTextBoxData] = useState(serializeTerms(profile.terms));

    const copyToClipboard = () => {
        navigator.clipboard.writeText(textBoxData);
        showToast("Words are copied to clipboard", "success");
    };

    const setTermsFromTextBoxData = () => {
        const newTerms = deserializeTerms(textBoxData, profile);
        profile.terms = Array.from(newTerms.values());
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