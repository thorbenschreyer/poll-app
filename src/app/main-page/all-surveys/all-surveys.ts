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
  usedCategory = signal('');
  day = 1;

  filterservice = inject(FilterService);
  sortedSurveylist = signal<Survey[]>(this.filterservice.surveyList());

  filterActivePastSurvey() {
    console.log(this.sortedSurveylist());
    console.log('Active' + this.filterservice.activeSurvey());
  }

  selectCategory(category: string) {
    this.usedCategory.set(category);
    this.categoryIsActive.set(!this.categoryIsActive());
    this.sortedSurveylist.set(this.filterservice.filterByCategory(category));
    

    if (this.usedCategory() == 'All Surveys') {
      this.sortedSurveylist.set(this.filterservice.surveyList());
      this.usedCategory.set('');
      
    }
  }

  setActivityFilter() {
    this.sortedSurveylist.set(this.filterservice.filterByActivity(this.filterservice.pastSurvey(), this.filterservice.activeSurvey()));
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
