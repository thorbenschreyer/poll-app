import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CreateSurveyService {

  /**
   * Indicates whether the create-survey overlay is currently open.
   */
  isOpen = signal(false);

  /**
   * Opens the create-survey overlay.
   *
   * Sets the overlay state to open and disables scrolling
   * on the document body while the overlay is visible.
   */
  open() {
    this.isOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  /**
   * Closes the create-survey overlay.
   *
   * Sets the overlay state to closed and restores scrolling
   * on the document body.
   */
  close() {
    this.isOpen.set(false);
    document.body.style.overflow = '';
  }

}