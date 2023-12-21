import {AttributeDefinition} from "./AttributeDefinition";
import {TermDefinition} from "./TermDefinition";
import {TermTrainingRule, TrainingDefinition} from "./TrainingDefinition";
import {Term} from "./Term";

const originalWordAttribute: AttributeDefinition = {
    name: "Word",
};

const translatedWordAttribute: AttributeDefinition = {
    name: "Translation",
};

const germanArticleAttribute: AttributeDefinition = {
    name: "Article",
}

const germanNounDefinition: TermDefinition = {
    attributes: [
        germanArticleAttribute,
        originalWordAttribute,
        translatedWordAttribute,
    ]
}

const germanVerbDefinition: TermDefinition = {
    attributes: [
        originalWordAttribute,
        translatedWordAttribute,
    ]
}

const noun1: Term = {
    termDefinition: germanNounDefinition,
    attributeValues: new Map<AttributeDefinition, string>([
        [germanArticleAttribute, "der"],
        [originalWordAttribute, "Hund"],
        [translatedWordAttribute, "Собака"],
    ]),
}

const noun2: Term = {
    termDefinition: germanNounDefinition,
    attributeValues: new Map<AttributeDefinition, string>([
        [germanArticleAttribute, "die"],
        [originalWordAttribute, "Katze"],
        [translatedWordAttribute, "Кошка"],
    ]),
}

const noun3: Term = {
    termDefinition: germanNounDefinition,
    attributeValues: new Map<AttributeDefinition, string>([
        [germanArticleAttribute, "das"],
        [originalWordAttribute, "Buch"],
        [translatedWordAttribute, "Книга"],
    ]),
}

const noun4: Term = {
    termDefinition: germanNounDefinition,
    attributeValues: new Map<AttributeDefinition, string>([
        [germanArticleAttribute, "der"],
        [originalWordAttribute, "Tisch"],
        [translatedWordAttribute, "Стол"],
    ]),
}

const noun5: Term = {
    termDefinition: germanNounDefinition,
    attributeValues: new Map<AttributeDefinition, string>([
        [germanArticleAttribute, "die"],
        [originalWordAttribute, "Tasche"],
        [translatedWordAttribute, "Сумка"],
    ]),
}

const verb1: Term = {
    termDefinition: germanVerbDefinition,
    attributeValues: new Map<AttributeDefinition, string>([
        [originalWordAttribute, "laufen"],
        [translatedWordAttribute, "бежать"],
    ]),
}

const verb2: Term = {
    termDefinition: germanVerbDefinition,
    attributeValues: new Map<AttributeDefinition, string>([
        [originalWordAttribute, "lesen"],
        [translatedWordAttribute, "читать"],
    ]),
}

const verb3: Term = {
    termDefinition: germanVerbDefinition,
    attributeValues: new Map<AttributeDefinition, string>([
        [originalWordAttribute, "schreiben"],
        [translatedWordAttribute, "писать"],
    ]),
}

const verb4: Term = {
    termDefinition: germanVerbDefinition,
    attributeValues: new Map<AttributeDefinition, string>([
        [originalWordAttribute, "sprechen"],
        [translatedWordAttribute, "говорить"],
    ]),
}

const verb5: Term = {
    termDefinition: germanVerbDefinition,
    attributeValues: new Map<AttributeDefinition, string>([
        [originalWordAttribute, "sehen"],
        [translatedWordAttribute, "видеть"],
    ]),
}

const translationsTrainingDefinition: TrainingDefinition = {
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

const articleTrainingDefinition: TrainingDefinition = {
    configuration: new Map<TermDefinition, TermTrainingRule>([
        [germanNounDefinition, {
            attributesToShow: [translatedWordAttribute, originalWordAttribute],
            attributesToGuess: [germanArticleAttribute],
        }],
    ])
}

