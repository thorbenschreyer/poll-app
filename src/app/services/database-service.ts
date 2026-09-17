import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { environment } from '../../environments/environment';
import { Survey } from '../interfaces/survey';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {

  // ---------------------------------------------------------------------------
  // Supabase Client
  // ---------------------------------------------------------------------------

  /**
   * Supabase client used for all database and realtime operations.
   *
   * The client is initialized with the Supabase URL and API key
   * provided by the application environment configuration.
   */
  private supabase: SupabaseClient = createClient(
    environment.supabaseUrl,
    environment.supabaseKey
  );


  // ---------------------------------------------------------------------------
  // Survey Management
  // ---------------------------------------------------------------------------

/**
 * Creates a new survey and stores its questions and answers in the database.
 *
 * @param survey - The survey that should be stored in the database.
 * @returns An object indicating whether the operation was successful.
 * If successful, the generated survey ID is also returned.
 */
async createSurvey(survey: Survey): Promise<{ success: boolean; id?: string }> {
  const savedSurvey = await this.saveSurvey(survey);
  if (!savedSurvey) {return { success: false };}
  const savedQuestions = await this.saveQuestions(survey, savedSurvey.id);
  if (!savedQuestions) {return { success: false };}
  const answersSaved = await this.saveAnswers(survey, savedQuestions);
  if (!answersSaved) {return { success: false };}
  return { success: true, id: savedSurvey.id };
}

/**
 * Stores the general survey information in the database.
 *
 * @param survey - The survey that should be stored.
 * @returns The saved survey record, or null if the operation fails.
 */
private async saveSurvey(survey: Survey) {
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
    .select().single();
  if (error || !data) {
    console.error('Survey konnte nicht gespeichert werden:', error);
    return null;}
  return data;
}

/**
 * Stores all questions belonging to a survey.
 *
 * @param survey - The survey containing the questions.
 * @param surveyId - The ID of the previously saved survey.
 * @returns The saved question records, or null if the operation fails.
 */
private async saveQuestions(survey: Survey, surveyId: string) {
  const questionsForDatabase = survey.questions.map((question) => ({
    survey_id: surveyId,
    question: question.question,
    allow_multiple_answers: question.allowMultipleAnswers,
  }));
  const { data, error } = await this.supabase
    .from('questions').insert(questionsForDatabase).select();
  if (error || !data) {
    console.error('Fragen konnten nicht gespeichert werden:', error);
    return null;
  }
  return data;
}

/**
 * Stores all answers belonging to the previously saved questions.
 *
 * @param survey - The survey containing the answers.
 * @param savedQuestions - The previously saved question records.
 * @returns True if the answers were stored successfully; otherwise false.
 */
private async saveAnswers(survey: Survey, savedQuestions: any[]) {
  const answersForDatabase = survey.questions.flatMap((question, index) =>
    question.answers.map((answer) => ({
      question_id: savedQuestions[index].id,
      answer: answer.answer,
    })),
  );
  const { data, error } = await this.supabase
    .from('answers').insert(answersForDatabase).select();
  if (error || !data) {
    console.error('Antworten konnten nicht gespeichert werden:', error);
    return false;
  }
  return true;
}

  /**
   * Loads all surveys including their related questions and answers.
   *
   * The database response is mapped to the application's Survey interface.
   * Database field names are converted to the corresponding application
   * property names and survey end dates are converted to Date objects.
   *
   * @returns The mapped list of surveys, or undefined if loading fails.
   */
  async getSurveys() {
    const { data, error } = await this.supabase
      .from('surveys').select('*, questions(*,  answers(*))');
    if (error || !data) {
      console.error('Surveys konnten nicht geladen werden:', error);
      return;}

    const surveys: Survey[] = data.map((survey) => ({
      id: survey.id,
      name: survey.name,
      endDate: survey.end_date ? new Date(survey.end_date) : null,
      category: survey.category,
      description: survey.description,
      isActive: survey.is_active,
      isPublished: survey.is_published,

      questions: survey.questions.map((question: any) => ({
        id: question.id,
        question: question.question,
        allowMultipleAnswers: question.allow_multiple_answers,

        answers: question.answers.map((answer: any) => ({
          id: answer.id,
          answer: answer.answer,
        })),
      })),
    }));
    return surveys;
  }


  // ---------------------------------------------------------------------------
  // Survey Responses
  // ---------------------------------------------------------------------------

  /**
   * Creates a new response entry for a specific survey.
   *
   * The generated response ID is later used to associate the selected
   * answers with this individual survey participation.
   *
   * @param surveyId - The unique ID of the survey being answered.
   * @returns The generated survey response ID, or null if the operation fails.
   */
  async createSurveyResponse(surveyId: string): Promise<string | null> {
    const { data, error } = await this.supabase
      .from('survey_responses').insert({survey_id: surveyId,}).select('id').single();
    if (error || !data) {
      console.error('Survey Response konnte nicht gespeichert werden:', error);
      return null;
    }
    return data.id;
  }

  /**
   * Stores the selected answers for a previously created survey response.
   *
   * Each entry connects a survey response with a question and the
   * corresponding selected answer.
   *
   * @param responseAnswers - The answer records that should be stored.
   * @returns True if all answer records were stored successfully;
   * otherwise false.
   */
  async createResponseAnswers(
    responseAnswers: {
      response_id: string;
      question_id: string;
      answer_id: string;
    }[],
  ): Promise<boolean> {
    const { error } = await this.supabase
      .from('response_answers').insert(responseAnswers);
    if (error) {
      console.error('Response Answers konnten nicht gespeichert werden:', error);
      return false;
    }
    return true;
  }


  // ---------------------------------------------------------------------------
  // Survey Results
  // ---------------------------------------------------------------------------

  /**
   * Loads all submitted answers for a specific survey.
   *
   * Each survey response includes the question IDs and answer IDs
   * associated with that participation.
   *
   * @param surveyId - The unique ID of the survey whose results should be loaded.
   * @returns The survey responses and their associated answers,
   * or an empty array if loading fails.
   */
  async getSurveyResponseAnswers(surveyId: string) {
    const { data, error } = await this.supabase
      .from('survey_responses').select(`
      id,
      response_answers (
        question_id,
        answer_id
      )`,).eq('survey_id', surveyId);
    if (error) {
      console.error('Survey Ergebnisse konnten nicht geladen werden:', error);
      return [];
    }
    return data;
  }


  // ---------------------------------------------------------------------------
  // Realtime
  // ---------------------------------------------------------------------------

  /**
   * Subscribes to newly inserted response answers using Supabase Realtime.
   *
   * Whenever a new record is inserted into the response_answers table,
   * the provided callback function is executed.
   *
   * A unique channel name is generated for every subscription to prevent
   * conflicts between multiple realtime subscriptions.
   *
   * @param onNewAnswer - Callback executed whenever a new answer is inserted.
   * @returns The created Supabase realtime channel.
   */
  subscribeToResponseAnswers(onNewAnswer: () => void) {
    const channel = this.supabase
      .channel(`response-answers-changes-${crypto.randomUUID()}`)
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'response_answers',
        }, (payload) => {
          onNewAnswer();
        },
      ).subscribe()
    return channel;
  }

  /**
   * Removes an existing Supabase realtime channel.
   *
   * This is used when a component no longer requires realtime updates,
   * preventing unused subscriptions from remaining active.
   *
   * @param channel - The Supabase realtime channel that should be removed.
   * @returns The result of the Supabase channel removal operation.
   */
  removeRealtimeChannel(channel: any) {
    return this.supabase.removeChannel(channel);
  }

}