import {parse, stringify} from 'flatted';
import {LepeatProfile} from "../model/LepeatProfile";
import {TermDefinition} from "../model/TermDefinition";
import {TermTrainingRule, TermTrainingRuleV1} from "../model/TrainingDefinition";
import {AttributeDefinition} from "../model/AttributeDefinition";

export function serializeProfile(profile: LepeatProfile) {
    const replacer = (key: any, value: any) =>
        value instanceof Map 
            ? {dataType: 'Map', value: Array.from(value.entries())} 
            : value;

    return stringify(profile, replacer);
}

function migrateTrainingRuleData(profile: LepeatProfile) {
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

export function deserializeProfile(data: string): LepeatProfile | undefined {
    const reviver = (key: any, value: any) => value && value.dataType === 'Map'
        ? new Map(value.value)
        : value;

    try {
        const profile = parse(data, reviver) as LepeatProfile;
        if (profile){
            migrateTrainingRuleData(profile);
        }
        return profile;

    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export function cloneProfile(profile: LepeatProfile){
    return deserializeProfile(serializeProfile(profile))!;
}