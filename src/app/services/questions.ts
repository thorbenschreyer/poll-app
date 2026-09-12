import { Injectable, signal } from '@angular/core';
import { Survey } from '../interfaces/survey';

@Injectable()
export class Questions {
  addQuestion() {
    this.survey.questions.push({
      id: crypto.randomUUID(),
      allowMultipleAnswers: false,
      question: '',
      answers: [
        {
          id: crypto.randomUUID(),
          answer: '',
        },
        {
          id: crypto.randomUUID(),
          answer: '',
        },
      ],
    });
  }

  removeQuestion(index: number) {
    this.survey.questions.splice(index, 1);
  }

  getNumberofAnswers(index: number) {
    let result = this.survey.questions[index].answers.length;
    return result;
  }

  addAnswer(questionIndex: number) {
    this.survey.questions[questionIndex].answers.push({
      id: crypto.randomUUID(),
      answer: '',
    });
  }

  removeAnswer(answerIndex: number, questionIndex: number) {
    this.survey.questions[questionIndex].answers.splice(answerIndex, 1);
  }

  survey: Survey = {
    id: crypto.randomUUID(),
    category: '',
    surveyHeadline: '',
    endDate: new Date(),
    description: '',
    isActive: true,
    questions: [
      {
        id: crypto.randomUUID(),
        allowMultipleAnswers: false,
        question: '',
        answers: [
          {
            id: crypto.randomUUID(),
            answer: '',
          },
          {
            id: crypto.randomUUID(),
            answer: '',
          },
        ],
      },
    ],
  };
}
