import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { CreateSurveyService } from '../../services/create-survey-service';
import { DatabaseService } from '../../services/database-service';
import { FilterService } from '../../services/filter-service';

@Component({
  selector: 'app-survey-view',
  imports: [DatePipe, RouterLink],
  templateUrl: './survey-view.html',
  styleUrl: './survey-view.scss',
})
export class SurveyView {

  // ---------------------------------------------------------------------------
  // Dependencies
  // ---------------------------------------------------------------------------

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  filterService = inject(FilterService);
  createSurveyService = inject(CreateSurveyService);
  databaseService = inject(DatabaseService);

  // ---------------------------------------------------------------------------
  // Survey State
  // ---------------------------------------------------------------------------

  survey = this.filterService.SurveyDetail;
  surveyId: string | null = null;
  noAnswers = true;

  // ---------------------------------------------------------------------------
  // Answer Selection State
  // ---------------------------------------------------------------------------

  selectedAnswers = signal<Record<string, string[]>>({});
  submitAttempted = signal(false);

  // ---------------------------------------------------------------------------
  // Survey Result State
  // ---------------------------------------------------------------------------

  answerVotes = signal<Record<string, number>>({});
  questionResponses = signal<Record<string, number>>({});

  // ---------------------------------------------------------------------------
  // Realtime State
  // ---------------------------------------------------------------------------

  realtimeChannel: any;
  private realtimeTimer: ReturnType<typeof setTimeout> | null = null;

  // ---------------------------------------------------------------------------
  // Lifecycle Hooks
  // ---------------------------------------------------------------------------

  /**
   * Initializes the survey view.
   *
   * Reads the survey ID from the current route, loads the corresponding
   * survey details and results, and subscribes to realtime answer updates.
   */
  async ngOnInit() {
    this.surveyId = this.route.snapshot.paramMap.get('id');
    if (!this.surveyId) {return;}
    this.filterService.setSurveyDetailByID(this.surveyId);
    await this.loadSurveyResults();
    this.realtimeChannel = this.databaseService.subscribeToResponseAnswers(() => {
      this.reloadResultsDebounced();
    });
  }

  /**
   * Cleans up resources before the component is destroyed.
   *
   * Removes the active realtime subscription and clears the pending
   * debounce timer if one exists.
   */
  ngOnDestroy() {
    if (this.realtimeChannel) {
      this.databaseService.removeRealtimeChannel(this.realtimeChannel);
    }
    if (this.realtimeTimer) {
      clearTimeout(this.realtimeTimer);
    }
  }


  // ---------------------------------------------------------------------------
  // Answer Selection
  // ---------------------------------------------------------------------------

  /**
   * Returns all currently selected answer IDs for a specific question.
   *
   * @param questionId - The unique ID of the question.
   * @returns An array containing the selected answer IDs for the question.
   */
  getSelectedAnswers(questionId: string): string[] {
    return this.selectedAnswers()[questionId] ?? [];
  }

  /**
 * Checks whether every survey question has at least one selected answer.
 *
 * @returns True if every question has at least one selected answer.
 */
allQuestionsAnswered(): boolean {
  return this.survey().questions.every((question) => {
    if (!question.id) {
      return false;
    }

    return this.getSelectedAnswers(question.id).length > 0;
  });
}

