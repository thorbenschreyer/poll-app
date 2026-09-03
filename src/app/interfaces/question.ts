export interface Question {
  id: string;
  allowMultipleAnswers: boolean
  question: string;
  answers: string[];
}
