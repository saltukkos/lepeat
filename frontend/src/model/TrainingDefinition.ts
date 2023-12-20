import {TermDefinition} from "./TermDefinition";
import {AttributeDefinition} from "./AttributeDefinition";

export interface TrainingDefinition{
    configuration: Map<TermDefinition, TermTrainingDefinition>
}

export interface TermTrainingDefinition {
    attributesToShow: AttributeDefinition[];
    attributesToGuess: AttributeDefinition[];
}