import { Component } from '@angular/core';
import { Header } from "./header/header";
import { SurveyOverview } from "./survey-overview/survey-overview";
import { AllSurveys } from './all-surveys/all-surveys';

@Component({
  selector: 'app-main-page',
  imports: [Header, SurveyOverview, AllSurveys],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss',
})
export class MainPage {}
