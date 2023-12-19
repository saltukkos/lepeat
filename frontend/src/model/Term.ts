import {TermDefinition} from "./TermDefinition";

export interface Term {
    termDefinition: TermDefinition;
    attributeValues: Record<string, string>;
}