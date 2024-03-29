import {Term} from "./Term";
import {MergeableEntity} from "./MergeableEntity";

export interface TrainingProgress{
  progress: Map<Term, TermTrainingProgress>;
}

export enum Status {
  Learning,
  Repetition,
  Relearning,
}

export interface TermTrainingProgress extends MergeableEntity{
  term: Term;
  
  status: Status;

  // note: numbering is not end-to-end. 
  // For 'Learning' phase it contains 0-1-2 etc., then it contains 0-1-2-3 etc. for 'Repetition'.
  // For 'Relearning' step it contains the last iteration it has before in Repetition. 
  iterationNumber: number;
}