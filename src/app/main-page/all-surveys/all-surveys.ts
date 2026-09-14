import { Component, computed, ElementRef, HostListener, inject, Pipe, signal } from '@angular/core';
import { SurveyOverview } from '../survey-overview/survey-overview';
import { FilterService } from '../../services/filter-service';
import { DatePipe } from '@angular/common';
import { Survey } from '../../interfaces/survey';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-all-surveys',
  imports: [SurveyOverview, DatePipe, RouterLink],
  templateUrl: './all-surveys.html',
  styleUrl: './all-surveys.scss',
})
export class AllSurveys {
  constructor(private elementRef: ElementRef) {}

  filterservice = inject(FilterService);
  categoryIsActive = signal(false);
  usedCategory = signal('All Surveys');
  sortedSurveylist = computed(() => {
    return this.filterservice.filterByCategory(
      this.usedCategory(),
      this.filterservice.filterByActivity(
        this.filterservice.pastSurvey(),
        this.filterservice.activeSurvey(),
      ),
    );
  });
  nextExpire = [];

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.categoryIsActive.set(false);
    }
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

  /**
   * Als erstes setzt diese funktion die verwendete Category.
   * Dnn erstellen wir mit NewList ein gefiltertes Array das nach Actic und Nicht Active schaut
   * Im letzten Schritt, filtern wir die sortedSurveyList nach der usedCategory
   * @param pastSurvey
   * @param activeSurvey
   * @param category
   */
  filterSurveyList(pastSurvey: boolean, activeSurvey: boolean, category: string) {
    this.usedCategory.set(category);
    const newList: Survey[] = this.filterservice.filterByActivity(pastSurvey, activeSurvey);
  }

  /**
   * Selcted die Kategorie und filtert diese dann. Die Funktion wird in filterSurveylist dargestellt
   * @param category
   */
  selectCategory(category: string) {
    this.usedCategory.set(category);
    this.categoryIsActive.set(!this.categoryIsActive());
    this.filterSurveyList(
      this.filterservice.pastSurvey(),
      this.filterservice.activeSurvey(),
      category,
    );
  }
}
