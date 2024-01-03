import {Term} from "./Term";

export interface TrainingProgress{
  progress: Map<Term, TermTrainingProgress>;
}

export interface TermTrainingProgress {
  term: Term;
  iterationNumber: number;
  lastTrainingDate?: number; // note: it can be undefined if the user hasn't trained this term yet
}