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
  styleUrls: ['./survey-view.scss', './survey-view-media.scss']
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
  noAnswers = signal(true);

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
  isClosed = signal(true)

  // ---------------------------------------------------------------------------
  // Realtime State
  // ---------------------------------------------------------------------------

  realtimeChannel: any;
  private realtimeTimer: ReturnType<typeof setTimeout> | null = null;

  // ---------------------------------------------------------------------------
  // Lifecycle Hooks
  // ---------------------------------------------------------------------------

/**
 * Initializes the survey view and reacts to route changes.
 *
 * Reloads the survey whenever the survey ID in the URL changes.
 */
ngOnInit() {
  this.route.paramMap.subscribe(async (params) => {
    const surveyId = params.get('id');
    if (!surveyId) {return;}
    this.surveyId = surveyId;
    await this.filterService.loadSurveys();
    this.filterService.setSurveyDetailByID(this.surveyId);
    await this.loadSurveyResults();});
  this.realtimeChannel =
    this.databaseService.subscribeToResponseAnswers(() => {
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
 * Toggles the visibility of the survey results on mobile devices.
 */
toggleResults() {
  this.isClosed.update((closed) => !closed);
}

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
  this.submitAttempted.set(false);
  const checkbox = event.target as HTMLInputElement;
  if (checkbox.checked) {
    this.selectedAnswers.update((current) => {
      return {
        ...current,
        [questionId]: allowMultipleAnswers
          ? [...(current[questionId] ?? []), answerId]
          : [answerId],
      };
    });
  } else {
    this.selectedAnswers.update((current) => {
      return {
        ...current,
        [questionId]: (current[questionId] ?? []).filter(
          (id) => id !== answerId
        ),};
    });}
}

  // ---------------------------------------------------------------------------
  // Survey Submission
  // ---------------------------------------------------------------------------

/**
 * Submits the survey if all questions have been answered.
 * Shows the validation message only when answers are missing.
 */
async submitSurvey() {
  if (!this.allQuestionsAnswered()) {
    this.submitAttempted.set(true);
    return;}
  this.submitAttempted.set(false);
  const answersForDatabase = Object.entries(
    this.selectedAnswers()
  ).flatMap(([questionId, answerIds]) => {
    return answerIds.map((answerId) => ({
      question_id: questionId, answer_id: answerId,}));
  });
  const responseId = await this.databaseService.createSurveyResponse(this.survey().id);
  if (!responseId) {return;}
  const responseAnswers = answersForDatabase.map((answer) => ({
    ...answer,
    response_id: responseId,
  }));
  const success = await this.databaseService.createResponseAnswers(responseAnswers);
  if (success) {this.router.navigate(['/']);}
}


  // ---------------------------------------------------------------------------
  // Survey Results
  // ---------------------------------------------------------------------------

  /**
 * Checks whether results should currently be displayed.
 * Results are available when database responses exist
 * or the user has made a local selection.
 *
 * @returns True if database or local results exist.
 */
hasPreviewResults(): boolean {
  const hasDatabaseResults = !this.noAnswers();

  const hasLocalSelection = Object.values(
    this.selectedAnswers()
  ).some((answers) => answers.length > 0);

  return hasDatabaseResults || hasLocalSelection;
}

  /**
   * Loads all submitted responses for the current survey.
   *
   * Calculates the total number of votes for each answer and determines
   * how many participants answered each individual question.
   */
  async loadSurveyResults() {
    if (!this.surveyId) {return;}
    const results = await this.databaseService.getSurveyResponseAnswers(this.surveyId);
    this.noAnswers.set(results.length === 0);
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
 * Calculates the displayed percentage for an answer.
 * Includes the current local selection as a preview
 * without saving it to the database.
 *
 * @param questionId - ID of the question.
 * @param answerId - ID of the answer.
 * @returns Percentage including the local preview.
 */
getAnswerPercentage(
  questionId: string | undefined,
  answerId: string | undefined
): number {
  if (!questionId || !answerId) {return 0;}
  const votes = this.getPreviewAnswerVotes(questionId, answerId);
  const databaseResponses =
    this.questionResponses()[questionId] ?? 0;
  const hasLocalSelection =
    this.getSelectedAnswers(questionId).length > 0;
  const responses =
    databaseResponses + (hasLocalSelection ? 1 : 0);
  if (responses === 0) {return 0;}
  return Math.round((votes / responses) * 100);
}

  /**
 * Returns the displayed vote count for an answer.
 * Includes the current local selection without saving it
 * to the database.
 *
 * @param questionId - ID of the question.
 * @param answerId - ID of the answer.
 * @returns Number of persisted votes plus the local selection.
 */
getPreviewAnswerVotes(
  questionId: string | undefined,
  answerId: string | undefined
): number {
  if (!questionId || !answerId) {return 0;}
  const databaseVotes = this.getAnswerVotes(answerId);
  const isLocallySelected =
    this.getSelectedAnswers(questionId).includes(answerId);
  return databaseVotes + (isLocallySelected ? 1 : 0);
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