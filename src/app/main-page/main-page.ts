import { Component, signal } from '@angular/core';
import { Header } from './header/header';
import { SurveyOverview } from './survey-overview/survey-overview';
import { AllSurveys } from './all-surveys/all-surveys';
import { CreateSurvey } from './create-survey/create-survey';

@Component({
  selector: 'app-main-page',
  imports: [Header, SurveyOverview, AllSurveys, CreateSurvey],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss',
})
export class MainPage {
  createSurveyisActive = signal(false);

  openCreateSurvey() {
    this.createSurveyisActive.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeCreateSurvey() {
    this.createSurveyisActive.set(false);
    document.body.style.overflow = '';
  }
}
