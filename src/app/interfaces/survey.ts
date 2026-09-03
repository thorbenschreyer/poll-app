import { Question } from "./question"

export interface Survey {
    id: string,
    surveyHeadline:string,
    endDate:Date,
    category:string,
    description: string,
    isActive:boolean,
    
    questions: Question[]
}
