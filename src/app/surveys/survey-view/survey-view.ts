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
  noAnswers = false;
  databaseService = inject(DatabaseService);
  selectedAnswers = signal<Record<string, string[]>>({});
  answerVotes = signal<Record<string, number>>({});

  getSelectedAnswers(questionId: string): string[] {
    return this.selectedAnswers()[questionId] ?? [];
  }

  async ngOnInit() {

    const currentSurvey =
      this.route.snapshot.paramMap.get('id');

    if (currentSurvey) {

     
      this.filterService.setSurveyDetailByID(currentSurvey);


      
      const results =
        await this.databaseService
          .getSurveyResponseAnswers(currentSurvey);

      console.log('Survey Results:', results);


      
      const votes: Record<string, number> = {};

      results.forEach((response) => {

        response.response_answers.forEach((responseAnswer) => {

          const answerId = responseAnswer.answer_id;

          votes[answerId] =
            (votes[answerId] ?? 0) + 1;

        });

      });


      // Ergebnis in unser Signal schreiben
      this.answerVotes.set(votes);

      console.log('Stimmen:', this.answerVotes());
    }
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
}
