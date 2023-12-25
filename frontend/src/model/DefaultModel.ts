import {AttributeDefinition} from "./AttributeDefinition";
import {TermDefinition} from "./TermDefinition";
import {TermTrainingRule, TrainingDefinition} from "./TrainingDefinition";
import {Term} from "./Term";

export const originalWordAttribute: AttributeDefinition = {
    name: "Word",
};

export const translatedWordAttribute: AttributeDefinition = {
    name: "Translation",
};

export const germanArticleAttribute: AttributeDefinition = {
    name: "Article",
}

export const germanNounDefinition: TermDefinition = {
    attributes: [
        germanArticleAttribute,
        originalWordAttribute,
        translatedWordAttribute,
    ]
}

export const germanVerbDefinition: TermDefinition = {
    attributes: [
        originalWordAttribute,
        translatedWordAttribute,
    ]
}

export const noun1: Term = {
    termDefinition: germanNounDefinition,
    attributeValues: new Map<AttributeDefinition, string>([
        [germanArticleAttribute, "der"],
        [originalWordAttribute, "Hund"],
        [translatedWordAttribute, "Собака"],
    ]),
}

export const noun2: Term = {
    termDefinition: germanNounDefinition,
    attributeValues: new Map<AttributeDefinition, string>([
        [germanArticleAttribute, "die"],
        [originalWordAttribute, "Katze"],
        [translatedWordAttribute, "Кошка"],
    ]),
}

export const noun3: Term = {
    termDefinition: germanNounDefinition,
    attributeValues: new Map<AttributeDefinition, string>([
        [germanArticleAttribute, "das"],
        [originalWordAttribute, "Buch"],
        [translatedWordAttribute, "Книга"],
    ]),
}

export const noun4: Term = {
    termDefinition: germanNounDefinition,
    attributeValues: new Map<AttributeDefinition, string>([
        [germanArticleAttribute, "der"],
        [originalWordAttribute, "Tisch"],
        [translatedWordAttribute, "Стол"],
    ]),
}

export const noun5: Term = {
    termDefinition: germanNounDefinition,
    attributeValues: new Map<AttributeDefinition, string>([
        [germanArticleAttribute, "die"],
        [originalWordAttribute, "Tasche"],
        [translatedWordAttribute, "Сумка"],
    ]),
}

export const verb1: Term = {
    termDefinition: germanVerbDefinition,
    attributeValues: new Map<AttributeDefinition, string>([
        [originalWordAttribute, "laufen"],
        [translatedWordAttribute, "бежать"],
    ]),
}

export const verb2: Term = {
    termDefinition: germanVerbDefinition,
    attributeValues: new Map<AttributeDefinition, string>([
        [originalWordAttribute, "lesen"],
        [translatedWordAttribute, "читать"],
    ]),
}

export const verb3: Term = {
    termDefinition: germanVerbDefinition,
    attributeValues: new Map<AttributeDefinition, string>([
        [originalWordAttribute, "schreiben"],
        [translatedWordAttribute, "писать"],
    ]),
}

export const verb4: Term = {
    termDefinition: germanVerbDefinition,
    attributeValues: new Map<AttributeDefinition, string>([
        [originalWordAttribute, "sprechen"],
        [translatedWordAttribute, "говорить"],
    ]),
}

export const verb5: Term = {
    termDefinition: germanVerbDefinition,
    attributeValues: new Map<AttributeDefinition, string>([
        [originalWordAttribute, "sehen"],
        [translatedWordAttribute, "видеть"],
    ]),
}

export const translationsTrainingDefinition: TrainingDefinition = {
    configuration: new Map<TermDefinition, TermTrainingRule>([
        [germanNounDefinition, {
            attributesToShow: [germanArticleAttribute, originalWordAttribute],
            attributesToGuess: [translatedWordAttribute],
        }],
        [germanVerbDefinition, {
            attributesToShow: [originalWordAttribute],
            attributesToGuess: [translatedWordAttribute]
        }],
    ])
}

export const articleTrainingDefinition: TrainingDefinition = {
    configuration: new Map<TermDefinition, TermTrainingRule>([
        [germanNounDefinition, {
            attributesToShow: [translatedWordAttribute, originalWordAttribute],
            attributesToGuess: [germanArticleAttribute],
        }],
    ])
}

