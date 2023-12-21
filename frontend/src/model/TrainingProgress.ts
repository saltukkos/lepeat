import {Term} from "./Term";

export interface TrainingProgress{
  progress: Map<Term, TermTrainingProgress>;
}

export interface TermTrainingProgress {
  term: Term;
  iterationNumber: number;
  lastTrainingDate: Date;
}