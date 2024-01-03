import {parse, stringify} from 'flatted';
import {LepeatProfile} from "../model/LepeatProfile";

export function serializeProfile(profile: LepeatProfile) {
    const replacer = (key: any, value: any) =>
        value instanceof Map 
            ? {dataType: 'Map', value: Array.from(value.entries())} 
            : value;

    return stringify(profile, replacer);
}

export function deserializeProfile(data: string) : LepeatProfile {
    const reviver = (key: any, value: any) => value && value.dataType === 'Map'
        ? new Map(value.value)
        : value;

    return parse(data, reviver);
}