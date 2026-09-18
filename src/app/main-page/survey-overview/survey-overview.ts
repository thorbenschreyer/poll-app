import { Component, inject } from '@angular/core';
import { AllSurveys } from '../all-surveys/all-surveys';
import { FilterService } from '../../services/filter-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-survey-overview',
  imports: [RouterLink],
  templateUrl: './survey-overview.html',
  styleUrls: ['./survey-overview.scss', './survey-overview-media.scss']
})
export class SurveyOverview {
  
  filterservice = inject(FilterService)
  day =2 


}
