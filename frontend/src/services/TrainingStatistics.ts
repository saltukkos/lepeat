import {TrainingDefinition} from "../model/TrainingDefinition";
import {LepeatProfile} from "../model/LepeatProfile";
import {doNeedToTrain} from "./TrainingStarter";

export function getTrainingStatistics(trainingDefinition: TrainingDefinition, profile: LepeatProfile) {
    const overallStatistics = new Array<number>(profile.intervals.length + 1).fill(0);
    const thisTimeStatistics = new Array<number>(profile.intervals.length + 1).fill(0);
    const trainingProgress = profile.trainingProgresses.get(trainingDefinition);
    if (!trainingProgress) {
        return [overallStatistics, thisTimeStatistics];
    }

    const currentTime = Date.now();

    const progressForCurrentTraining = trainingProgress.progress;
    const matchingTerms = profile.terms.filter(term => trainingDefinition.configuration.has(term.termDefinition));
    for (const term of matchingTerms) {
        const termProgress = progressForCurrentTraining.get(term);
        if (!termProgress){
            overallStatistics[0] += 1;
            thisTimeStatistics[0] += 1;
        } else {
            const iteration = termProgress?.iterationNumber ?? 0;
            overallStatistics[iteration] += 1;
            if (doNeedToTrain(termProgress, profile, currentTime))
                thisTimeStatistics[iteration] += 1;
        }
    }

    return [overallStatistics, thisTimeStatistics];
}