import { Component, inject, output, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterService } from '../../services/filter-service';
import { CreateSurveyService } from '../../services/create-survey-service';
import { DatePipe } from '@angular/common';
import { DatabaseService } from '../../services/database-service';

@Component({
  selector: 'app-survey-view',
  imports: [DatePipe],
  templateUrl: './survey-view.html',
  styleUrl: './survey-view.scss',
})
export class SurveyView {
  private route = inject(ActivatedRoute);
  router = inject(Router);
  filterService = inject(FilterService);
  survey = this.filterService.SurveyDetail;
  createSurveyService = inject(CreateSurveyService);
  noAnswers = true;
  databaseService = inject(DatabaseService);
  selectedAnswers = signal<Record<string, string[]>>({});
  answerVotes = signal<Record<string, number>>({});
  questionResponses = signal<Record<string, number>>({});
  surveyId: string | null = null;
  realtimeChannel: any;
  private realtimeTimer: ReturnType<typeof setTimeout> | null = null;


  getSelectedAnswers(questionId: string): string[] {
    return this.selectedAnswers()[questionId] ?? [];
  }

  async ngOnInit() {
    this.surveyId = this.route.snapshot.paramMap.get('id');

    if (!this.surveyId) {
      return;
    }

    this.filterService.setSurveyDetailByID(this.surveyId);

    await this.loadSurveyResults();

this.realtimeChannel =
  this.databaseService
    .subscribeToResponseAnswers(() => {

      this.reloadResultsDebounced();

    });
  }

ngOnDestroy() {

  if (this.realtimeChannel) {
    this.databaseService
      .removeRealtimeChannel(this.realtimeChannel);
  }

  if (this.realtimeTimer) {
    clearTimeout(this.realtimeTimer);
  }

}

  reloadResultsDebounced() {

  if (this.realtimeTimer) {
    clearTimeout(this.realtimeTimer);
  }

  this.realtimeTimer = setTimeout(() => {

    this.loadSurveyResults();

  }, 300);
}

  async loadSurveyResults() {
    if (!this.surveyId) {
      return;
    }

    const results = await this.databaseService.getSurveyResponseAnswers(this.surveyId);

    this.noAnswers = results.length === 0;

    // Stimmen pro Antwort zählen
    const votes: Record<string, number> = {};

    results.forEach((response) => {
      response.response_answers.forEach((responseAnswer) => {
        const answerId = responseAnswer.answer_id;

        votes[answerId] = (votes[answerId] ?? 0) + 1;
      });
    });

    this.answerVotes.set(votes);

    // Teilnehmer pro Frage zählen
    const questionResponses: Record<string, number> = {};

    results.forEach((response) => {
      const answeredQuestions = new Set<string>();

      response.response_answers.forEach((responseAnswer) => {
        answeredQuestions.add(responseAnswer.question_id);
      });

      answeredQuestions.forEach((questionId) => {
        questionResponses[questionId] = (questionResponses[questionId] ?? 0) + 1;
      });
    });

    this.questionResponses.set(questionResponses);
  }

  getAnswerVotes(answerId: string | undefined): number {
    if (!answerId) {
      return 0;
    }

    return this.answerVotes()[answerId] ?? 0;
  }

  selectAnswer(
    questionId: string | undefined,
    answerId: string | undefined,
    allowMultipleAnswers: boolean,
    event: Event,
  ) {
    if (!questionId || !answerId) {
      return;
    }

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

          [questionId]: (current[questionId] ?? []).filter((id) => id !== answerId),
        };
      });
    }

    console.log(this.selectedAnswers());
  }

  async submitSurvey() {
    const answersForDatabase = Object.entries(this.selectedAnswers()).flatMap(
      ([questionId, answerIds]) => {
        return answerIds.map((answerId) => ({
          question_id: questionId,
          answer_id: answerId,
        }));
      },
    );

    const responseId = await this.databaseService.createSurveyResponse(this.survey().id);

    if (!responseId) {
      return;
    }

    const responseAnswers = answersForDatabase.map((answer) => ({
      ...answer,
      response_id: responseId,
    }));

    const success = await this.databaseService.createResponseAnswers(responseAnswers);

    console.log('Antworten gespeichert:', success);
  }

  getAnswerPercentage(questionId: string | undefined, answerId: string | undefined): number {
    if (!questionId || !answerId) {
      return 0;
    }

    const votes = this.getAnswerVotes(answerId);

    const responses = this.questionResponses()[questionId] ?? 0;

    if (responses === 0) {
      return 0;
    }

    return Math.round((votes / responses) * 100);
  }
}
