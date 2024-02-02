import {mergeProfiles} from "./Merger";
import {germanProfile} from "../model/DefaultModel";
import {LepeatProfile} from "../model/LepeatProfile";
import {MergeableEntity} from "../model/MergeableEntity";
import {cloneProfile} from "./ProfileSerializer";
import {v4 as uuidv4} from 'uuid';
import {AttributeDefinition} from "../model/AttributeDefinition";
import {Term} from "../model/Term";
import {Status, TermTrainingProgress, TrainingProgress} from "../model/TrainingProgress";
import {TermTrainingRule, TrainingDefinition} from "../model/TrainingDefinition";
import {TermDefinition} from "../model/TermDefinition";

describe('Merger', () => {

    test('mergeWithSelf', () => {
        const profileAfterMerge = mergeProfiles(cloneProfile(germanProfile), cloneProfile(germanProfile));

        verifyAllIdsAreConsistent(profileAfterMerge);
        expect(profileAfterMerge).toEqual(germanProfile);
    });

    test.each([true, false])('wordAddedInOne', (addedInFirst) => {
        const profile1 = cloneProfile(germanProfile);
        const profile2 = cloneProfile(germanProfile);
        const profileToChange = addedInFirst ? profile1 : profile2;
        profileToChange.terms.push({
            id: uuidv4(),
            termDefinition: profileToChange.termDefinitions[0],
            lastEditDate: Date.now(),
            isBacklog: false,
            attributeValues: new Map<AttributeDefinition, string>()
        });

        const profileAfterMerge = mergeProfiles(profile1, profile2);

        verifyAllIdsAreConsistent(profileAfterMerge);
        expect(profileAfterMerge).toEqual(profileToChange);
    });

    test('wordAddedInBoth', () => {
        const profile1 = cloneProfile(germanProfile);
        const profile2 = cloneProfile(germanProfile);

        const term1: Term = {
            id: uuidv4(),
            termDefinition: profile1.termDefinitions[0],
            lastEditDate: Date.now(),
            isBacklog: false,
            attributeValues: new Map<AttributeDefinition, string>()
        };

        const term2: Term = {
            id: uuidv4(),
            termDefinition: profile2.termDefinitions[0],
            lastEditDate: Date.now(),
            isBacklog: false,
            attributeValues: new Map<AttributeDefinition, string>()
        };

        profile1.terms.push(term1);
        profile2.terms.push(term2);

        const profileAfterMerge = mergeProfiles(profile1, profile2);

        verifyAllIdsAreConsistent(profileAfterMerge);

        const actualLast2Terms = profileAfterMerge.terms.slice(-2).sort((a, b) => a.id.localeCompare(b.id));
        const expectedLast2Terms = [term1, term2].sort((a, b) => a.id.localeCompare(b.id));

        expect(actualLast2Terms).toEqual(expectedLast2Terms);
    });


    test.each([true, false])('wordAddedInOneAndModifiedInAnother', (editFirst) => {
        const profile1 = cloneProfile(germanProfile);
        const profile2 = cloneProfile(germanProfile);

        const [profileToEdit, profileToAdd] = editFirst ? [profile1, profile2] : [profile2, profile1];

        const termToAdd: Term = {
            id: uuidv4(),
            termDefinition: profileToAdd.termDefinitions[0],
            lastEditDate: Date.now(),
            isBacklog: false,
            attributeValues: new Map<AttributeDefinition, string>()
        };

        profileToAdd.terms.push(termToAdd);

        const attributeValues = profileToEdit.terms[0].attributeValues;
        attributeValues.set(Array.from(attributeValues.keys())[0], "bla");
        profileToEdit.terms[0].lastEditDate = Date.now() + 1;

        const profileAfterMerge = mergeProfiles(profile1, profile2);
        verifyAllIdsAreConsistent(profileAfterMerge);

        const expectedProfile = cloneProfile(profileToEdit);
        expectedProfile.terms.push(termToAdd); //it has invalid termDefinition reference, but it's ok for deep comparison
        expect(profileAfterMerge).toEqual(expectedProfile);
    });

    test.each([true, false])('wordModifiedInBothConflicting', (firstIsLater) => {
        const profile1 = cloneProfile(germanProfile);
        const profile2 = cloneProfile(germanProfile);
        const editDate = Date.now();

        const termFromProfile1 = profile1.terms[0];
        termFromProfile1.isBacklog = true;
        const newAttributeDefinition1: AttributeDefinition = {
            id: uuidv4(),
            name: "attribute1",
            lastEditDate: Date.now()
        };
        termFromProfile1.termDefinition.attributes.push(newAttributeDefinition1);
        termFromProfile1.attributeValues.set(newAttributeDefinition1, "newValue1");
        termFromProfile1.attributeValues.set(Array.from(termFromProfile1.attributeValues.keys())[0], 'editedValue1');
        termFromProfile1.lastEditDate = editDate + (firstIsLater ? 1 : 0);

        const termFromProfile2 = profile2.terms[0];
        termFromProfile2.isBacklog = false;
        const newAttributeDefinition2: AttributeDefinition = {
            id: uuidv4(),
            name: "attribute2",
            lastEditDate: Date.now()
        };
        termFromProfile2.termDefinition.attributes.push(newAttributeDefinition2);
        termFromProfile2.attributeValues.set(newAttributeDefinition2, "newValue2");
        termFromProfile2.attributeValues.set(Array.from(termFromProfile2.attributeValues.keys())[0], 'editedValue2');
        termFromProfile2.lastEditDate = editDate + (firstIsLater ? 0 : 1);

        const profileAfterMerge = mergeProfiles(profile1, profile2);
        verifyAllIdsAreConsistent(profileAfterMerge);

        const actualProfileComparable: any = profileAfterMerge;
        let expectedProfileComparable: any;
        if (firstIsLater) {
            expectedProfileComparable = cloneProfile(profile1);
            expectedProfileComparable.terms[0].termDefinition.attributes.push(newAttributeDefinition2);
            expectedProfileComparable.terms[0].attributeValues.set(newAttributeDefinition2, "newValue2");
        } else {
            expectedProfileComparable = cloneProfile(profile2);
            expectedProfileComparable.terms[0].termDefinition.attributes.push(newAttributeDefinition1);
            expectedProfileComparable.terms[0].attributeValues.set(newAttributeDefinition1, "newValue1");
        }

        makeProfileComparable(actualProfileComparable);
        makeProfileComparable(expectedProfileComparable);

        expect(expectedProfileComparable).toEqual(actualProfileComparable);

        function makeProfileComparable(profile: any) {
            profile.terms[0].termDefinition.attributes = profile.terms[0].termDefinition.attributes.sort((a: any, b: any) => a.id.localeCompare(b.id))
            profile.terms[0].attributeValues = Array.from(profile.terms[0].attributeValues.entries()).sort((a: any, b: any) => a[0].id.localeCompare(b[0].id))
        }
    });

    test.each([true, false])('attributeRenamedInBoth', (firstIsLater) => {
        const profile1 = cloneProfile(germanProfile);
        const profile2 = cloneProfile(germanProfile);
        const editDate = Date.now();

        profile1.termDefinitions[0].attributes[0].name = "new name 1";
        profile1.termDefinitions[0].attributes[0].lastEditDate = editDate + 1;

        profile2.termDefinitions[0].attributes[0].name = "new name 2";
        profile2.termDefinitions[0].attributes[0].lastEditDate = editDate;

        const expectedProfile = cloneProfile(profile1)

        const profileAfterMerge = firstIsLater ? mergeProfiles(profile1, profile2) : mergeProfiles(profile2, profile1);
        verifyAllIdsAreConsistent(profileAfterMerge);
        expect(profileAfterMerge).toEqual(expectedProfile);
    });

    test.each([true, false])("termDefinitionModifiedInBoth", (firstIsLater) => {
        const profile1 = cloneProfile(germanProfile);
        const profile2 = cloneProfile(germanProfile);
        const editDate = Date.now();

        profile1.termDefinitions[0].name = "new name 1";
        profile1.termDefinitions[0].lastEditDate = editDate + 1;

        profile2.termDefinitions[0].name = "new name 2";
        profile2.termDefinitions[0].lastEditDate = editDate;

        const expectedProfile = cloneProfile(profile1)
        const profileAfterMerge = firstIsLater ? mergeProfiles(profile1, profile2) : mergeProfiles(profile2, profile1);
        verifyAllIdsAreConsistent(profileAfterMerge);
        expect(profileAfterMerge).toEqual(expectedProfile);
    });

    test.each([true, false])("sameWordTrainedInBoth", (firstIsLater) => {
        const profile1 = cloneProfile(germanProfile);
        const profile2 = cloneProfile(germanProfile);
        const editDate = Date.now();

        function updateWordProgress(profile: LepeatProfile, date: number, iteration: number){
            const term = profile.terms[0];
            const train = profile.trainingDefinitions[0];
            const trainProgress : TrainingProgress = {progress: new Map<Term, TermTrainingProgress>([[
                term,
                    {
                        term: term,
                        status: Status.Relearning,
                        iterationNumber: iteration,
                        id: uuidv4(),
                        lastEditDate: date
                    }]])}

            profile.trainingProgresses.set(train, trainProgress);
        }

        updateWordProgress(profile1, editDate + 1, 5);
        updateWordProgress(profile2, editDate, 4);

        const expectedProfile = cloneProfile(profile1)
        const profileAfterMerge = firstIsLater ? mergeProfiles(profile1, profile2) : mergeProfiles(profile2, profile1);
        verifyAllIdsAreConsistent(profileAfterMerge);
        expect(profileAfterMerge).toEqual(expectedProfile);
    });

    test.each([true, false])("termModifiedInOneAndTrainedInAnother", (firstIsLater) => {
        const profile1 = cloneProfile(germanProfile);
        const profile2 = cloneProfile(germanProfile);
        const editDate = Date.now();

        profile1.terms[0].isBacklog = false;
        profile1.terms[0].lastEditDate = editDate + 1;
        profile1.trainingProgresses.set(profile1.trainingDefinitions[0], {progress: new Map<Term, TermTrainingProgress>()});

        profile2.terms[0].lastEditDate = editDate;

        const termProgress: TermTrainingProgress = {
            term: profile2.terms[0],
            status: Status.Relearning,
            iterationNumber: 5,
            id: uuidv4(),
            lastEditDate: editDate
        };

        profile2.trainingProgresses.set(profile2.trainingDefinitions[0], {
            progress: new Map<Term, TermTrainingProgress>([[profile2.terms[0], termProgress]])
        });

        const expectedProfile = cloneProfile(profile2);
        Object.assign(expectedProfile.terms[0], profile1.terms[0]);

        const profileAfterMerge = firstIsLater ? mergeProfiles(profile1, profile2) : mergeProfiles(profile2, profile1);

        verifyAllIdsAreConsistent(profileAfterMerge);
        expect(profileAfterMerge).toEqual(expectedProfile);
    });

    test.each([true, false])("twoDifferentTermsAreTrainedForExistingProgress", (firstIsLater) => {
        const originalProfile = cloneProfile(germanProfile);
        const editDate = Date.now();

        const termProgress1: TermTrainingProgress = {
            term: originalProfile.terms[0],
            status: Status.Relearning,
            iterationNumber: 5,
            id: uuidv4(),
            lastEditDate: editDate
        };

        originalProfile.trainingProgresses.set(originalProfile.trainingDefinitions[0], {
            progress: new Map<Term, TermTrainingProgress>([[originalProfile.terms[0], termProgress1]])
        });

        const profile1 = cloneProfile(originalProfile);
        const profile2 = cloneProfile(originalProfile);

        const termProgress2: TermTrainingProgress = {
            term: profile1.terms[1],
            status: Status.Relearning,
            iterationNumber: 4,
            id: uuidv4(),
            lastEditDate: editDate
        };

        const termProgress3: TermTrainingProgress = {
            term: profile2.terms[2],
            status: Status.Repetition,
            iterationNumber: 3,
            id: uuidv4(),
            lastEditDate: editDate
        };

        profile1.trainingProgresses.get(profile1.trainingDefinitions[0])!.progress.set(profile1.terms[1], termProgress2);
        profile2.trainingProgresses.get(profile2.trainingDefinitions[0])!.progress.set(profile2.terms[2], termProgress3);
        
        let expectedProfile = cloneProfile(profile1);
        expectedProfile.trainingProgresses.get(expectedProfile.trainingDefinitions[0])!.progress.set(expectedProfile.terms[2], termProgress3);
        expectedProfile = cloneProfile(expectedProfile);
        
        const profileAfterMerge = firstIsLater ? mergeProfiles(profile1, profile2) : mergeProfiles(profile2, profile1);

        verifyAllIdsAreConsistent(profileAfterMerge);
        expect(profileAfterMerge).toEqual(expectedProfile);
    });

    test.each([true, false])("twoDifferentTermsAreTrainedForNewProgress", (firstIsLater) => {
        const profile1 = cloneProfile(germanProfile);
        const profile2 = cloneProfile(germanProfile);
        const editDate = Date.now();

        const termProgress1: TermTrainingProgress = {
            term: profile1.terms[0],
            status: Status.Relearning,
            iterationNumber: 5,
            id: uuidv4(),
            lastEditDate: editDate
        };

        const termProgress2: TermTrainingProgress = {
            term: profile2.terms[1],
            status: Status.Relearning,
            iterationNumber: 4,
            id: uuidv4(),
            lastEditDate: editDate
        };

        profile1.trainingProgresses.set(profile1.trainingDefinitions[0], {
            progress: new Map<Term, TermTrainingProgress>([[profile1.terms[0], termProgress1]])
        });

        profile2.trainingProgresses.set(profile2.trainingDefinitions[0], {
            progress: new Map<Term, TermTrainingProgress>([[profile2.terms[1], termProgress2]])
        });

        let expectedProfile = cloneProfile(profile1);
        expectedProfile.trainingProgresses.get(expectedProfile.trainingDefinitions[0])!.progress.set(expectedProfile.terms[1], termProgress2);
        expectedProfile = cloneProfile(expectedProfile);
        
        const profileAfterMerge = firstIsLater ? mergeProfiles(profile1, profile2) : mergeProfiles(profile2, profile1);

        verifyAllIdsAreConsistent(profileAfterMerge);
        expect(profileAfterMerge).toEqual(expectedProfile);
    });

    test.each([
        [true, true],
        [true, false],
        [false, true],
        [false, false]
    ])
    ("sameTermIsTrainedInTwoDifferentTrainings", (firstIsLater, alreadyHasProgress) => {
        const originalProfile = cloneProfile(germanProfile);
        originalProfile.trainingProgresses = new Map<TrainingDefinition, TrainingProgress>();
        const editDate = Date.now();

        if (alreadyHasProgress){
            const newTrainingDefinition : TrainingDefinition = {
                id: uuidv4(),
                lastEditDate: editDate,
                configuration: new Map<TermDefinition, TermTrainingRule>(),
                name: "name",
                learningIntervals: [],
                repetitionIntervals: [],
            };

            const termProgress1: TermTrainingProgress = {
                term: originalProfile.terms[0],
                status: Status.Repetition,
                iterationNumber: 6,
                id: uuidv4(),
                lastEditDate: editDate
            };

            originalProfile.trainingProgresses.set(newTrainingDefinition, {
                progress: new Map<Term, TermTrainingProgress>([[originalProfile.terms[0], termProgress1]])
            })
        }

        const profile1 = cloneProfile(originalProfile);
        const profile2 = cloneProfile(originalProfile);

        const termProgress1: TermTrainingProgress = {
            term: profile1.terms[0],
            status: Status.Relearning,
            iterationNumber: 5,
            id: uuidv4(),
            lastEditDate: editDate
        };

        const termProgress2: TermTrainingProgress = {
            term: profile2.terms[0],
            status: Status.Learning,
            iterationNumber: 3,
            id: uuidv4(),
            lastEditDate: editDate
        };

        if (!alreadyHasProgress){
            profile1.trainingProgresses = new Map<TrainingDefinition, TrainingProgress>([[profile1.trainingDefinitions[0], {
                progress: new Map<Term, TermTrainingProgress>([[profile1.terms[0], termProgress1]])
            }]]);

            profile2.trainingProgresses = new Map<TrainingDefinition, TrainingProgress>([[profile2.trainingDefinitions[1], {
                progress: new Map<Term, TermTrainingProgress>([[profile1.terms[0], termProgress2]])
            }]]);
        }
        else {
            profile1.trainingProgresses.set(profile1.trainingDefinitions[0], {
                progress: new Map<Term, TermTrainingProgress>([[profile1.terms[0], termProgress1]])
            });

            profile2.trainingProgresses.set(profile2.trainingDefinitions[1], {
                progress: new Map<Term, TermTrainingProgress>([[profile2.terms[0], termProgress2]])
            });
        }

        let expectedProfile = cloneProfile(originalProfile);

        expectedProfile.trainingProgresses.set(expectedProfile.trainingDefinitions[0], {
            progress: new Map<Term, TermTrainingProgress>([[expectedProfile.terms[0], termProgress1]])
        });

        expectedProfile.trainingProgresses.set(expectedProfile.trainingDefinitions[1], {
            progress: new Map<Term, TermTrainingProgress>([[expectedProfile.terms[0], termProgress2]])
        });

        expectedProfile = cloneProfile(expectedProfile);

        const profileAfterMerge = firstIsLater ? mergeProfiles(profile1, profile2) : mergeProfiles(profile2, profile1);

        console.log("after merge: " + profileAfterMerge.trainingProgresses.get(profileAfterMerge.trainingDefinitions[1])!.progress.size)
        console.log("expected: " + expectedProfile.trainingProgresses.get(expectedProfile.trainingDefinitions[1])!.progress.size)

        verifyAllIdsAreConsistent(profileAfterMerge);
        expect(profileAfterMerge).toEqual(expectedProfile);
    });
});

function verifyAllIdsAreConsistent(profile: LepeatProfile){
    const existingIds = new Map<string, object>();

    function checkEntity(entity: MergeableEntity){
        if (existingIds.has(entity.id)) {
            expect(entity).toBe(existingIds.get(entity.id))
        }

        existingIds.set(entity.id, entity);
    }

    profile.termDefinitions.forEach((termDefinition) => {
        checkEntity(termDefinition)
        termDefinition.attributes.forEach(checkEntity);
    });

    profile.trainingDefinitions.forEach(trainingDefinition => {
        checkEntity(trainingDefinition)
        trainingDefinition.configuration.forEach((value, key) => {
            checkEntity(key)
            checkEntity(value)
        })
    });

    profile.terms.forEach(term => {
        checkEntity(term)
        checkEntity(term.termDefinition)
        term.attributeValues.forEach((value, key) => checkEntity(key))
    });

    profile.trainingProgresses.forEach((progress, trainingDefinition) => {
        checkEntity(trainingDefinition)
        progress.progress.forEach((termProgress, term) => {
            checkEntity(term);
            checkEntity(termProgress);
            checkEntity(termProgress.term);
        });
    });
}
