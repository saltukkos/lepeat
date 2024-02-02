import {AttributeDefinition} from "./AttributeDefinition";
import {TermDefinition} from "./TermDefinition";
import {TermTrainingRule, TrainingDefinition} from "./TrainingDefinition";
import {Term} from "./Term";
import {Status, TermTrainingProgress, TrainingProgress} from "./TrainingProgress";
import {LepeatProfile} from "./LepeatProfile";

export const originalWordAttribute: AttributeDefinition = {
    id: "fa04b3c8",
    name: "Word",
};

export const translatedWordAttribute: AttributeDefinition = {
    id: "bdfefc21",
    name: "Translation",
};

export const germanArticleAttribute: AttributeDefinition = {
    id: "55227909",
    name: "Article",
}

export const germanNounDefinition: TermDefinition = {
    id: "a7e784c5",
    name: "Noun",
    attributes: [
        germanArticleAttribute,
        originalWordAttribute,
        translatedWordAttribute,
    ]
}

export const germanVerbDefinition: TermDefinition = {
    id: "c4f9c3eb",
    name: "Verb",
    attributes: [
        originalWordAttribute,
        translatedWordAttribute,
    ]
}

export const noun1: Term = {
    id: "e614ee8f",
    termDefinition: germanNounDefinition,
    attributeValues: new Map<AttributeDefinition, string>([
        [germanArticleAttribute, "der"],
        [originalWordAttribute, "Hund"],
        [translatedWordAttribute, "Собака"],
    ]),
    isBacklog: true
}

export const noun2: Term = {
    id : "4189e22a",
    termDefinition: germanNounDefinition,
    attributeValues: new Map<AttributeDefinition, string>([
        [germanArticleAttribute, "die"],
        [originalWordAttribute, "Katze"],
        [translatedWordAttribute, "Кошка"],
    ]),
    isBacklog: true
}

export const noun3: Term = {
    id : "467a1220",
    termDefinition: germanNounDefinition,
    attributeValues: new Map<AttributeDefinition, string>([
        [germanArticleAttribute, "das"],
        [originalWordAttribute, "Buch"],
        [translatedWordAttribute, "Книга"],
    ]),
    isBacklog: true
}

export const noun4: Term = {
    id : "6d4b2af3",
    termDefinition: germanNounDefinition,
    attributeValues: new Map<AttributeDefinition, string>([
        [germanArticleAttribute, "der"],
        [originalWordAttribute, "Tisch"],
        [translatedWordAttribute, "Стол"],
    ]),
    isBacklog: true
}

export const noun5: Term = {
    id : "ec644938",
    termDefinition: germanNounDefinition,
    attributeValues: new Map<AttributeDefinition, string>([
        [germanArticleAttribute, "die"],
        [originalWordAttribute, "Tasche"],
        [translatedWordAttribute, "Сумка"],
    ]),
    isBacklog: false
}

export const verb1: Term = {
    id : "00528e6a",
    termDefinition: germanVerbDefinition,
    attributeValues: new Map<AttributeDefinition, string>([
        [originalWordAttribute, "laufen"],
        [translatedWordAttribute, "бежать"],
    ]),
    isBacklog: true
}

export const verb2: Term = {
    id : "0192c1c1",
    termDefinition: germanVerbDefinition,
    attributeValues: new Map<AttributeDefinition, string>([
        [originalWordAttribute, "lesen"],
        [translatedWordAttribute, "читать"],
    ]),
    isBacklog: true
}

export const verb3: Term = {
    id : "2bbc594f",
    termDefinition: germanVerbDefinition,
    attributeValues: new Map<AttributeDefinition, string>([
        [originalWordAttribute, "schreiben"],
        [translatedWordAttribute, "писать"],
    ]),
    isBacklog: true
}

export const verb4: Term = {
    id : "e4a294e1",
    termDefinition: germanVerbDefinition,
    attributeValues: new Map<AttributeDefinition, string>([
        [originalWordAttribute, "sprechen"],
        [translatedWordAttribute, "говорить"],
    ]),
    isBacklog: true
}

export const verb5: Term = {
    id : "c2f25cef",
    termDefinition: germanVerbDefinition,
    attributeValues: new Map<AttributeDefinition, string>([
        [originalWordAttribute, "sehen"],
        [translatedWordAttribute, "видеть"],
    ]),
    isBacklog: false
}

export const translationsTrainingDefinition: TrainingDefinition = {
    id: "8966a808",
    name: "Translation training",
    learningIntervals: [1, 10],
    repetitionIntervals: [1, 2, 5, 12, 30, 75, 187],
    configuration: new Map<TermDefinition, TermTrainingRule>([
        [germanNounDefinition, {
            id: "53245872",
            questionPattern: "{Article} {Word}",
            answerPattern: "{Translation}",
        }],
        [germanVerbDefinition, {
            id: "9a1ef452",
            questionPattern: "{Word}",
            answerPattern: "{Translation}",
        }],
    ])
}

export const articleTrainingDefinition: TrainingDefinition = {
    id: "465bc3ac",
    name: "Article training",
    learningIntervals: [1, 10],
    repetitionIntervals: [1, 2, 5, 12, 30, 75, 187],
    configuration: new Map<TermDefinition, TermTrainingRule>([
        [germanNounDefinition, {
            id: "c9954d5c",
            questionPattern: "{Word} ({Translation})",
            answerPattern: "{Article}",
        }],
    ])
}

const translationTrainingProgress: TrainingProgress = {
    progress: new Map<Term, TermTrainingProgress>(
        [
            [verb5, {id: "1411d053", term: verb5, status: Status.Repetition, iterationNumber: 1, lastEditDate: Date.now()}]
        ])
}

const articlesTrainingProgress: TrainingProgress = {
    progress: new Map<Term, TermTrainingProgress>([
        [noun5, {id:"c6c4cecf", term: noun5, status: Status.Relearning, iterationNumber: 3, lastEditDate: Date.now()}],
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
}

export const emptyProfile: LepeatProfile = {
    termDefinitions: [],
    trainingDefinitions: [],
    terms: [],
    trainingProgresses: new Map(),
}