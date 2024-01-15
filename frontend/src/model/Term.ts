import {TermDefinition} from "./TermDefinition";
import {AttributeDefinition} from "./AttributeDefinition";

export interface Term {
    isBacklog: boolean;
    id: number;
    termDefinition: TermDefinition;
    attributeValues: Map<AttributeDefinition, string>;
}