import React, {useEffect, useState} from "react";
import TrainingSession from "../training/TrainingSession";
import {germanProfile} from "../../model/DefaultModel";
import {getTermsToTrain} from "../../services/TrainingStarter";
import Statistics from "../statistics/debug/Statistics";
import {LepeatProfile} from "../../model/LepeatProfile";
import {TrainingDefinition} from "../../model/TrainingDefinition";
import {deserializeProfile, serializeProfile} from "../../services/ProfileSerializer";

function HomePage() {
    const [renderState, setRenderState] = useState<string>("HOME");
    const [profile, setProfile] = useState<LepeatProfile>(germanProfile);

    useEffect(() => {
        // Load profile from local storage during initial render
        const loadedData = localStorage.getItem('profile');
        if (loadedData) {
            setProfile(deserializeProfile(loadedData));
        }
    }, []);


    let render = <></>

    if (renderState.startsWith("TRAINING:")) {
        const trainingName = renderState.substring("TRAINING:".length);
        const training = profile.trainingDefinitions.find(value => value.name === trainingName);
        if (training) {
            render = (
                <TrainingSession onHomeButtonClicked={() => setRenderState("HOME")} trainingDefinition={training}
                                 termTrainingProgress={getTermsToTrain(profile, training)}/>
            )
        } else {
            render = (
                <div>
                    No training with name "{trainingName}" is found
                </div>
            );
        }
    } else if (renderState === "ADD_WORDS") {
        render = <div> Here will be page for adding words</div>
    } else if (renderState === "STATISTICS_DEBUG") {
        render = (
            <Statistics terms={profile.terms} trainingProgresses={profile.trainingProgresses} />
        )
    } else if (renderState === "HOME") {
        render = (
            <div>
                This is home page.
                <br/>

                {profile.trainingDefinitions.map((training: TrainingDefinition) => (
                    <div>
                        <button onClick={() => setRenderState(`TRAINING:${training.name}`)}>
                            Start {training.name}
                        </button>
                        <br/>
                    </div>
                ))}

                <button onClick={() => setRenderState("ADD_WORDS")}>Add new words</button>
                <br/>

                <button onClick={() => setRenderState("STATISTICS_DEBUG")}>Statistics debug</button>
                <br/>

                <button onClick={() => localStorage.setItem('profile', serializeProfile(profile))}>
                    Save data to storage
                </button>
                <br/>

                <button onClick={() => localStorage.removeItem('profile')}>
                    Clear storage
                </button>
                <br/>
            </div>
        )
    } else {
        throw `Unknown state: ${renderState}`
    }

    return render;
}

export default HomePage;
