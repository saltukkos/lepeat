import {type PropsWithChildren} from "react";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {GoogleDriveProvider} from "./GoogleDriveContext";

const clientId = process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID;
const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
export const synchronizationEnabled = !(!clientId || !apiKey);

export function SynchronizationProvider({children}: PropsWithChildren) {
    if(!clientId || !apiKey) {
        return (
            <>
                {children}
            </>
        );
    }

    return (
        <GoogleOAuthProvider
            clientId={clientId}
            onScriptLoadError={() => {
                throw new Error("Google OAuth script failed to load.");
            }}
        >
            <GoogleDriveProvider apiKey={apiKey}>
                {children}
            </GoogleDriveProvider>
        </GoogleOAuthProvider>
    );
}
