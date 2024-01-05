import {TermDefinition} from "./TermDefinition";
import {AttributeDefinition} from "./AttributeDefinition";

export interface Term {
    id: number;
    termDefinition: TermDefinition;
    attributeValues: Map<AttributeDefinition, string>;
}