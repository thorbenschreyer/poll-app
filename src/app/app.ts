import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DatabaseService } from './services/database-service';
import { CreateSurvey } from './main-page/create-survey/create-survey';
import { CreateSurveyService } from './services/create-survey-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CreateSurvey],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('poll_app');
  dataBase = inject(DatabaseService);
  createSurveyService = inject(CreateSurveyService);
  constructor() {
    this.dataBase.getSurveys();
  }
}
