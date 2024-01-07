import {TrainingDefinition} from "../model/TrainingDefinition";
import {LepeatProfile} from "../model/LepeatProfile";

export function getTrainingStatistics(trainingDefinition: TrainingDefinition, profile: LepeatProfile) {
    const statistics = new Array<number>(profile.intervals.length + 1).fill(0);
    const trainingProgress = profile.trainingProgresses.get(trainingDefinition);
    if (!trainingProgress) {
        return statistics;
    }

    const progressForCurrentTraining = trainingProgress.progress;
    const matchingTerms = profile.terms.filter(term => trainingDefinition.configuration.has(term.termDefinition));
    for (const term of matchingTerms) {
        const iteration = progressForCurrentTraining.get(term)?.iterationNumber ?? 0;
        statistics[iteration] += 1;
    }

    return statistics;
}