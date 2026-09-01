import { Injectable, signal } from '@angular/core';
import { Question } from '../interfaces/question';

@Injectable()
export class Questions {
  questions = signal<Question[]>([
    {
      id: crypto.randomUUID(),
      question: '',
      answers: ['1', '2', '3', '4', '5', '6'],
    },
    {
      id: "eins",
      question: '',
      answers: [''],
    },
  ]);

  addQuestion() {
    this.questions.update((questions) => [
      ...questions,
      {
        id: crypto.randomUUID(),
        question: '',
        answers: ['', ''],
      },
    ]);
  }

  removeQuestion(id: string) {
    this.questions.update((questions) => questions.filter((questions) => questions.id !== id));
  }

  getNumberofAnswers(id: string) {
    let result = this.questions().find( question => question.id === id); 
    return result?.answers.length
  }

  addAnswer(id: string) {
    this.questions.update(questions => questions.map(question => question.id == id
      ? {...question, answers: [...question.answers, '']}
      : question
    )
  )};

  removeAnswer(id:string, answerIndex:number) {
    this.questions.update(questions => 
      questions.map(question => question.id == id
        ? {
          ...question,
          answers: question.answers.filter((_, index) => index !== answerIndex)

        }
        : question

    ))
  }

  
}
