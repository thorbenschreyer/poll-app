import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CreateSurvey } from './main-page/create-survey/create-survey';
import { CreateSurveyService } from './services/create-survey-service';
import { DatabaseService } from './services/database-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CreateSurvey],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  // ---------------------------------------------------------------------------
  // Application State
  // ---------------------------------------------------------------------------

  /**
   * Stores the title of the application.
   */
  protected readonly title = signal('poll_app');

  // ---------------------------------------------------------------------------
  // Dependencies
  // ---------------------------------------------------------------------------

  /**
   * Service used to communicate with the application database.
   */
  dataBase = inject(DatabaseService);

  /**
   * Service used to control the visibility of the create-survey overlay.
   */
  createSurveyService = inject(CreateSurveyService);

  // ---------------------------------------------------------------------------
  // Initialization
  // ---------------------------------------------------------------------------

  /**
   * Creates the root application component.
   *
   * Loads the available surveys from the database when the application
   * component is initialized.
   */
  constructor() {
    this.dataBase.getSurveys();
  }
}
