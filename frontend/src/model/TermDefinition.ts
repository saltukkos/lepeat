import {AttributeDefinition} from "./AttributeDefinition";
import {MergeableEntity} from "./MergeableEntity";

export interface TermDefinition extends MergeableEntity{
    name: string;
    attributes: AttributeDefinition[];
}