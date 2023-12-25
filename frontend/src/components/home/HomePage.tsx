import React, {useState} from "react";
import TrainingSession from "../training/TrainingSession";
import {articleTrainingDefinition, germanProfile, translationsTrainingDefinition} from "../../model/DefaultModel";
import {LepeatProfile} from "../../model/LepeatProfile";
import {TrainingDefinition} from "../../model/TrainingDefinition";

enum RenderedPage {
    HOME,
    TRAINING_TRANSLATIONS,
    TRAINING_ARTICLES,
    ADD_WORDS,
}

function getTermsToTrain(profile: LepeatProfile, trainingDefinition: TrainingDefinition) {
    let trainingProgress = profile.trainingProgresses.get(trainingDefinition);
    if (!trainingProgress) {
        trainingProgress = { progress: new Map() };
        profile.trainingProgresses.set(trainingDefinition, trainingProgress);
    }

    let progressForCurrentTraining = trainingProgress.progress;

    return profile.terms
        .filter(term => trainingDefinition.configuration.has(term.termDefinition))
        .map(value => {
            let progress = progressForCurrentTraining.get(value);
            if (!progress) {
                progress = {
                    term: value,
                    iterationNumber: 0,
                    lastTrainingDate: undefined
                };

                progressForCurrentTraining.set(value, progress);
            }
            return progress;
        })
        .filter(progress => progress.iterationNumber === 0);
}

function HomePage() {
    const [renderState, setRenderState] = useState<RenderedPage>(RenderedPage.HOME);

    const translationsTrainingClicked = () => {
        setRenderState(RenderedPage.TRAINING_TRANSLATIONS)
    }

    const articlesTrainingClicked = () => {
        setRenderState(RenderedPage.TRAINING_ARTICLES)
    }

    const addWordsClicked = () => {
        setRenderState(RenderedPage.ADD_WORDS)
    }

    const homeClicked = () => {
        setRenderState(RenderedPage.HOME)
    }

    let render = <></>

    if (renderState === RenderedPage.TRAINING_TRANSLATIONS) {
        render = (
            <TrainingSession onHomeButtonClicked={homeClicked} trainingDefinition={translationsTrainingDefinition}
                             termTrainingProgress={getTermsToTrain(germanProfile, translationsTrainingDefinition)}/>
        )
    } else if (renderState === RenderedPage.TRAINING_ARTICLES) {
        render = (
            <TrainingSession onHomeButtonClicked={homeClicked} trainingDefinition={articleTrainingDefinition}
                             termTrainingProgress={getTermsToTrain(germanProfile, articleTrainingDefinition)}/>
        )
    } else if (renderState === RenderedPage.ADD_WORDS) {
        render = <div> Here will be page for adding words</div>
    } else if (renderState === RenderedPage.HOME) {
        render = (
            <div>
                This is home page.
                <br/>
                <button onClick={translationsTrainingClicked}>Go to translations training</button>
                <br/>
                <button onClick={articlesTrainingClicked}>Go to articles training</button>
                <br/>
                <button onClick={addWordsClicked}>Add new words</button>
            </div>
        )
    } else {
        throw `Unknown state: ${renderState}`
    }

    return render;
}

export default HomePage;
