import {Term} from "../model/Term";
import {LepeatProfile} from "../model/LepeatProfile";

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

    for (const line of lines) {
        //TODO: handle errors
        // TODO: import without ID leads to id NaN and strange behaviour
        const values = line.split('\t');
        let id = +values[0];
        const termDefinition = termDefinitions.get(values[1]);
        if (!termDefinition) 
            continue; 

        const attributeValues = new Map(termDefinition.attributes.map((value, index) => [value, values[index + 2]]));

        const term = terms.get(id);
        if (term){
            term.termDefinition = termDefinition;
            term.attributeValues = attributeValues;
        } else {
            const term: Term = {
                id: id,
                termDefinition: termDefinition,
                attributeValues: attributeValues,
                isBacklog: true
            };

            terms.set(id, term);
        }
    }

    return terms;
}