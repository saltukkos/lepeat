import {TermDefinition} from "./TermDefinition";
import {AttributeDefinition} from "./AttributeDefinition";

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