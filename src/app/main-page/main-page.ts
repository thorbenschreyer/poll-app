import { Component } from '@angular/core';
import { Header } from "./header/header";
import { SurveyOverview } from "./survey-overview/survey-overview";

@Component({
  selector: 'app-main-page',
  imports: [Header, SurveyOverview],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss',
})
export class MainPage {}
