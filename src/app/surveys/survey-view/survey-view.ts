import { Component, inject, output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterService } from '../../services/filter-service';
import { CreateSurveyService } from '../../services/create-survey-service';

@Component({
  selector: 'app-survey-view',
  imports: [],
  templateUrl: './survey-view.html',
  styleUrl: './survey-view.scss',
})
export class SurveyView {
  private route = inject(ActivatedRoute);
  router = inject(Router);
  filterService = inject(FilterService)
  survey = this.filterService.SurveyDetail
  createSurveyService = inject(CreateSurveyService);
  noAnswers = true

  ngOnInit() {
    let currentSurvey = this.route.snapshot.paramMap.get('id');
    console.log(currentSurvey);
      if (currentSurvey) {
    this.filterService.setSurveyDetailByID(currentSurvey);
  }
  }
}
