import { Component, inject } from '@angular/core';
import { AllSurveys } from '../all-surveys/all-surveys';
import { FilterService } from '../../services/filter-service';

@Component({
  selector: 'app-survey-overview',
  imports: [],
  templateUrl: './survey-overview.html',
  styleUrl: './survey-overview.scss',
})
export class SurveyOverview {
  
  filterservice = inject(FilterService)
  day =2 


}
