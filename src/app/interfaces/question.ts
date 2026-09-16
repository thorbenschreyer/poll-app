import { Answer } from './answer';

export interface Question {
  id?: string;
  allowMultipleAnswers: boolean;
  question: string;
  answers: Answer[];
}
