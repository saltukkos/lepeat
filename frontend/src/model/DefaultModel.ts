import {AttributeDefinition} from "./AttributeDefinition";
import {TermDefinition} from "./TermDefinition";
import {TermTrainingRule, TrainingDefinition} from "./TrainingDefinition";
import {Term} from "./Term";
import {TermTrainingProgress, TrainingProgress} from "./TrainingProgress";
import {LepeatProfile} from "./LepeatProfile";

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
    name: "Noun",
    attributes: [
        germanArticleAttribute,
        originalWordAttribute,
        translatedWordAttribute,
    ]
}

export const germanVerbDefinition: TermDefinition = {
    name: "Verb",
    attributes: [
        originalWordAttribute,
        translatedWordAttribute,
    ]
}

export const noun1: Term = {
    id: 1,
    termDefinition: germanNounDefinition,
    attributeValues: new Map<AttributeDefinition, string>([
        [germanArticleAttribute, "der"],
        [originalWordAttribute, "Hund"],
        [translatedWordAttribute, "Собака"],
    ]),
}

export const noun2: Term = {
    id : 2,
    termDefinition: germanNounDefinition,
    attributeValues: new Map<AttributeDefinition, string>([
        [germanArticleAttribute, "die"],
        [originalWordAttribute, "Katze"],
        [translatedWordAttribute, "Кошка"],
    ]),
}

export const noun3: Term = {
    id : 3,
    termDefinition: germanNounDefinition,
    attributeValues: new Map<AttributeDefinition, string>([
        [germanArticleAttribute, "das"],
        [originalWordAttribute, "Buch"],
        [translatedWordAttribute, "Книга"],
    ]),
}

export const noun4: Term = {
    id : 4,
    termDefinition: germanNounDefinition,
    attributeValues: new Map<AttributeDefinition, string>([
        [germanArticleAttribute, "der"],
        [originalWordAttribute, "Tisch"],
        [translatedWordAttribute, "Стол"],
    ]),
}

export const noun5: Term = {
    id : 5,
    termDefinition: germanNounDefinition,
    attributeValues: new Map<AttributeDefinition, string>([
        [germanArticleAttribute, "die"],
        [originalWordAttribute, "Tasche"],
        [translatedWordAttribute, "Сумка"],
    ]),
}

export const verb1: Term = {
    id : 6,
    termDefinition: germanVerbDefinition,
    attributeValues: new Map<AttributeDefinition, string>([
        [originalWordAttribute, "laufen"],
        [translatedWordAttribute, "бежать"],
    ]),
}

export const verb2: Term = {
    id : 7,
    termDefinition: germanVerbDefinition,
    attributeValues: new Map<AttributeDefinition, string>([
        [originalWordAttribute, "lesen"],
        [translatedWordAttribute, "читать"],
    ]),
}

export const verb3: Term = {
    id : 8,
    termDefinition: germanVerbDefinition,
    attributeValues: new Map<AttributeDefinition, string>([
        [originalWordAttribute, "schreiben"],
        [translatedWordAttribute, "писать"],
    ]),
}

export const verb4: Term = {
    id : 9,
    termDefinition: germanVerbDefinition,
    attributeValues: new Map<AttributeDefinition, string>([
        [originalWordAttribute, "sprechen"],
        [translatedWordAttribute, "говорить"],
    ]),
}

export const verb5: Term = {
    id : 10,
    termDefinition: germanVerbDefinition,
    attributeValues: new Map<AttributeDefinition, string>([
        [originalWordAttribute, "sehen"],
        [translatedWordAttribute, "видеть"],
    ]),
}

export const translationsTrainingDefinition: TrainingDefinition = {
    name: "Translation training",
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
    name: "Article training",
    configuration: new Map<TermDefinition, TermTrainingRule>([
        [germanNounDefinition, {
            attributesToShow: [translatedWordAttribute, originalWordAttribute],
            attributesToGuess: [germanArticleAttribute],
        }],
    ])
}

export const translationTrainingProgress: TrainingProgress = {
    progress: new Map<Term, TermTrainingProgress>(
        [
            [verb5, {term: verb5, iterationNumber: 1, lastTrainingDate: Date.now()}]
        ])
}

export const articlesTrainingProgress: TrainingProgress = {
    progress: new Map<Term, TermTrainingProgress>([
        [noun5, {term: noun5, iterationNumber: 1, lastTrainingDate: Date.now()}],
    ])
}

export const germanProfile: LepeatProfile = {
    termDefinitions: [germanNounDefinition, germanVerbDefinition],
    trainingDefinitions: [translationsTrainingDefinition, articleTrainingDefinition],
    terms: [noun1, noun2, noun3, noun4, noun5, verb1, verb2, verb3, verb4, verb5],
    trainingProgresses: new Map<TrainingDefinition, TrainingProgress>(
        [[translationsTrainingDefinition, translationTrainingProgress],
            [articleTrainingDefinition, articlesTrainingProgress]]
    ),
    intervals: [0, 1, 3, 7, 15, 30],
}