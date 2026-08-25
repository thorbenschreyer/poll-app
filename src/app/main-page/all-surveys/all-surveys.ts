import { Component, inject, Pipe, signal } from '@angular/core';
import { SurveyOverview } from '../survey-overview/survey-overview';
import { FilterService } from '../../services/filter-service';
import { DatePipe } from '@angular/common';
import { Survey } from '../../interfaces/survey';

@Component({
  selector: 'app-all-surveys',
  imports: [SurveyOverview, DatePipe],
  templateUrl: './all-surveys.html',
  styleUrl: './all-surveys.scss',
})
export class AllSurveys {
  categoryIsActive = signal(false);
  usedCategory = signal('All Surveys');
  day = 1;

  filterservice = inject(FilterService);
  sortedSurveylist = signal<Survey[]>(this.filterservice.surveyList());


  
  filterSurveyList(pastSurvey: boolean, activeSurvey: boolean, category: string) {
    this.usedCategory.set(category);
    const newList:Survey[] = this.filterservice.filterByActivity(pastSurvey, activeSurvey)
    this.sortedSurveylist.set(this.filterservice.filterByCategory(this.usedCategory(), newList));
  }


  filterActivePastSurvey() {
    console.log(this.sortedSurveylist());
    console.log('Active' + this.filterservice.activeSurvey());
  }

  selectCategory(category: string) {
    this.usedCategory.set(category);
    this.categoryIsActive.set(!this.categoryIsActive());
    this.filterSurveyList(this.filterservice.pastSurvey(), this.filterservice.activeSurvey(), category)

    if (this.usedCategory() == 'All Surveys') {
      this.sortedSurveylist.set(this.filterservice.surveyList());
      this.usedCategory.set('');
    }
  }

  setActivityFilter() {
    this.sortedSurveylist.set(
      this.filterservice.filterByActivity(
        this.filterservice.pastSurvey(),
        this.filterservice.activeSurvey(),
      ),
    );
  }

  categorylist = [
    'All Surveys',
    'Team Activities',
    'Health & Wellness',
    'Gaming & Entertainment',
    'Education & Learning',
    'Lifestyle & Preferences',
    'Technology & Innovation',
  ];
}

// Hier kommt rein activeSurvey true dann mache die sortierung ansonsten die oder alles
