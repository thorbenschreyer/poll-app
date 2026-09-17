import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CreateSurveyService } from '../../services/create-survey-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  /**
   * Service used to control the visibility of the create-survey overlay.
   *
   * Provides access to the methods and state required to open or close
   * the survey creation interface.
   */
  createSurveyService = inject(CreateSurveyService);

}