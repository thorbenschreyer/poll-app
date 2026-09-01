import { Injectable, signal } from '@angular/core';
import { Question } from '../interfaces/question';

@Injectable()
export class Questions {
  addQuestion() {
    this.questions.update((questions) => [
      ...questions,
      {
        id: crypto.randomUUID(),
        question: '',
        answers: ['', ''],
        allowMultiple: false,
        category: '',
        questionHeadline: '',
        endDate: new Date(),
        isActive: false,
        surveyEnds: 0,
        isPublished: false,
      },
    ]);
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

  questions = signal<Question[]>([
    {
      id: crypto.randomUUID(),
      question: 'What is your favorite programming language?',
      answers: ['TypeScript', 'JavaScript', 'Python', 'Java', 'C#', 'C++'],
      allowMultiple: false,
      category: 'Technology & Innovation',
      questionHeadline: 'Programming',
      endDate: new Date('2026-09-30'),
      isActive: true,
      surveyEnds: 0,
      isPublished: true,
    },
    {
      id: crypto.randomUUID(),
      question: 'Which devices do you use every day?',
      answers: ['Smartphone', 'Laptop', 'Tablet', 'Smartwatch'],
      allowMultiple: true,
      category: 'Technology & Innovation',
      questionHeadline: 'Daily Devices',
      endDate: new Date('2026-10-15'),
      isActive: true,
      surveyEnds: 0,
      isPublished: true,
    },
    {
      id: crypto.randomUUID(),
      question: 'How satisfied are you with your current smartphone?',
      answers: ['Very satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very dissatisfied'],
      allowMultiple: false,
      category: 'Technology & Innovation',
      questionHeadline: 'Smartphone Satisfaction',
      endDate: new Date('2026-09-20'),
      isActive: true,
      surveyEnds: 0,
      isPublished: true,
    },
    {
      id: crypto.randomUUID(),
      question: 'What is your favorite type of music?',
      answers: ['Rock', 'Pop', 'Hip-Hop', 'Electronic', 'Classical', 'Jazz'],
      allowMultiple: false,
      category: 'Lifestyle & Preferences',
      questionHeadline: 'Music Preferences',
      endDate: new Date('2026-10-01'),
      isActive: true,
      surveyEnds: 0,
      isPublished: true,
    },
    {
      id: crypto.randomUUID(),
      question: 'Which activities do you enjoy in your free time?',
      answers: ['Gaming', 'Sports', 'Reading', 'Traveling', 'Cooking'],
      allowMultiple: true,
      category: 'Lifestyle & Preferences',
      questionHeadline: 'Free Time',
      endDate: new Date('2026-10-10'),
      isActive: true,
      surveyEnds: 0,
      isPublished: true,
    },
    {
      id: crypto.randomUUID(),
      question: 'How often do you exercise?',
      answers: ['Every day', 'Several times a week', 'Once a week', 'Rarely', 'Never'],
      allowMultiple: false,
      category: 'Health & Wellness',
      questionHeadline: 'Exercise',
      endDate: new Date('2026-09-25'),
      isActive: true,
      surveyEnds: 0,
      isPublished: true,
    },
    {
      id: crypto.randomUUID(),
      question: 'Which types of exercise do you enjoy?',
      answers: ['Running', 'Cycling', 'Swimming', 'Gym', 'Team sports', 'Yoga'],
      allowMultiple: true,
      category: 'Health & Wellness',
      questionHeadline: 'Favorite Sports',
      endDate: new Date('2026-10-20'),
      isActive: true,
      surveyEnds: 0,
      isPublished: true,
    },
    {
      id: crypto.randomUUID(),
      question: 'How would you rate your work-life balance?',
      answers: ['Excellent', 'Good', 'Average', 'Poor'],
      allowMultiple: false,
      category: 'Health & Wellness',
      questionHeadline: 'Work-Life Balance',
      endDate: new Date('2026-09-18'),
      isActive: true,
      surveyEnds: 0,
      isPublished: true,
    },
    {
      id: crypto.randomUUID(),
      question: 'Which game genres do you prefer?',
      answers: ['Action', 'RPG', 'Strategy', 'Simulation', 'Sports', 'Racing'],
      allowMultiple: true,
      category: 'Gaming & Entertainment',
      questionHeadline: 'Gaming Preferences',
      endDate: new Date('2026-11-01'),
      isActive: true,
      surveyEnds: 0,
      isPublished: true,
    },
    {
      id: crypto.randomUUID(),
      question: 'What is your favorite gaming platform?',
      answers: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch'],
      allowMultiple: false,
      category: 'Gaming & Entertainment',
      questionHeadline: 'Gaming Platform',
      endDate: new Date('2026-10-05'),
      isActive: true,
      surveyEnds: 0,
      isPublished: true,
    },
    {
      id: crypto.randomUUID(),
      question: 'How many hours do you play games per week?',
      answers: [
        'Less than 2 hours',
        '2–5 hours',
        '5–10 hours',
        '10–20 hours',
        'More than 20 hours',
      ],
      allowMultiple: false,
      category: 'Gaming & Entertainment',
      questionHeadline: 'Gaming Time',
      endDate: new Date('2026-10-12'),
      isActive: true,
      surveyEnds: 0,
      isPublished: true,
    },
    {
      id: crypto.randomUUID(),
      question: 'Which learning methods work best for you?',
      answers: ['Videos', 'Books', 'Online courses', 'Practical exercises', 'Group discussions'],
      allowMultiple: true,
      category: 'Education & Learning',
      questionHeadline: 'Learning Methods',
      endDate: new Date('2026-10-30'),
      isActive: true,
      surveyEnds: 0,
      isPublished: true,
    },
    {
      id: crypto.randomUUID(),
      question: 'How often do you learn something new?',
      answers: [
        'Every day',
        'Several times a week',
        'Once a week',
        'A few times a month',
        'Rarely',
      ],
      allowMultiple: false,
      category: 'Education & Learning',
      questionHeadline: 'Learning Frequency',
      endDate: new Date('2026-09-28'),
      isActive: true,
      surveyEnds: 0,
      isPublished: true,
    },
    {
      id: crypto.randomUUID(),
      question: 'Which programming concepts do you find most challenging?',
      answers: [
        'Arrays',
        'Objects',
        'Functions',
        'Async programming',
        'Classes',
        'State management',
      ],
      allowMultiple: true,
      category: 'Education & Learning',
      questionHeadline: 'Programming Challenges',
      endDate: new Date('2026-11-15'),
      isActive: true,
      surveyEnds: 0,
      isPublished: true,
    },
    {
      id: crypto.randomUUID(),
      question: 'Which type of vacation do you prefer?',
      answers: ['Beach vacation', 'City trip', 'Adventure', 'Camping'],
      allowMultiple: false,
      category: 'Lifestyle & Preferences',
      questionHeadline: 'Vacation Preferences',
      endDate: new Date('2026-12-01'),
      isActive: true,
      surveyEnds: 0,
      isPublished: true,
    },
    {
      id: crypto.randomUUID(),
      question: 'What is most important when choosing a restaurant?',
      answers: ['Price', 'Food quality', 'Location', 'Atmosphere', 'Service', 'Reviews'],
      allowMultiple: true,
      category: 'Lifestyle & Preferences',
      questionHeadline: 'Restaurant Preferences',
      endDate: new Date('2026-10-25'),
      isActive: true,
      surveyEnds: 0,
      isPublished: true,
    },
    {
      id: crypto.randomUUID(),
      question: 'Which type of content do you consume most?',
      answers: ['YouTube', 'Netflix', 'TikTok', 'Instagram', 'Podcasts'],
      allowMultiple: true,
      category: 'Gaming & Entertainment',
      questionHeadline: 'Media Consumption',
      endDate: new Date('2026-09-22'),
      isActive: true,
      surveyEnds: 0,
      isPublished: true,
    },
    {
      id: crypto.randomUUID(),
      question: 'How would you rate your overall experience with our platform?',
      answers: ['Excellent', 'Good', 'Average', 'Poor', 'Very poor', 'I have no opinion'],
      allowMultiple: false,
      category: 'All Surveys',
      questionHeadline: 'Platform Experience',
      endDate: new Date('2026-12-31'),
      isActive: false,
      surveyEnds: 0,
      isPublished: false,
    },
  ]);
}
