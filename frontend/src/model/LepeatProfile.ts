import {TermDefinition} from "./TermDefinition";
import {Term} from "./Term";
import {TrainingProgress} from "./TrainingProgress";
import {TrainingDefinition} from "./TrainingDefinition";

export interface LepeatProfile {
    termDefinitions: TermDefinition[];
    trainingDefinitions: TrainingDefinition[];

    terms: Term[];
    trainingProgresses: Map<TrainingDefinition, TrainingProgress>;

    intervals: number[];
}