import { Component, inject, Pipe, signal } from '@angular/core';
import { SurveyOverview } from '../survey-overview/survey-overview';
import { FilterService } from '../../services/filter-service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-all-surveys',
  imports: [SurveyOverview, DatePipe
  ],
  templateUrl: './all-surveys.html',
  styleUrl: './all-surveys.scss',
})
export class AllSurveys {
  categoryIsActive = signal(false);
  usedCategory = signal('');
  pastSurvey = signal(false);
  activeSurvey = signal(false);
  day = 1

  filterservice = inject(FilterService)
  sortedSurveylist = this.filterservice.surveyList

  filterActivePastSurvey() {
    console.log(this.sortedSurveylist())
    console.log("Active" + this.activeSurvey)
  }



  selectCategory(category: string) {
    this.usedCategory.set(category);
    this.categoryIsActive.set(!this.categoryIsActive())
    if (this.usedCategory() == "All Surveys") {
      this.usedCategory.set("");
    }
  }

  categorylist = ["All Surveys", "Team Activities", "Health & Wellness", "Gaming & Entertainment"
    , "Education & Learning", "Lifestyle & Preferences", "Technology & Innovation"]
}
