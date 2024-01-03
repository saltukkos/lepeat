import React, {useState} from "react";
import TrainingSession from "../training/TrainingSession";
import {articleTrainingDefinition, germanProfile, translationsTrainingDefinition} from "../../model/DefaultModel";
import {getTermsToTrain} from "../../services/TrainingStarter";
import Statistics from "../statistics/debug/Statistics";

enum RenderedPage {
    HOME,
    TRAINING_TRANSLATIONS,
    TRAINING_ARTICLES,
    ADD_WORDS,
    STATISTICS_DEBUG
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

    const statisticsDebugClicked = () => {
        setRenderState(RenderedPage.STATISTICS_DEBUG)
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
    } else if (renderState === RenderedPage.STATISTICS_DEBUG) {
        render = (
            <Statistics terms={germanProfile.terms} trainingProgresses={germanProfile.trainingProgresses} />
        )
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
                <br/>
                <button onClick={statisticsDebugClicked}>Statistics debug</button>
            </div>
        )
    } else {
        throw `Unknown state: ${renderState}`
    }

    return render;
}

export default HomePage;
