import { Question } from "./question"

export interface Survey {
    id: string,
    name:string,
    endDate: Date | null,
    category:string,
    description: string,
    isActive:boolean,
    isPublished: boolean,
    questions: Question[]
}
