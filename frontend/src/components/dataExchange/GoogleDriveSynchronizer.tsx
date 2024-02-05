import {useGoogleDrive} from "../../contexts/GoogleDriveContext";
import {CButton} from "@coreui/react";
import {useContext, useState} from "react";
import ToastContext from "../../contexts/ToastContext";
import {deserializeProfile, serializeProfile} from "../../services/ProfileSerializer";
import ProfileContext from "../../contexts/ProfileContext";
import {mergeProfiles} from "../../services/Merger";
import {markProfileDirty} from "../../services/Persistence";

function GoogleDriveSynchronizer() {

    const { profile, setProfile } = useContext(ProfileContext);
    const { showToast } = useContext(ToastContext)
    const {
        hasDriveAccess, requestDriveAccess,
        isDriveLoaded, isDriveAuthorizing, error,
        fetchFileList, fetchFile, uploadFile, deleteFile
    } = useGoogleDrive();

    const [existingFile, setExistingFile] = useState<gapi.client.drive.File | "no file">();
    const [filesError, setFilesError] = useState<any>(null);
    
    if (!isDriveLoaded){
        return "Loading Google Drive components";
    }
    
    if (isDriveAuthorizing){
        return "Authorizing...";
    }
    
    if (error){
        return "Error while authorizing: " + error;
    }
    
    //TODO: store token in local storage?
    if (!hasDriveAccess){
        return (
            <CButton color="primary" onClick={requestDriveAccess}>Authorize with Google</CButton>
        );
    }
    
    if (filesError){
        return "Can't get files: " + filesError.message;
    }
    
    if (!existingFile){
        fetchFileList().then((response) => {
            const firstProfileFile = response.data.files?.find(file => file.name === "profile.json");
            setExistingFile(firstProfileFile ?? "no file");
            console.log("Found profile in google, fileId: " + firstProfileFile?.id)
        })
        .catch((error) => {
            setFilesError(error);
            showToast("Can't get files from google")
        });

        return "Loading files from drive";
    }

    const metadata = {
        name: "profile.json",
        mimeType: "application/json",
    };

    function createProfileInDrive() {
        const file = new File([serializeProfile(profile)], "profile.json", {
            type: "application/json",
        });

        uploadFile({file, metadata})
            .then(response => {
                showToast("Profile uploaded", 'success')
                console.log("File uploaded:")
                console.log(response.data)
            })
            .catch(error => {
                showToast("Can't upload profile, error: " + error, 'success')
                console.log("Can't upload:")
                console.log(error)
            });
    }

    if (existingFile === "no file"){
        return (
            <CButton color="primary" onClick={createProfileInDrive}>Create new profile in drive</CButton>
        );
    }

    const deleteProfileFromDrive = () => {
        if (window.confirm("Are you sure you want to delete your profile from Drive?")) {
            deleteFile(existingFile)
                .then(r => showToast("Profile deleted", 'success'))
                .catch(error => showToast("Error deleting: " + error, 'danger'));
        }
    };

    const smartMerge = () => {
        fetchFile<'arraybuffer'>(existingFile) //for some reason, 'text' and 'json' do not work and still return arraybuffer
            .then(r =>
            {
                const decoder = new TextDecoder('utf-8');
                const text = decoder.decode(new Uint8Array(r.data as ArrayBuffer));
                const deserializedProfile = deserializeProfile(text);

                if (!deserializedProfile){
                    showToast("Profile from cloud is invalid", 'danger')
                }
                else {
                    try {
                        const mergedProfile = mergeProfiles(profile, deserializedProfile);
                        setProfile(mergedProfile);
                        markProfileDirty(mergedProfile, true);
                    }
                    catch (e){
                        if (e instanceof Error) {
                            showToast(e.message, "danger");
                        }
                        else {
                            showToast("Can't merge, unknown error", "danger");
                        }
                    }
                    showToast("Profile is updated", 'success')
                }
            }            )
            .catch(error => showToast("error fetching: " + error, 'danger'));
    };

    return (
        <div className="d-flex flex-column gap-5">
            <CButton color="primary" onClick={smartMerge}>Synchronize data</CButton>
            <CButton className="small" color="danger" onClick={deleteProfileFromDrive}>Delete profile from drive</CButton>
        </div>
    );
}

export default GoogleDriveSynchronizer;