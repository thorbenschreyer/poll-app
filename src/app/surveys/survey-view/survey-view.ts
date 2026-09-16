import { Component, inject, output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterService } from '../../services/filter-service';
import { CreateSurveyService } from '../../services/create-survey-service';
import { DatePipe } from '@angular/common';

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

  ngOnInit() {
    let currentSurvey = this.route.snapshot.paramMap.get('id');
    console.log(currentSurvey);
    if (currentSurvey) {
      this.filterService.setSurveyDetailByID(currentSurvey);
    }
  }

  selectAnswer(questionId: string | undefined, answerId: string | undefined, event: Event) {
    if (!questionId || !answerId) {
      return;
    }

    const checkbox = event.target as HTMLInputElement;

    console.log('Question:', questionId);
    console.log('Answer:', answerId);
    console.log('Checked:', checkbox.checked);
  }
}
