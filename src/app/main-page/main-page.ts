import { Component, inject, Inject, signal } from '@angular/core';
import { Header } from './header/header';
import { SurveyOverview } from './survey-overview/survey-overview';
import { AllSurveys } from './all-surveys/all-surveys';
import { CreateSurvey } from './create-survey/create-survey';
import { FilterService } from '../services/filter-service';
import { CreateSurveyService } from '../services/create-survey-service';

@Component({
  selector: 'app-main-page',
  imports: [Header, SurveyOverview, AllSurveys, CreateSurvey,],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss',
})
export class MainPage {
  filterservice = inject(FilterService)
  createSurveyService = inject(CreateSurveyService);

  ngOnInit():void {
    this.filterservice.startHourTimer()
  }

  ngOnDestroy():void {
    clearTimeout(this.filterservice.timeToFullHour)
    clearInterval(this.filterservice.hourIntervall)
  }

}
