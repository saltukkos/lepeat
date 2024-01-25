import {findStringsInCurlyBraces, isEmptyOrBlank} from "../../utils/string";
import {LepeatProfile} from "../../model/LepeatProfile";
import {TermDefinition} from "../../model/TermDefinition";
import {TermTrainingRule} from "../../model/TrainingDefinition";

export function validateTrainingData(profile: LepeatProfile, trainingName: string, learningIntervals: number[], repetitionIntervals: number[]) {
    if (isEmptyOrBlank(trainingName)) {
        return "Training name is empty";
    }
    if (profile.trainingDefinitions.some(e => e.name === trainingName)) {
        return "Training with the same already exists";
    }
    if (learningIntervals.length <= 0) {
        return "Learning intervals should not be empty";
    }
    if (repetitionIntervals.length <= 0) {
        return "Repetition intervals should not be empty";
    }
    return null;
}

export function validateConfiguration(configuration: Map<TermDefinition, TermTrainingRule>) {
    if (configuration.size <= 0) {
        return "No training rule is defined";
    }

    Array.from(configuration.entries()).forEach(e => {
        const attrs = new Set(e[0].attributes.map(e => e.name));
        const placeholderQuestionAttributes = findStringsInCurlyBraces(e[1].questionPattern);
        const placeholderAnswerAttributes = findStringsInCurlyBraces(e[1].answerPattern);

        if (placeholderQuestionAttributes.length <= 0) {
            return "Question pattern should be filled with attributes (use {} for this)";
        }

        if (placeholderAnswerAttributes.length <= 0) {
            return "Answer pattern should be filled with attributes (use {} for this)";
        }

        const notExistingQuestionAttributes = placeholderQuestionAttributes.filter(e => !attrs.has(e));
        if (notExistingQuestionAttributes.length > 0) {
            return `Term ${e[0].name} does not have attribute with name: ${notExistingQuestionAttributes.join(", ")}`
        }

        const notExistingAnswerAttributes = placeholderAnswerAttributes.filter(e => !attrs.has(e));
        if (notExistingAnswerAttributes.length > 0) {
            return `Term ${e[0].name} does not have attribute with name: ${notExistingQuestionAttributes.join(", ")}`
        }
    });

    return null;
}