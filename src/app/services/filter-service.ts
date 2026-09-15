import { inject, Injectable, signal } from '@angular/core';
import { Survey } from '../interfaces/survey';
import { DatabaseService } from './database-service';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  timeToFullHour!: ReturnType<typeof setTimeout>;
  hourIntervall!: ReturnType<typeof setInterval>;
  private databaseService = inject(DatabaseService);

  pastSurvey = signal(false);
  activeSurvey = signal(true);
  currentDay = signal(new Date());
  surveyList = signal<Survey[]>([]);

  constructor() {
    this.loadSurveys();
  }

  SurveyDetail = signal<Survey>({
    id: '',
    name: '',
    endDate: null,
    category: '',
    description: '',
    isActive: true,
    isPublished: false,

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

  setSurveyDetailByID(id: string) {
    let tmpSurvey = this.surveyList().find((survey) => survey.id == id);
    if (tmpSurvey) this.SurveyDetail.set(tmpSurvey);
  }

  async loadSurveys() {
    const surveys = await this.databaseService.getSurveys();
    if (surveys) {
      this.surveyList.set(surveys);
    }
  }

  filterByCategory(category: string, newList: Survey[]) {
    if (category == 'All Surveys') {
      return newList;
    } else {
      return newList.filter((survey) => survey.category == category);
    }
  }

  secondsToNextHour(): number {
    const minutes = this.currentDay().getMinutes();
    const seconds = this.currentDay().getSeconds();
    const timeToNextHour = (60 * 60 - (minutes * 60 + seconds)) * 1000;
    return timeToNextHour;
  }

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

  /**
   * berechnet wieviele tage noch bis zum ende der umfrage bleiben
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

  sortNextThreeExpDay() {
    const endingSurveys = this.surveyList()

      .filter(
        (survey) =>
          survey.endDate !== null && survey.endDate.getTime() >= this.currentDay().getTime(),
      )
      .sort((a, b) => a.endDate!.getTime() - b.endDate!.getTime())
      .slice(0, 3);
    return endingSurveys;
  }

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

  addSurvey(survey: Survey) {
    this.surveyList.update((currentSurveys) => [...currentSurveys, survey]);
  }
}
