import {Term} from "../model/Term";
import {LepeatProfile} from "../model/LepeatProfile";
import {markProfileDirty} from "./Persistence";
import { v4 as uuidv4 } from "uuid";

export function serializeTerms(terms: Term[]) {
    return terms
        .map(term => serializeTerm(term))
        .join('\n');

    function serializeTerm(term: Term) {
        const attributes = term
            .termDefinition
            .attributes
            .map(attr => term
                .attributeValues
                .get(attr))
            .join('\t');
        
        return `${term.id}\t${term.termDefinition.name}\t${attributes}`; 
    }
}

export function deserializeTerms(data: string, profile: LepeatProfile){
    const lines = data.split('\n');
    const terms = new Map(profile.terms.map(term => [term.id, term]));
    const termDefinitions = new Map(profile.termDefinitions.map(termDefinition => [termDefinition.name, termDefinition]))
    const currentDate = Date.now();
    for (const line of lines) {
        //TODO: handle errors
        const values = line.split('\t');
        const id = values[0] ?? uuidv4();
        const termDefinition = termDefinitions.get(values[1]);
        if (!termDefinition) 
            continue;

        const attributeValues = new Map(termDefinition.attributes.map((value, index) => [value, values[index + 2]]));

        const term = terms.get(id);
        if (term){
            if (term.termDefinition === termDefinition && mapsAreEqual(term.attributeValues, attributeValues)){
                // data is the same, do nothing
            }
            else {
                term.termDefinition = termDefinition;
                term.attributeValues = attributeValues;
                term.lastEditDate = currentDate;
            }
        } else {
            const term: Term = {
                id: id,
                termDefinition: termDefinition,
                attributeValues: attributeValues,
                isBacklog: true,
                lastEditDate: currentDate,
            };

            terms.set(id, term);
        }
    }

    profile.terms = Array.from(terms.values());
    markProfileDirty(profile);
}

function mapsAreEqual<K, V>(map1: Map<K,V>, map2: Map<K,V>): boolean {
    if (map1.size !== map2.size) {
        return false;
    }

    let areEqual = true;
    map1.forEach((value, key) => {
        if (!map2.has(key) || map2.get(key) !== value) {
            areEqual = false;
        }
    });
    return areEqual;
}