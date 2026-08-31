import { Injectable, signal } from '@angular/core';
import { Question } from '../interfaces/question';

@Injectable()
export class Questions {

   questions = signal<Question[]>([
    {
      question: '',
      answers: ['', '']
    },
    {
      question: '',
      answers: ['', '', '']
    },
    {
      question: '',
      answers: ['', '', '']
    }
  ]);

  numberOfQuestions = this.questions().length;
  

  getNumberofQuestions (index:number) {
    return this.questions()[index].answers.length
  }

  constructor() {
    console.log("Questions: " + this.numberOfQuestions);
  } 

}
