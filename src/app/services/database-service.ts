import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Survey } from '../interfaces/survey';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private supabase: SupabaseClient = createClient(environment.supabaseUrl, environment.supabaseKey);

  async createSurvey(survey: Survey) {
    const { data, error } = await this.supabase
      .from('surveys')
      .insert({
        name: survey.name,
        end_date: survey.endDate,
        category: survey.category,
        description: survey.description,
        is_active: survey.isActive,
        is_published: survey.isPublished,
      })
      .select()
      .single();

    console.log('Survey data:', data);
    console.log('Survey error:', error);

    if (error || !data) {
      console.error('Survey konnte nicht gespeichert werden:', error);
      return;
    }

    const questionsForDatabase = survey.questions.map((question) => ({
      survey_id: data.id,
      question: question.question,
      allow_multiple_answers: question.allowMultipleAnswers,
    }));

    const { data: savedQuestions, error: questionError } = await this.supabase
      .from('questions')
      .insert(questionsForDatabase)
      .select();

    if (questionError || !savedQuestions) {
      console.error('Fragen konnten nicht gespeichert werden:', questionError);
      return;
    }

    const orignalQuestion = survey.questions[0];
    const savedQuestion = savedQuestions[0];

    const answersOfFirstQuestion = orignalQuestion.answers.map((answer) => ({
      question_id: savedQuestion.id,
      answer: answer.answer,
    }));


    const answersForDatabase = survey.questions.flatMap((question, index) =>
      question.answers.map((answer) => ({
        question_id: savedQuestions[index].id,
        answer: answer.answer,
      })),
    );

    const { data: savedAnswers, error: answersError } = await this.supabase 
    .from('answers')
    .insert(answersForDatabase)
    .select();

    console.log('Answers der Fragen:', savedAnswers, 'Error der answers: ', answersError);
  }

  async testConnection() {
    const { data, error } = await this.supabase.from('surveys').select('*');

    console.log('Supabase Daten:', data);
    console.log('Supabase Fehler:', error);
  }
}
