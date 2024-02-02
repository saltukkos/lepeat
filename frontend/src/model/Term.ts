import {TermDefinition} from "./TermDefinition";
import {AttributeDefinition} from "./AttributeDefinition";
import {MergeableEntity} from "./MergeableEntity";

export interface Term extends MergeableEntity {
    isBacklog: boolean;
    termDefinition: TermDefinition;
    attributeValues: Map<AttributeDefinition, string>;
}