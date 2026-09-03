import { Injectable, signal } from '@angular/core';
import { Question } from '../interfaces/question';
import { Survey } from '../interfaces/survey';

@Injectable()
export class Questions {
  addQuestion() {}

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

  questions = signal<Question[]>([
    {
      id: crypto.randomUUID(),
      allowMultipleAnswers: false,
      question: 'What is your favorite programming language?',
      answers: ['TypeScript', 'JavaScript', 'Python', 'Java', 'C#', 'C++'],
    },
  ]);
}
