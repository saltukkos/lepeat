import {parse, stringify} from 'flatted';
import {LepeatProfile} from "../model/LepeatProfile";

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
        return parse(data, reviver);
    } catch (error) {
        console.error(error);
        return undefined;
    }
}