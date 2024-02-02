import {LepeatProfile} from "../model/LepeatProfile";
import {TermDefinition} from "../model/TermDefinition";
import {Term} from "../model/Term";
import {MergeableEntity} from "../model/MergeableEntity";
import {AttributeDefinition} from "../model/AttributeDefinition";
import {TrainingDefinition} from "../model/TrainingDefinition";
import {TrainingProgress} from "../model/TrainingProgress";
import {cloneProfile} from "./ProfileSerializer";
import {string} from "prop-types";


export function mergeProfiles(profile1 : LepeatProfile, profile2 : LepeatProfile) {
    const storage = new Map<string, MergeableEntity>();

    function mergeTermDefinitions(termDefinitions1: TermDefinition[], termDefinitions2: TermDefinition[]) {
        const attributes1 = termDefinitions1.flatMap(t => t.attributes);
        const attributes2 = termDefinitions2.flatMap(t => t.attributes);
        mergeArrays(attributes1, attributes2, item => item, mainItem => mainItem);

        return mergeArrays(
            termDefinitions1,
            termDefinitions2,
            item => ({
                ...item,
                attributes: item.attributes.map(intern)
            }),
            (mainItem, secondItem) => ({
                ...mainItem,
                attributes: mergeAttributeDefinitions(mainItem.attributes, secondItem.attributes)
            }));
    }

    function mergeAttributeDefinitions(attributes1: AttributeDefinition[], attributes2: AttributeDefinition[]) {
        return mergeArrays(
            attributes1,
            attributes2,
            intern,
            intern,
        );
    }


    function mergeTerms(terms1: Term[], terms2: Term[]) {
        return mergeArrays(
            terms1,
            terms2,
            item => ({
                ...item,
                termDefinition: intern(item.termDefinition),
                attributeValues: internKeysOfMap(item.attributeValues)
            }),
            (mainItem, secondItem) => ({
                ...mainItem,
                termDefinition: intern(mainItem.termDefinition),
                attributeValues: mergeMapsFirstPriority(mainItem.attributeValues, secondItem.attributeValues)
            }))
    }

    function mergeTrainingDefinitions(trainingDefinitions1: TrainingDefinition[], trainingDefinitions2: TrainingDefinition[]) {
        return mergeArrays(
            trainingDefinitions1,
            trainingDefinitions2,
            item => ({
                ...item,
                configuration: internKeysOfMapWithInnerUpdate(
                    item.configuration,
                    value => value),
            }),
            (mainItem, secondItem) => ({
                ...mainItem,
                configuration: mergeMaps(
                    mainItem.configuration,
                    secondItem.configuration,
                    value => value,
                    mainItem => mainItem),
            }))
    }

    function mergeTrainingProgresses(trainingProgresses1: Map<TrainingDefinition, TrainingProgress>, trainingProgresses2: Map<TrainingDefinition, TrainingProgress>) {
        return mergeMapsWithCustomMerger(
            trainingProgresses1,
            trainingProgresses2,
            item => ({
                progress: internKeysOfMapWithInnerUpdate(item.progress, value => ({
                    ...value,
                    term: intern(value.term)
                }))
            }),
            (mainProgress, secondProgress) => ({
                progress: mergeMaps(
                    mainProgress.progress,
                    secondProgress.progress,
                    item => ({...item, term: intern(item.term)}),
                    (mainItem) => ({...mainItem, term: intern(mainItem.term)}))
            }));
    }

    profile1 = cloneProfile(profile1);
    profile2 = cloneProfile(profile2);

    const resultProfile : LepeatProfile = {
        termDefinitions: mergeTermDefinitions(profile1.termDefinitions, profile2.termDefinitions),
        terms: mergeTerms(profile1.terms, profile2.terms),
        trainingDefinitions: mergeTrainingDefinitions(profile1.trainingDefinitions, profile2.trainingDefinitions),
        trainingProgresses: mergeTrainingProgresses(profile1.trainingProgresses, profile2.trainingProgresses),
    };

    return resultProfile;

    function mergeArrays<T extends MergeableEntity>(
        array1: T[], array2: T[],
        entityUpdater: (item: T) => T,
        entityMerger: (mainItem: T, secondItem: T) => T) {

        const mergedElements = new Map<string, T>();
        array1.forEach(item => mergedElements.set(validateId(item.id), entityUpdater(item)));

        array2.forEach(item => {
            const existingItem = mergedElements.get(validateId(item.id));
            if (existingItem) {
                mergedElements.set(item.id, resolveConflict(existingItem, item, entityMerger));
            } else {
                mergedElements.set(item.id, entityUpdater(item))
            }
        });

        mergedElements.forEach(intern);
        return Array.from(mergedElements.values());
    }

    function mergeMapsFirstPriority<TKey extends MergeableEntity, TValue>(
        map1: Map<TKey, TValue>,
        map2: Map<TKey, TValue>) {

        const mergedKeys = new Map<string, TKey>();
        const result = new Map<TKey, TValue>();

        function applyMapToResult(map: Map<TKey, TValue>) {
            map.forEach((value, key) => {
                validateId(key.id);
                if (mergedKeys.has(key.id)) {
                    return;
                }

                mergedKeys.set(key.id, intern(key));
                result.set(intern(key), value);
            });
        }

        applyMapToResult(map1);
        applyMapToResult(map2);

        return result;
    }

    function mergeMaps<TKey extends MergeableEntity, TValue extends MergeableEntity>(
        map1: Map<TKey, TValue>,
        map2: Map<TKey, TValue>,
        entityUpdater: (item: TValue) => TValue,
        entityMerger: (mainItem: TValue, secondItem: TValue) => TValue) {

        const mergedKeys = new Map<string, TKey>();
        const result = new Map<TKey, TValue>();

        function applyMapToResult(map: Map<TKey, TValue>) {
            map.forEach((value, key) => {
                validateId(key.id);
                validateId(value.id);

                if (!mergedKeys.has(key.id)) {
                    const newKey = intern(key);
                    mergedKeys.set(key.id, newKey);
                    result.set(newKey, entityUpdater(value));
                    return;
                }

                const existingKey = mergedKeys.get(key.id)!;
                const existingValue = result.get(existingKey)!;
                result.set(existingKey, resolveConflict(existingValue, value, entityMerger));
            });
        }

        applyMapToResult(map1);
        applyMapToResult(map2);

        result.forEach(intern);

        return result;
    }

    function mergeMapsWithCustomMerger<TKey extends MergeableEntity, TValue>(
        map1: Map<TKey, TValue>,
        map2: Map<TKey, TValue>,
        entityUpdater: (item: TValue) => TValue,
        entityMerger: (mainItem: TValue, secondItem: TValue) => TValue) {

        const mergedKeys = new Map<string, TKey>();
        const result = new Map<TKey, TValue>();

        function applyMapToResult(map: Map<TKey, TValue>) {
            map.forEach((value, key) => {
                validateId(key.id);

                if (!mergedKeys.has(key.id)) {
                    mergedKeys.set(key.id, intern(key));
                    result.set(intern(key), entityUpdater(value));
                    return;
                }

                const existingKey = mergedKeys.get(key.id)!;
                const existingValue = result.get(existingKey)!;
                result.set(existingKey, entityMerger(existingValue, value));
            });
        }

        applyMapToResult(map1);
        applyMapToResult(map2);

        return result;
    }

    function resolveConflict<T extends MergeableEntity>(existingElement: T, newCandidate: T, entityMerger: (mainItem: T, secondItem: T) => T){
        validateId(existingElement.id);
        validateId(newCandidate.id);

        if ((newCandidate.lastEditDate ?? 0) > (existingElement.lastEditDate ?? 0)) {
            return entityMerger(newCandidate, existingElement);
        }

        return entityMerger(existingElement, newCandidate);
    }

    function intern<T extends MergeableEntity>(element: T){
        validateId(element.id);
        const existingEntity = storage.get(element.id);
        if (existingEntity){
            return existingEntity as T;
        }

        storage.set(element.id, element);
        return element;
    }

    function internKeysOfMap<TKey extends MergeableEntity, TValue>(map: Map<TKey, TValue>): Map<TKey, TValue> {
        const internedMap = new Map<TKey, TValue>();
        map.forEach((value, key) => {
            internedMap.set(intern(key), value);
        });
        return internedMap;
    }

    function internKeysOfMapWithInnerUpdate<TKey extends MergeableEntity, TValue>(map: Map<TKey, TValue>, valueUpdater: (value: TValue) => TValue) {
        const internedMap = new Map<TKey, TValue>();
        map.forEach((value, key) => {
            internedMap.set(intern(key), valueUpdater(value));
        });
        return internedMap;
    }
}

function validateId(id: string){
    if (!id)
        throw new Error("Not all objects have valid ID. Can't merge the data");
    
    return id;
}