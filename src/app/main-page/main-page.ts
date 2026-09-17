import {
  Component,
  inject,
} from '@angular/core';

import { Header } from './header/header';
import { SurveyOverview } from './survey-overview/survey-overview';
import { AllSurveys } from './all-surveys/all-surveys';
import { CreateSurvey } from './create-survey/create-survey';

import { FilterService } from '../services/filter-service';
import { CreateSurveyService } from '../services/create-survey-service';

@Component({
  selector: 'app-main-page',
  imports: [Header, SurveyOverview, AllSurveys],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss',
})
export class MainPage {

  /**
   * Service used to manage survey filtering, date calculations,
   * and the hourly update timer.
   */
  filterservice = inject(FilterService);

  /**
   * Service used to control the visibility of the
   * create-survey overlay.
   */
  createSurveyService = inject(CreateSurveyService);

  /**
   * Angular lifecycle hook that is executed when the component
   * is initialized.
   *
   * Starts the timer responsible for updating time-dependent
   * survey information at the beginning of each full hour.
   */
  ngOnInit(): void {
    this.filterservice.startHourTimer();
  }

  /**
   * Angular lifecycle hook that is executed before the component
   * is destroyed.
   *
   * Clears the timeout and interval created by the FilterService
   * to prevent them from continuing after the component has been
   * removed.
   */
  ngOnDestroy(): void {
    clearTimeout(this.filterservice.timeToFullHour);
    clearInterval(this.filterservice.hourIntervall);
  }

}