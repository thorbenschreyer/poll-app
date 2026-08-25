import { Component, signal } from '@angular/core';
import { SurveyOverview } from '../survey-overview/survey-overview';

@Component({
  selector: 'app-all-surveys',
  imports: [SurveyOverview],
  templateUrl: './all-surveys.html',
  styleUrl: './all-surveys.scss',
})
export class AllSurveys {
  categoryIsActive = signal(false);
  usedCategory = signal('');
  pastSurvey = signal(false);
  activeSurvey = signal(false);
  day = 1

  filterActivePastSurvey() {
    console.log("Past: " + this.pastSurvey)
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
