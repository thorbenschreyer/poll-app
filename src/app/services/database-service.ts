import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Survey } from '../interfaces/survey';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private supabase: SupabaseClient = createClient(environment.supabaseUrl, environment.supabaseKey);

  async createSurvey(survey: Survey): Promise<{ success: boolean; id?: string }> {
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

    if (error || !data) {
      console.error('Survey konnte nicht gespeichert werden:', error);

      return {
        success: false,
      };
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

      return {
        success: false,
      };
    }

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

    if (answersError || !savedAnswers) {
      console.error('Antworten konnten nicht gespeichert werden:', answersError);

      return {
        success: false,
      };
    }

    return {
      success: true,
      id: data.id,
    };
  }

  async getSurveys() {
    const { data, error } = await this.supabase
      .from('surveys')
      .select('*, questions(*,  answers(*))');

    if (error || !data) {
      console.error('Surveys konnten nicht geladen werden:', error);
      return;
    }

    const surveys: Survey[] = data.map((survey) => ({
      id: survey.id,
      name: survey.name,
      endDate: survey.end_date ? new Date(survey.end_date) : null,
      category: survey.category,
      description: survey.description,
      isActive: survey.is_active,
      isPublished: survey.is_published,

      questions: survey.questions.map((question: any) => ({
        question: question.question,
        allowMultipleAnswers: question.allow_multiple_answers,
        answers: question.answers.map((answer: any) => ({
          answer: answer.answer,
        })),
      })),
    }));
    return surveys;
  }
}
