import { Component, inject, Inject, signal } from '@angular/core';
import { Header } from './header/header';
import { SurveyOverview } from './survey-overview/survey-overview';
import { AllSurveys } from './all-surveys/all-surveys';
import { CreateSurvey } from './create-survey/create-survey';
import { FilterService } from '../services/filter-service';

@Component({
  selector: 'app-main-page',
  imports: [Header, SurveyOverview, AllSurveys, CreateSurvey,],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss',
})
export class MainPage {
  createSurveyisActive = signal(false);
  filterservice = inject(FilterService)

  ngOnInit():void {
    this.filterservice.startHourTimer()
  }

  ngOnDestroy():void {
    clearTimeout(this.filterservice.timeToFullHour)
    clearInterval(this.filterservice.hourIntervall)
  }



  openCreateSurvey() {
    this.createSurveyisActive.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeCreateSurvey() {
    this.createSurveyisActive.set(false);
    document.body.style.overflow = '';
  }
}
