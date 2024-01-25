import {TermDefinition} from "./TermDefinition";
import {AttributeDefinition} from "./AttributeDefinition";

export const DEFAULT_LEARNING_INTERVALS = [1, 10]
export const DEFAULT_REPETITION_INTERVALS = [1, 2, 5, 12, 30, 75, 187];

export interface TrainingDefinition {
    name: string,
    configuration: Map<TermDefinition, TermTrainingRule>;
    learningIntervals: number[];
    repetitionIntervals: number[];
}

export interface TermTrainingRule {
    questionPattern: string;
    answerPattern: string;
}

export interface TermTrainingRuleV1 extends TermTrainingRule {
    attributesToShow: AttributeDefinition[];
    attributesToGuess: AttributeDefinition[];
}