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
    id: '550e8400-e29b-41d4-a716-446655440001',
    category: 'Team Activities',
    surveyHeadline: 'Wie zufrieden bist du mit unseren Teamevents?',
    endDate: new Date('2026-09-05'),
    description: 'Wir möchten wissen, wie zufrieden du mit unseren bisherigen Teamevents bist.',
    isActive: true,
    questions: [
      {
        id: crypto.randomUUID(),
        allowMultipleAnswers: false,
        question: 'What is your favorite programming language?',
        answers: [
          {
            id: crypto.randomUUID(),
            answer: 'Java',
          },
          {
            id: crypto.randomUUID(),
            answer: 'Lala',
          },
        ],
      },
    ],
  };
}
