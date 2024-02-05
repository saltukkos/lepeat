import {LepeatProfile} from "../model/LepeatProfile";
import {MergeableEntity} from "../model/MergeableEntity";
import { v4 as uuidv4 } from "uuid";

export function migrateV2(profile: LepeatProfile) {
    function ensureIdExists(entity: MergeableEntity)
    {
        if (!entity.id){
            entity.id = uuidv4();
            console.log(`created id for entity ${entity}`)
        }
    }

    profile.termDefinitions.forEach(termDefinition => {
        ensureIdExists(termDefinition);
        termDefinition.attributes.forEach(attributeDefinition => {
            ensureIdExists(attributeDefinition);
        });
    })

    profile.trainingDefinitions.forEach(trainingDefinition => {
        ensureIdExists(trainingDefinition);
        trainingDefinition.configuration.forEach((rule) => {
            ensureIdExists(rule);
        })
    });

    profile.terms.forEach(term => ensureIdExists(term));

    profile.trainingProgresses.forEach(progress => {
        progress.progress.forEach((value) => {
            ensureIdExists(value);
            if ("lastTrainingDate" in value && typeof value.lastTrainingDate === "number"){
                value.lastEditDate = value.lastTrainingDate;
                delete value.lastTrainingDate;
            }
        });
    });
}
