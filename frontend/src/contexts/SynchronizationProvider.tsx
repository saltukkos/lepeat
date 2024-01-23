import {type PropsWithChildren} from "react";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {GoogleDriveProvider} from "./GoogleDriveContext";

//TODO: temp ids, to env after testing
const clientId = '906996411849-trbbqcl57f5c6vn4hn01eff3hadrahdj.apps.googleusercontent.com';
const apiKey = 'AIzaSyADFoolzyKbDJ-I5wizJw22jNpt3gkOai4';

export function SynchronizationProvider({children}: PropsWithChildren) {
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
