import { inject, Injectable, signal } from '@angular/core';

import { Survey } from '../interfaces/survey';
import { DatabaseService } from './database-service';

@Injectable({
  providedIn: 'root',
})
export class FilterService {

  // ---------------------------------------------------------------------------
  // Dependencies
  // ---------------------------------------------------------------------------

  private databaseService = inject(DatabaseService);


  // ---------------------------------------------------------------------------
  // Timer State
  // ---------------------------------------------------------------------------

  /**
   * Stores the timeout used to wait until the next full hour.
   */
  timeToFullHour!: ReturnType<typeof setTimeout>;

  /**
   * Stores the interval used to update the current time every full hour.
   */
  hourIntervall!: ReturnType<typeof setInterval>;


  // ---------------------------------------------------------------------------
  // Filter State
  // ---------------------------------------------------------------------------

  /**
   * Indicates whether expired surveys should be included.
   */
  pastSurvey = signal(false);

  /**
   * Indicates whether active surveys should be included.
   */
  activeSurvey = signal(true);


  // ---------------------------------------------------------------------------
  // Date State
  // ---------------------------------------------------------------------------

  /**
   * Stores the current date and time used for survey expiration calculations.
   */
  currentDay = signal(new Date());


  // ---------------------------------------------------------------------------
  // Survey State
  // ---------------------------------------------------------------------------

  /**
   * Stores all surveys loaded from the database.
   */
  surveyList = signal<Survey[]>([]);

  /**
   * Stores the survey that is currently selected for the detail view.
   *
   * The signal is initialized with an empty survey structure until
   * a specific survey is selected.
   */
  SurveyDetail = signal<Survey>({
    id: '',
    name: '',
    endDate: null,
    category: '',
    description: '',
    isActive: true,
    isPublished: false,
    isSubmitted: false,

    questions: [
      {
        allowMultipleAnswers: false,
        question: '',
        answers: [
          {
            answer: '',
          },
        ],
      },
    ],
  });


  // ---------------------------------------------------------------------------
  // Initialization
  // ---------------------------------------------------------------------------

  /**
   * Creates the FilterService and loads the available surveys
   * from the database.
   */
  constructor() {
    this.loadSurveys();
  }


  // ---------------------------------------------------------------------------
  // Survey Loading and Management
  // ---------------------------------------------------------------------------

  /**
   * Loads all surveys from the database and stores them
   * in the survey list signal.
   */
async loadSurveys() {
  const surveys = await this.databaseService.getSurveys();

  if (surveys) {
    this.surveyList.set(surveys);
  }
}

  /**
   * Selects a survey from the survey list by its unique ID
   * and stores it as the current survey detail.
   *
   * @param id - The unique ID of the survey to select.
   */
  setSurveyDetailByID(id: string) {
    let tmpSurvey = this.surveyList().find((survey) => survey.id == id);

    if (tmpSurvey) this.SurveyDetail.set(tmpSurvey);
  }

  /**
   * Adds a survey to the existing survey list.
   *
   * @param survey - The survey that should be added to the list.
   */
  addSurvey(survey: Survey) {
    this.surveyList.update((currentSurveys) => [...currentSurveys, survey]);
  }


  // ---------------------------------------------------------------------------
  // Survey Filtering
  // ---------------------------------------------------------------------------

  /**
   * Filters a given survey list by category.
   *
   * If "All Surveys" is selected, the original list is returned
   * without applying a category filter.
   *
   * @param category - The category used to filter the surveys.
   * @param newList - The survey list that should be filtered.
   * @returns The filtered survey list.
   */
  filterByCategory(category: string, newList: Survey[]) {
    if (category == 'All Surveys') {
      return newList;
    } else {
      return newList.filter((survey) => survey.category == category);
    }
  }

  /**
   * Filters surveys based on their active or expired state.
   *
   * If both active and past surveys are enabled, all surveys are returned.
   * If both options are disabled, an empty array is returned.
   *
   * @param pastSurvey - Indicates whether expired surveys should be included.
   * @param activeSurvey - Indicates whether active surveys should be included.
   * @returns A survey list matching the selected activity filters.
   */
  filterByActivity(pastSurvey: boolean, activeSurvey: boolean) {
    if (activeSurvey == true && pastSurvey == true) {
      return this.surveyList();
    } else if (activeSurvey == false && pastSurvey == false) {
      return [];
    } else if (activeSurvey == true) {
      return this.surveyList().filter((survey) => survey.isActive == true);
    } else if (pastSurvey == true) {
      return this.surveyList().filter((survey) => survey.isActive == false);
    }

    return this.surveyList();
  }


  // ---------------------------------------------------------------------------
  // Survey Expiration
  // ---------------------------------------------------------------------------

  /**
   * Calculates how many days remain until a survey expires.
   *
   * If the survey has already expired, its active state is set to false
   * and zero is returned. If no end date exists, the survey is marked
   * as active.
   *
   * @param survey - The survey whose remaining duration should be calculated.
   * @returns The number of days remaining until expiration, or zero if
   * the survey is expired or has no end date.
   */
  getSurveyEnds(survey: Survey) {
    if (survey.endDate) {
      const msPerDay = 1000 * 60 * 60 * 24;

      let ExpDayInList = survey.endDate;

      let diffInMs = ExpDayInList.getTime() - this.currentDay().getTime();

      let daysUntilExpires = Math.ceil(diffInMs / msPerDay);

      if (daysUntilExpires <= 0) {
        survey.isActive = false;

        return 0;
      }

      return daysUntilExpires;
    } else {
      survey.isActive = true;
    }

    return 0;
  }

  /**
   * Returns the next three surveys that are closest to their expiration date.
   *
   * Surveys without an end date and surveys that have already expired
   * are excluded. The remaining surveys are sorted by their end date
   * before the first three entries are returned.
   *
   * @returns Up to three upcoming surveys ordered by expiration date.
   */
  sortNextThreeExpDay() {
    const endingSurveys = this.surveyList()
      .filter(
        (survey) =>
          survey.endDate !== null &&
          survey.endDate.getTime() >= this.currentDay().getTime(),
      )
      .sort((a, b) => a.endDate!.getTime() - b.endDate!.getTime())
      .slice(0, 3);

    return endingSurveys;
  }


  // ---------------------------------------------------------------------------
  // Time Management
  // ---------------------------------------------------------------------------

  /**
   * Calculates the remaining time until the next full hour.
   *
   * @returns The number of milliseconds until the next full hour.
   */
  secondsToNextHour(): number {
    const minutes = this.currentDay().getMinutes();

    const seconds = this.currentDay().getSeconds();

    const timeToNextHour = (60 * 60 - (minutes * 60 + seconds)) * 1000;

    return timeToNextHour;
  }

  /**
   * Starts the timer responsible for keeping the current date and time updated.
   *
   * First, a timeout waits until the next full hour. After reaching the
   * full hour, an interval updates the current date once every hour.
   */
  startHourTimer(): void {
    this.currentDay.set(new Date());

    const ms = 60 * 60 * 1000;

    this.timeToFullHour = setTimeout(() => {
      this.currentDay.set(new Date());

      this.hourIntervall = setInterval(() => {
        this.currentDay.set(new Date());
      }, ms);
    }, this.secondsToNextHour());
  }

}