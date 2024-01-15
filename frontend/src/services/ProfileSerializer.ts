import {parse, stringify} from 'flatted';
import {LepeatProfile} from "../model/LepeatProfile";
import {translationsTrainingDefinition} from "../model/DefaultModel";
import {Status} from "../model/TrainingProgress";

export function serializeProfile(profile: LepeatProfile) {
    const replacer = (key: any, value: any) =>
        value instanceof Map 
            ? {dataType: 'Map', value: Array.from(value.entries())} 
            : value;

    return stringify(profile, replacer);
}

export function deserializeProfile(data: string): LepeatProfile | undefined {
    const reviver = (key: any, value: any) => value && value.dataType === 'Map'
        ? new Map(value.value)
        : value;

    try {
        const profile = parse(data, reviver) as LepeatProfile;
        if (profile){
            profile.trainingDefinitions.forEach(tr => {
                if (!tr.repetitionIntervals){
                    tr.repetitionIntervals = translationsTrainingDefinition.repetitionIntervals;
                }
                if (!tr.learningIntervals)
                {
                    tr.learningIntervals = translationsTrainingDefinition.learningIntervals;
                }
            })
            
            profile.trainingProgresses.forEach((value, key) => {
                value.progress.forEach((termProgress, key1) => {
                    if (!termProgress.status)
                    {
                        termProgress.status = Status.Repetition;
                    }
                })
            })

            profile.terms.filter(e =>!("isBacklog" in e)).forEach(e => e.isBacklog = false)
        }
        return profile;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}