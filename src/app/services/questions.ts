import { Injectable, signal } from '@angular/core';
import { Question } from '../interfaces/question';

@Injectable()
export class Questions {
  questions = signal<Question[]>([
    {
      id: crypto.randomUUID(),
      question: '',
      answers: ['', '', '', '', '', ''],
    },
    {
      id: crypto.randomUUID(),
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

  numberOfQuestions = this.questions().length;

  getNumberofAnswers(id: string) {
    let result = this.questions().find( question => question.id === id);
    return result?.answers.length
  }

  constructor() {
    console.log('Questions: ' + this.numberOfQuestions);
  }
}
