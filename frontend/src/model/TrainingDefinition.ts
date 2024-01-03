import {TermDefinition} from "./TermDefinition";
import {AttributeDefinition} from "./AttributeDefinition";

export interface TrainingDefinition {
    name: string,
    configuration: Map<TermDefinition, TermTrainingRule>;
}

export interface TermTrainingRule {
    attributesToShow: AttributeDefinition[];
    attributesToGuess: AttributeDefinition[];
}