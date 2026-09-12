import { Answer } from "./answer";

export interface Question {
  allowMultipleAnswers: boolean
  question: string;
  answers: Answer[];
}
