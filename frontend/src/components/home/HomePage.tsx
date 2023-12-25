import React, {useState} from "react";
import TrainingSession from "../training/TrainingSession";
import {noun1, translationsTrainingDefinition} from "../../model/DefaultModel";

enum RenderedPage {
    HOME,
    TRAINING,
    ADD_WORDS,
}


function HomePage() {
    const [renderState, setRenderState] = useState<RenderedPage>(RenderedPage.HOME);

    const trainingClicked = () => {
        setRenderState(RenderedPage.TRAINING)
    }

    const addWordsClicked = () => {
        setRenderState(RenderedPage.ADD_WORDS)
    }

    const homeClicked = () => {
        setRenderState(RenderedPage.HOME)
    }

    let render = <></>

    if (renderState == RenderedPage.TRAINING) {
        render = (
            <TrainingSession onHomeButtonClicked={homeClicked} trainingDefinition={translationsTrainingDefinition}
                             termTrainingProgress={[{
                                 term: noun1,
                                 iterationNumber: 0,
                             }]}/>
        )
    } else if (renderState == RenderedPage.ADD_WORDS) {
        render = <div> Here will be page for adding words</div>
    } else if (renderState == RenderedPage.HOME) {
        render = (
            <div>
                This is home page.
                <button onClick={trainingClicked}>Go to training</button>
                <button onClick={addWordsClicked}>Add new words</button>
            </div>
        )
    } else {
        throw `Unknown state: ${renderState}`
    }

    return render;
}

export default HomePage;
