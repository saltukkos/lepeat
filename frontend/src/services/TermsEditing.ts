import {Term} from "../model/Term";
import {markProfileDirty} from "./Persistence";
import {LepeatProfile} from "../model/LepeatProfile";

export function MoveToLearn(term: Term, profile: LepeatProfile){
    term.isBacklog = false;
    term.lastEditDate = Date.now();
    markProfileDirty(profile);
}

export function MoveToLearnWithoutMarkingProfileDirty(term: Term){
    term.isBacklog = false;
    term.lastEditDate = Date.now();
}