  /**
   * Updates the selected answers for a question when a checkbox changes.
   *
   * For questions that allow multiple answers, the selected answer is added
   * to or removed from the existing selection. For single-answer questions,
   * the selected answer replaces the previous selection.
   *
   * @param questionId - The unique ID of the question.
   * @param answerId - The unique ID of the answer.
   * @param allowMultipleAnswers - Indicates whether multiple answers are allowed.
   * @param event - The change event emitted by the checkbox input.
   */
  selectAnswer(questionId: string | undefined, answerId: string | undefined, allowMultipleAnswers: boolean, event: Event,) {
    if (!questionId || !answerId) {return;}
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedAnswers.update((current) => {
        return {...current,
          [questionId]: allowMultipleAnswers
            ? [...(current[questionId] ?? []), answerId]
            : [answerId],};
      });
    } else {
      this.selectedAnswers.update((current) => {
        return {...current,
          [questionId]: (current[questionId] ?? []).filter((id) => id !== answerId),
        };});
    }
  }

  // ---------------------------------------------------------------------------
  // Survey Submission
  // ---------------------------------------------------------------------------

  /**
   * Submits the currently selected answers for the survey.
   *
   * Creates a new survey response, transforms the selected answers into
   * database records, stores them in the database, and navigates back to
   * the main page after a successful submission.
   */
  async submitSurvey() {
    this.submitAttempted.set(true);
      if (!this.allQuestionsAnswered()) {return;}
    const answersForDatabase = Object.entries(this.selectedAnswers()).flatMap(
      ([questionId, answerIds]) => {
        return answerIds.map((answerId) => ({
          question_id: questionId, answer_id: answerId}));
      },
    );
    const responseId = await this.databaseService.createSurveyResponse(this.survey().id);
    if (!responseId) {return;}
    const responseAnswers = answersForDatabase.map((answer) => ({
      ...answer, response_id: responseId,
    }));
    const success = await this.databaseService.createResponseAnswers(responseAnswers);
    if (success) {this.router.navigate(['/']);}
  }


  // ---------------------------------------------------------------------------
  // Survey Results
  // ---------------------------------------------------------------------------

  /**
   * Loads all submitted responses for the current survey.
   *
   * Calculates the total number of votes for each answer and determines
   * how many participants answered each individual question.
   */
  async loadSurveyResults() {
    if (!this.surveyId) {return;}
    const results = await this.databaseService.getSurveyResponseAnswers(this.surveyId);
    this.noAnswers = results.length === 0;
    const votes: Record<string, number> = {};
    results.forEach((response) => {
      response.response_answers.forEach((responseAnswer) => {
        const answerId = responseAnswer.answer_id;
        votes[answerId] = (votes[answerId] ?? 0) + 1;});
    });
    this.answerVotes.set(votes);
    const questionResponses: Record<string, number> = {};
    results.forEach((response) => {const answeredQuestions = new Set<string>();
      response.response_answers.forEach((responseAnswer) => {answeredQuestions.add(responseAnswer.question_id);});
      answeredQuestions.forEach((questionId) => { questionResponses[questionId] = (questionResponses[questionId] ?? 0) + 1;});
    });
    this.questionResponses.set(questionResponses);
  }

  /**
   * Returns the number of votes for a specific answer.
   *
   * @param answerId - The unique ID of the answer.
   * @returns The number of votes for the answer, or zero if no ID or votes exist.
   */
  getAnswerVotes(answerId: string | undefined): number {
    if (!answerId) {return 0;}
    return this.answerVotes()[answerId] ?? 0;
  }

  /**
   * Calculates the percentage of participants who selected a specific answer.
   *
   * The percentage is calculated relative to the number of participants
   * who answered the corresponding question.
   *
   * @param questionId - The unique ID of the question.
   * @param answerId - The unique ID of the answer.
   * @returns The rounded answer percentage between 0 and 100.
   */
  getAnswerPercentage(questionId: string | undefined, answerId: string | undefined): number {
    if (!questionId || !answerId) {return 0;}
    const votes = this.getAnswerVotes(answerId);
    const responses = this.questionResponses()[questionId] ?? 0;
    if (responses === 0) {
      return 0;}
    return Math.round((votes / responses) * 100);
  }


  // ---------------------------------------------------------------------------
  // Realtime Updates
  // ---------------------------------------------------------------------------

  /**
   * Delays reloading the survey results when realtime events are received.
   *
   * If another realtime event occurs before the existing timeout finishes,
   * the previous timeout is cleared and restarted. This prevents multiple
   * database reloads when several answer records are inserted in quick
   * succession.
   */
  reloadResultsDebounced() {
    if (this.realtimeTimer) {
      clearTimeout(this.realtimeTimer);
    }
    this.realtimeTimer = setTimeout(() => {
      this.loadSurveyResults();
    }, 300);
  }

}