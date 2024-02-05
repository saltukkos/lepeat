import {parse, stringify} from 'flatted';
import {LepeatProfile} from "../model/LepeatProfile";
import {migrateV1} from "../migrations/MigrationV1";
import {migrateV2} from "../migrations/MigrationV2";

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
            migrateV1(profile);
            migrateV2(profile);
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