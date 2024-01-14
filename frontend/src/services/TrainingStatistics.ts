import {TrainingDefinition} from "../model/TrainingDefinition";
import {LepeatProfile} from "../model/LepeatProfile";
import {doNeedToTrain} from "./TrainingService";
import {Status} from "../model/TrainingProgress";

export function getTrainingStatistics(trainingDefinition: TrainingDefinition, profile: LepeatProfile) {
    const overallStatistics = new Array<number>(trainingDefinition.repetitionIntervals.length + 1).fill(0);
    const thisTimeStatistics = new Array<number>(trainingDefinition.repetitionIntervals.length + 1).fill(0);
    let minimalTimeToUpdate = Number.MAX_SAFE_INTEGER;

    const trainingProgress = profile.trainingProgresses.get(trainingDefinition);
    if (!trainingProgress) {
        return {overallStatistics, thisTimeStatistics, minimalTimeToUpdate};
    }

    const currentTime = Date.now();

    const progressForCurrentTraining = trainingProgress.progress;
    // TODO: filter by backlog
    const matchingTerms = profile.terms.filter(term => trainingDefinition.configuration.has(term.termDefinition));

    for (const term of matchingTerms) {
        const termProgress = progressForCurrentTraining.get(term);
        if (!termProgress) {
            overallStatistics[0] += 1;
            thisTimeStatistics[0] += 1;
        } else {
            const {doNeed, remainingDelayBeforeStart} = doNeedToTrain(termProgress, trainingDefinition, currentTime);
            switch (termProgress.status) {
                case Status.Learning:
                case Status.Relearning:
                    updateStatistics(0, doNeed, remainingDelayBeforeStart);
                    break;
                case Status.Repetition:
                    const iteration = Math.min(Math.max(0, termProgress.iterationNumber), overallStatistics.length - 2);
                    updateStatistics(iteration + 1, doNeed, remainingDelayBeforeStart);
                    break;
            }
        }
    }

    return {overallStatistics, thisTimeStatistics, minimalTimeToUpdate};

    function updateStatistics(iteration: number, doNeed: boolean, remainingDelayBeforeStart: number) {
        overallStatistics[iteration] += 1;

        if (doNeed) {
            thisTimeStatistics[iteration] += 1;
        } else {
            minimalTimeToUpdate = Math.min(minimalTimeToUpdate, remainingDelayBeforeStart);
        }
    }
}