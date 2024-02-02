import {LepeatProfile} from "../model/LepeatProfile";
import {TrainingDefinition} from "../model/TrainingDefinition";
import {Status, TermTrainingProgress} from "../model/TrainingProgress";
import {markProfileDirty} from "./Persistence";
import { v4 as uuidv4 } from "uuid";

const isDebug = process.env.REACT_APP_IS_DEBUG === 'true';

export enum TrainingType {
    OnlyNew = 'onlyNew',
    OnlyRepeat = 'onlyRepeat',
    All = 'all'
}

export function updateTermProgressEasy(termProgress: TermTrainingProgress, profile : LepeatProfile) {
    switch (termProgress.status) {
        case Status.Relearning:
            throw new Error("Unexpected `easy` action for relearning step");
        case Status.Learning:
            termProgress.status = Status.Repetition;
            termProgress.iterationNumber = 0;
            break;
        case Status.Repetition:
            termProgress.iterationNumber += 2;
            break;
        default:
            throw new Error(`Unknown status: ${termProgress.status}`);
    }

    termProgress.lastEditDate = Date.now();
    markProfileDirty(profile);
}

export function updateTermProgressHard(termProgress: TermTrainingProgress, profile : LepeatProfile) {
    if (termProgress.status === Status.Relearning){
        throw new Error("Unexpected `hard` action for relearning step");
    }

    termProgress.lastEditDate = Date.now();
    markProfileDirty(profile);
}

export function updateTermProgressKnown(termProgress: TermTrainingProgress, trainingDefinitions: TrainingDefinition,profile : LepeatProfile) {
    const currentIteration = termProgress.iterationNumber;

    switch (termProgress.status) {
        case Status.Relearning:
            termProgress.status = Status.Repetition;
            termProgress.iterationNumber = Math.max(0, termProgress.iterationNumber - 1); 
            break;
        case Status.Learning:
            if (currentIteration + 1 >= trainingDefinitions.learningIntervals.length){
                termProgress.status = Status.Repetition;
                termProgress.iterationNumber = 0;
            } else {
                termProgress.iterationNumber += 1;
            }
            break;
        case Status.Repetition:
            termProgress.iterationNumber += 1;
            break;
        default:
            throw new Error(`Unknown status: ${termProgress.status}`);
    }

    termProgress.lastEditDate = Date.now();
    markProfileDirty(profile);
}

export function updateTermProgressDontKnown(termProgress: TermTrainingProgress, profile : LepeatProfile) {
    switch (termProgress.status) {
        case Status.Relearning:
            termProgress.status = Status.Learning;
            termProgress.iterationNumber = 0;
            break;
        case Status.Learning:
            termProgress.iterationNumber = 0;
            break;
        case Status.Repetition:
            termProgress.status = Status.Relearning;
            break;
        default:
            throw new Error(`Unknown status: ${termProgress.status}`);
    }

    termProgress.lastEditDate = Date.now();
    markProfileDirty(profile);
}

export function copyTermTrainingProgress(termTrainingProgress: TermTrainingProgress) {
    return {...termTrainingProgress};
}
export function updateTermTrainingProgress(source : TermTrainingProgress, target: TermTrainingProgress, profile : LepeatProfile) {
    target.status = source.status;
    target.lastEditDate = source.lastEditDate;
    target.iterationNumber = source.iterationNumber;
    markProfileDirty(profile);
}

export function getTermsToTrain(profile: LepeatProfile, trainingDefinition: TrainingDefinition, trainingType: TrainingType) {
    let trainingProgress = profile.trainingProgresses.get(trainingDefinition);
    if (!trainingProgress) {
        trainingProgress = {progress: new Map()};
        profile.trainingProgresses.set(trainingDefinition, trainingProgress);
    }

    let progressForCurrentTraining = trainingProgress.progress;
    let currentTime = Date.now();

    return profile.terms
        .filter(t => !t.isBacklog)
        .filter(term => trainingDefinition.configuration.has(term.termDefinition))
        .map(value => {
            let termProgress = progressForCurrentTraining.get(value);
            if (!termProgress) {
                termProgress = {
                    id: uuidv4(),
                    status: Status.Learning,
                    term: value,
                    iterationNumber: 0,
                    lastEditDate: undefined
                };

                progressForCurrentTraining.set(value, termProgress);
            }
            return termProgress;
        })
        .filter(progress => {
            switch (trainingType) {
              case TrainingType.OnlyNew:
                return progress.status === Status.Learning || progress.status === Status.Relearning;
              case TrainingType.OnlyRepeat:
                return progress.status === Status.Repetition;
            }
            return true;
        })
        .filter(progress => doNeedToTrain(progress, trainingDefinition, currentTime).doNeed);
}

export function doNeedToTrain(progress: TermTrainingProgress, trainingDefinition: TrainingDefinition, currentTime: number): {
    doNeed: boolean;
    remainingDelayBeforeStart: number
} {
    const lastTrainingDate = progress.lastEditDate;
    if (!lastTrainingDate) {
        return {doNeed: true, remainingDelayBeforeStart: 0};
    }
    let interval = getInterval(trainingDefinition, progress);

    const nextTrainDateForTerm = lastTrainingDate + interval;
    const remainingDelayBeforeStart = nextTrainDateForTerm - currentTime;
    const doNeedTrain = remainingDelayBeforeStart <= 0;
    return {doNeed: doNeedTrain, remainingDelayBeforeStart};
}

function getInterval(trainingDefinition: TrainingDefinition, progress: TermTrainingProgress) {
    switch (progress.status) {
        case Status.Relearning:
            return fromMinutes(trainingDefinition.learningIntervals[trainingDefinition.learningIntervals.length - 1] ?? 0);
        case Status.Learning:
            return fromMinutes(getIntervalSafe(trainingDefinition.learningIntervals, progress.iterationNumber));
        case Status.Repetition:
            return fromHours(getIntervalSafe(trainingDefinition.repetitionIntervals, progress.iterationNumber));
    }
}

function fromMinutes(number: number) {
    if (isDebug){
        return 1000 * 30;
    }

    return number * 1000 * 60;
}

function fromHours(number: number) {
    if (isDebug){
        return 1000 * 60;
    }

    return number * 1000 * 60 * 60 * 24;
}

function getIntervalSafe(array: number[], iteration: number): number {
    if (array.length === 0) {
        return 0;
    }

    if (iteration < 0) {
        return array[0];
    } else if (iteration >= array.length) {
        return array[array.length - 1];
    } else {
        return array[iteration];
    }
}