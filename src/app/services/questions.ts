import { Injectable, signal } from '@angular/core';
import { Question } from '../interfaces/question';
import { Survey } from '../interfaces/survey';

@Injectable()
export class Questions {
  addQuestion() {
    this.survey.questions.push(
      {
        id: crypto.randomUUID(),
        allowMultipleAnswers: false,
        question: '',
        answers: ['', '',],
      }
    )
  }

  removeQuestion(id: string) {
    this.questions.update((questions) => questions.filter((questions) => questions.id !== id));
  }

  getNumberofAnswers(id: string) {
    let result = this.questions().find((question) => question.id === id);
    return result?.answers.length;
  }

  addAnswer(id: string) {
    this.questions.update((questions) =>
      questions.map((question) =>
        question.id == id ? { ...question, answers: [...question.answers, ''] } : question,
      ),
    );
  }

  removeAnswer(id: string, answerIndex: number) {
    this.questions.update((questions) =>
      questions.map((question) =>
        question.id == id
          ? {
              ...question,
              answers: question.answers.filter((_, index) => index !== answerIndex),
            }
          : question,
      ),
    );
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
        answers: ['TypeScript', 'JavaScript', 'Python', 'Java', 'C#', 'C++'],
      },
    ],
  };
}
