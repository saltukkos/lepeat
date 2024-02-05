import {LepeatProfile} from "../model/LepeatProfile";
import {AttributeDefinition} from "../model/AttributeDefinition";
import {TermTrainingRule, TermTrainingRuleV1} from "../model/TrainingDefinition";
import {TermDefinition} from "../model/TermDefinition";

export function migrateV1(profile: LepeatProfile) {
    const transformToNewFormat = (attributes: AttributeDefinition[]) => {
        return attributes.map(a => `{${a.name}}`).join(" ");
    }

    const hasOldFields = (rule: TermTrainingRule & {
        attributesToShow?: AttributeDefinition[];
        attributesToGuess?: AttributeDefinition[]
    }): rule is TermTrainingRuleV1 => {
        return (rule.hasOwnProperty("attributesToShow") && rule.hasOwnProperty("attributesToGuess"))
    }

    profile.trainingDefinitions.forEach(tr => {
        if (!!tr.configuration) {
            let needToUpdate = false;
            const newConfiguration = new Map<TermDefinition, TermTrainingRule>();
            Array.from(tr.configuration.entries()).forEach(e => {
                const oldRule = e[1];
                if (hasOldFields(oldRule)) {
                    const questionPattern = transformToNewFormat(oldRule.attributesToShow)
                    const answerPattern = transformToNewFormat(oldRule.attributesToGuess)
                    newConfiguration.set(e[0], {id: oldRule.id, lastEditDate: oldRule.lastEditDate, questionPattern, answerPattern})
                    needToUpdate = true;
                } else {
                    newConfiguration.set(e[0], e[1]);
                }
            });
            if (needToUpdate) {
                console.log("update old configuration")
                console.log(newConfiguration)
                tr.configuration = newConfiguration;
            }
        }
    })
}
