import {TermDefinition} from "./TermDefinition";
import {AttributeDefinition} from "./AttributeDefinition";

export interface Term {
    termDefinition: TermDefinition;
    attributeValues: Map<AttributeDefinition, string>;
}