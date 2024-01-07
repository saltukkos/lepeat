import React, {CSSProperties, useState} from 'react';
import { Container } from 'react-bootstrap';
import {deserializeTerms, serializeTerms} from "../../services/TermsSerializer";
import {profileSelector} from "../../slices/profileSlice";
import {useAppSelector} from "../../redux/hooks";

function TermsImportExport() {
    const profile = useAppSelector(profileSelector).profile;

    const [textBoxData, setTextBoxData] = useState(serializeTerms(profile.terms));

    const copyToClipboard = () => {
        navigator.clipboard.writeText(textBoxData);
    };

    const setTermsFromTextBoxData = () => {
        deserializeTerms(textBoxData, profile);
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