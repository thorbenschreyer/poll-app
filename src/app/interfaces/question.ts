export interface Question {
  id: string;
  question: string;
  answers: string[];
  allowMultiple: boolean
  category: string;
  questionHeadline: string;
  endDate: Date;
  isActive: boolean;
  surveyEnds: number;
  isPublished: boolean;
}
