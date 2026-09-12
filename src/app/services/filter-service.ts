import { Injectable, signal } from '@angular/core';
import { Survey } from '../interfaces/survey';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  pastSurvey = signal(false);
  activeSurvey = signal(true);
  currentDay = signal(new Date());
  timeToFullHour!: ReturnType<typeof setTimeout>;
  hourIntervall!: ReturnType<typeof setInterval>;

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
    const msPerDay = 1000 * 60 * 60 * 24;
    let ExpDayInList = survey.endDate;
    let diffInMs = ExpDayInList.getTime() - this.currentDay().getTime();
    let daysUntilExpires = Math.ceil(diffInMs / msPerDay);
    if (daysUntilExpires <= 0) {
      survey.isActive = false;
      return 0;
    }
    return daysUntilExpires;
  }

  sortNextThreeExpDay() {
    const endingSurveys = this.surveyList()
      .filter((survey) => survey.endDate.getTime() >= this.currentDay().getTime())
      .sort((a, b) => a.endDate.getTime() - b.endDate.getTime())
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
  this.surveyList.update(currentSurveys => [
    ...currentSurveys,
    survey
  ]);
}

surveyList = signal<Survey[]>([
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    category: 'Team Activities',
    name: 'Wie zufrieden bist du mit unseren Teamevents?',
    endDate: new Date('2026-09-05'),
    description: 'Wir möchten wissen, wie zufrieden du mit unseren bisherigen Teamevents bist.',
    isActive: true,
    isPublished: true,
    questions: [],
  },
]);
}
