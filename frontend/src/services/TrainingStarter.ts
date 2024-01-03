import {LepeatProfile} from "../model/LepeatProfile";
import {TrainingDefinition} from "../model/TrainingDefinition";
import {TermTrainingProgress} from "../model/TrainingProgress";

const isDebug = true;

export function getTermsToTrain(profile: LepeatProfile, trainingDefinition: TrainingDefinition) {
    let trainingProgress = profile.trainingProgresses.get(trainingDefinition);
    if (!trainingProgress) {
        trainingProgress = { progress: new Map() };
        profile.trainingProgresses.set(trainingDefinition, trainingProgress);
    }

    let progressForCurrentTraining = trainingProgress.progress;
    let currentTime = Date.now();

    return profile.terms
        .filter(term => trainingDefinition.configuration.has(term.termDefinition))
        .map(value => {
            let termProgress = progressForCurrentTraining.get(value);
            if (!termProgress) {
                termProgress = {
                    term: value,
                    iterationNumber: 0,
                    lastTrainingDate: undefined
                };

                progressForCurrentTraining.set(value, termProgress);
            }
            return termProgress;
        })
        .filter(progress => doNeedToTrain(progress));

    function doNeedToTrain(progress: TermTrainingProgress) {
        let lastTrainingDate = progress.lastTrainingDate;
        if (!lastTrainingDate)
        {
            return true;
        }

        let interval = profile.intervals[progress.iterationNumber]; //TODO what to do after the last iteration?
        if (isDebug)
        {
            interval *= 60 * 1000; //interpret as minutes in debug mode
        }
        else
        {
            interval *= 24 * 60 * 60 * 1000; //interpret as days in normal mode
        }

        let nextTrainDateForTerm = lastTrainingDate + interval;
        return nextTrainDateForTerm < currentTime;
    }
}
