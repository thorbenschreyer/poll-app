import { Component, computed, ElementRef, HostListener, inject, Pipe, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Survey } from '../../interfaces/survey';
import { FilterService } from '../../services/filter-service';
import { SurveyOverview } from '../survey-overview/survey-overview';

@Component({
  selector: 'app-all-surveys',
  imports: [RouterLink],
  templateUrl: './all-surveys.html',
  styleUrls: ['./all-surveys.scss', './all-surveys-media.scss'],
})
export class AllSurveys {
  // ---------------------------------------------------------------------------
  // Dependencies
  // ---------------------------------------------------------------------------

  filterservice = inject(FilterService);

  // ---------------------------------------------------------------------------
  // Initialization
  // ---------------------------------------------------------------------------

  /**
   * Creates the AllSurveys component.
   *
   * The ElementRef is used to determine whether a document click occurred
   * inside or outside of this component.
   *
   * @param elementRef - Reference to the component's native DOM element.
   */
  constructor(private elementRef: ElementRef) {}

  // ---------------------------------------------------------------------------
  // Category State
  // ---------------------------------------------------------------------------

  /**
   * Indicates whether the category selection menu is currently active.
   */
  categoryIsActive = signal(false);

  /**
   * Stores the category currently selected for filtering surveys.
   */
  usedCategory = signal('All Surveys');

  /**
   * Contains all categories that can be selected by the user.
   */
  categorylist = [
    'All Surveys',
    'Team Activities',
    'Health & Wellness',
    'Gaming & Entertainment',
    'Education & Learning',
    'Lifestyle & Preferences',
    'Technology & Innovation',
  ];

  // ---------------------------------------------------------------------------
  // Survey State
  // ---------------------------------------------------------------------------

  /**
   * Contains the survey list after applying the activity and category filters.
   *
   * The computed signal automatically recalculates whenever the selected
   * category, active survey filter, or past survey filter changes.
   */
  sortedSurveylist = computed(() => {
    return this.filterservice.filterByCategory(
      this.usedCategory(),
      this.filterservice.filterByActivity(
        this.filterservice.pastSurvey(),
        this.filterservice.activeSurvey(),
      ),
    );
  });

  /**
   * Set state true/false
   */
  toggleActiveSurvey() {
    const newState = !this.filterservice.activeSurvey();

    this.filterservice.activeSurvey.set(newState);
    this.filterservice.pastSurvey.set(false);
  }

  /**
   * Set state true/false
   */
  togglePastSurvey() {
    const newState = !this.filterservice.pastSurvey();

    this.filterservice.pastSurvey.set(newState);
    this.filterservice.activeSurvey.set(false);
  }

  /**
   * Stores surveys related to the next expiration state.
   */
  nextExpire = [];

  // ---------------------------------------------------------------------------
  // Document Events
  // ---------------------------------------------------------------------------

  /**
   * Handles click events on the document.
   *
   * If the click occurs outside of this component, the category
   * selection menu is closed.
   *
   * @param event - The mouse event emitted by the document click.
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.categoryIsActive.set(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Survey Filtering
  // ---------------------------------------------------------------------------

  /**
   * Applies the selected category and activity filter settings.
   *
   * First, the selected category is stored. The survey list is then
   * filtered according to the active and past survey settings.
   *
   * @param pastSurvey - Indicates whether expired surveys should be included.
   * @param activeSurvey - Indicates whether active surveys should be included.
   * @param category - The category used to filter the survey list.
   */
  filterSurveyList(pastSurvey: boolean, activeSurvey: boolean, category: string) {
    this.usedCategory.set(category);

    const newList: Survey[] = this.filterservice.filterByActivity(pastSurvey, activeSurvey);
  }

  /**
   * Selects a category and updates the category menu state.
   *
   * After storing the selected category, the category menu is toggled
   * and the survey filtering process is triggered with the current
   * activity filter settings.
   *
   * @param category - The category selected by the user.
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
