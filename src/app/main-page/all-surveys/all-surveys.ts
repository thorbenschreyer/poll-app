import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-all-surveys',
  imports: [],
  templateUrl: './all-surveys.html',
  styleUrl: './all-surveys.scss',
})
export class AllSurveys {
  isActive = signal(false);
  usedCategory = signal('');

  selectCategory(category: string) {
    this.usedCategory.set(category);
    this.isActive.set(!this.isActive())
    if (this.usedCategory() == "All Surveys") {
      this.usedCategory.set("");
    }
  }

  categorylist = ["All Surveys", "Team Activities", "Health & Wellness", "Gaming & Entertainment"
    , "Education & Learning", "Lifestyle & Preferences", "Technology & Innovation"]
}
