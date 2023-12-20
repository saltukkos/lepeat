import {AttributeDefinition} from "./AttributeDefinition";
import {TermDefinition} from "./TermDefinition";
import {TermTrainingDefinition, TrainingDefinition} from "./TrainingDefinition";

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

const translationsTrainingDefinition: TrainingDefinition = {
    configuration: new Map<TermDefinition, TermTrainingDefinition>([
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