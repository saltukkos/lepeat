import {TermDefinition} from "./TermDefinition";
import {AttributeDefinition} from "./AttributeDefinition";

export interface Term {
    // TODO: isInBacklog
    id: number;
    termDefinition: TermDefinition;
    attributeValues: Map<AttributeDefinition, string>;
}