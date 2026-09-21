import { Component, ElementRef, ViewChild, inject, output, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Survey } from '../../interfaces/survey';
import { DatabaseService } from '../../services/database-service';
import { FilterService } from '../../services/filter-service';
import { Questions } from '../../services/questions';
import { CreateSurveyService } from '../../services/create-survey-service';

@Component({
  selector: 'app-create-survey',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './create-survey.html',
  styleUrls: ['./create-survey.scss', './survey-questions.scss', './create-survey-media.scss'],
  providers: [Questions],
})
export class CreateSurvey {
  // ---------------------------------------------------------------------------
  // Dependencies
  // ---------------------------------------------------------------------------
  survey = inject(Questions);
  router = inject(Router);
  filterService = inject(FilterService);
  databaseService = inject(DatabaseService);
  dialogService = inject(CreateSurveyService);

  // ---------------------------------------------------------------------------
  // Component State
  // ---------------------------------------------------------------------------

  /**
   * Indicates whether the category selection menu is currently visible.
   */
  categoryIsShown = signal(false);

  /**
   * Emits an event when the create-survey interface should be closed.
   */
  closeCreateSurvey = output<void>();

  /**
   * Stores the category currently displayed in the category selector.
   */
  shownCategory!: string;

  /**
   * Indicates whether the user has attempted to publish the survey.
   *
   * This state can be used by the template to display validation feedback
   * after a publish attempt.
   */
  publishAttempted = signal(false);

  /**
   * Stores the controls that should currently be displayed
   * with a validation error.
   */
  invalidFields = signal<Set<string>>(new Set());

  // ---------------------------------------------------------------------------
  // Date Configuration
  // ---------------------------------------------------------------------------

  /**
   * Stores the current date used to calculate the minimum selectable date.
   */
  today = new Date();

  /**
   * Contains today's date formatted as YYYY-MM-DD.
   *
   * This value can be used as the minimum allowed date for the survey
   * expiration date input.
   */
  minDate =
    this.today.getFullYear() +
    '-' +
    String(this.today.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(this.today.getDate()).padStart(2, '0');

  // ---------------------------------------------------------------------------
  // Template References
  // ---------------------------------------------------------------------------

  /**
   * Reference to the dialog element used to display the successful
   * survey creation message.
   */
  @ViewChild('dialog')
  dialog!: ElementRef<HTMLDialogElement>;

  /**
   * Reference to the publish button used to calculate the position
   * of the success dialog.
   */
  @ViewChild('publishButton')
  publishButton!: ElementRef<HTMLElement>;

  // ---------------------------------------------------------------------------
  // Survey Form
  // ---------------------------------------------------------------------------

  /**
   * Reactive form used to create a new survey.
   *
   * The form contains the general survey information and a FormArray
   * containing the individual questions and their corresponding answers.
   */
  surveyForm = new FormGroup({
    name: new FormControl('', Validators.required),
    endDate: new FormControl(''),
    category: new FormControl('', Validators.required),
    description: new FormControl(''),
    isPublished: new FormControl(false),
    questions: new FormArray([
      new FormGroup({
        question: new FormControl('', Validators.required),
        allowMultipleAnswers: new FormControl(false, { nonNullable: true }),
        answers: new FormArray([
          new FormControl<string>('', Validators.required),
          new FormControl<string>('', Validators.required),
        ]),
      }),
    ]),
  });

  // ---------------------------------------------------------------------------
  // Form Accessors
  // ---------------------------------------------------------------------------

  /**
   * Returns the questions FormArray from the survey form.
   *
   * @returns The FormArray containing all survey questions.
   */
  get questions(): FormArray {
    return this.surveyForm.get('questions') as FormArray;
  }

  /**
   * Returns all question controls as FormGroup instances.
   *
   * @returns An array containing the question FormGroups.
   */
  get questionForms(): FormGroup[] {
    return this.questions.controls as FormGroup[];
  }

  /**
   * Stores all currently invalid fields.
   */
  setInvalidFields() {
    const invalid = new Set<string>();
    if (this.surveyForm.controls.name.invalid) {
      invalid.add('name');
    } if (this.surveyForm.controls.category.invalid) {
      invalid.add('category');
    }
    this.questions.controls.forEach((question, questionIndex) => {
      const questionGroup = question as FormGroup;
      if (questionGroup.controls['question'].invalid) {invalid.add(`question-${questionIndex}`);}
      const answers = questionGroup.controls['answers'] as FormArray;
      answers.controls.forEach((answer, answerIndex) => {
        if (answer.invalid) {invalid.add(`answer-${questionIndex}-${answerIndex}`);}
      });
    });
    this.invalidFields.set(invalid);
  }

  /**
   * Returns the answers FormArray belonging to a specific question.
   *
   * @param question - The question FormGroup containing the answers.
   * @returns The FormArray containing the answer controls.
   */
  getAnswers(question: FormGroup): FormArray<FormControl<string>> {
    return question.get('answers') as FormArray<FormControl<string>>;
  }

  /**
   * Returns the number of answers belonging to a specific question.
   *
   * @param index - The index of the question in the questions FormArray.
   * @returns The number of answer controls for the selected question.
   */
  getNumberofAnswers(index: number) {
    let result = (this.questions.at(index).get('answers') as FormArray).length;
    return result;
  }

  // ---------------------------------------------------------------------------
  // Category Selection
  // ---------------------------------------------------------------------------

  /**
   * Contains all categories available when creating a survey.
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

  /**
   * Sets the selected category and removes its
   * visual validation error.
   *
   * @param category - Selected survey category.
   */
  setCategory(category: string) {
    this.surveyForm.patchValue({
      category: category,
    });

    this.shownCategory = category;

    this.clearFieldError('category');
  }

  // ---------------------------------------------------------------------------
  // Question Management
  // ---------------------------------------------------------------------------

  /**
   * Adds a new question to the survey form.
   *
   * The new question contains a required question field, a setting for
   * allowing multiple answers, and two required answer controls.
   */
  addQuestion() {
    this.publishAttempted.set(false);
    const question = new FormGroup({
      question: new FormControl('', Validators.required),
      allowMultipleAnswers: new FormControl<boolean>(false),
      answers: new FormArray([
        new FormControl('', Validators.required),
        new FormControl('', Validators.required),
      ]),
    });
    this.questions.push(question);
  }

  /**
   * Removes a question from the survey form.
   *
   * If only one question remains, the question is not removed.
   * Instead, its question text is cleared.
   *
   * @param index - The index of the question that should be removed.
   */
  removeQuestion(index: number) {
    if (this.questions.length != 1) {
      this.questions.removeAt(index);
    } else {
      this.questions.at(0).get('question')?.setValue('');
    }
  }

  // ---------------------------------------------------------------------------
  // Answer Management
  // ---------------------------------------------------------------------------

  /**
   * Adds a new required answer control to a specific question.
   *
   * @param index - The index of the question receiving the new answer.
   */
  addAnswer(index: number) {
    (this.questions.at(index).get('answers') as FormArray).push(
      new FormControl('', Validators.required),
    );
  }

  /**
   * Removes an answer from a specific question.
   *
   * If only one answer remains, the answer control is not removed.
   * Instead, its value is cleared.
   *
   * @param answerIndex - The index of the answer that should be removed.
   * @param questionIndex - The index of the question containing the answer.
   */
  removeAnswer(answerIndex: number, questionIndex: number) {
    const answers = (this.questions.at(questionIndex).get('answers') as FormArray).length;
    if (answers > 2) {
      (this.questions.at(questionIndex).get('answers') as FormArray).removeAt(answerIndex);
    } else {
      (this.questions.at(questionIndex).get('answers') as FormArray).at(answerIndex).setValue('');
    }
  }

  // ---------------------------------------------------------------------------
  // Form Utilities
  // ---------------------------------------------------------------------------

  /**
   * Clears the value of a specific survey form field.
   *
   * @param toDelete - The form control whose value should be cleared.
   */
  deleteText(toDelete: 'name' | 'endDate' | 'description') {
    this.surveyForm.controls[toDelete].setValue('');
  }

  /**
   * Hides the general validation message after the user edits a field.
   *
   * Individual invalid fields can remain visually marked until they
   * are edited or the form is validated again.
   */
  hideValidationMessage() {
    this.publishAttempted.set(false);
  }

  /**
   * Removes the visual validation error from a specific field
   * after the user starts editing it.
   *
   * Also hides the general validation message without triggering
   * a new validation of the complete form.
   *
   * @param field - Unique key of the field whose error should be removed.
   */
  clearFieldError(field: string) {
    this.hideValidationMessage();

    this.invalidFields.update((fields) => {
      const updatedFields = new Set(fields);

      updatedFields.delete(field);

      return updatedFields;
    });
  }

  // ---------------------------------------------------------------------------
  // Survey Submission
  // ---------------------------------------------------------------------------

  /**
   * Validates and submits the survey form.
   *
   * The form values are transformed into the Survey structure and stored
   * in the database. After a successful creation, the survey list is
   * reloaded, the success dialog is displayed, and the user is redirected
   * to the newly created survey after three seconds.
   */
  async onSubmit() {
    const formValue = this.surveyForm.getRawValue();
    this.publishAttempted.set(true);
    this.setInvalidFields();
    if (this.surveyForm.invalid) {
      return;
    }
    const newSurvey: Survey = {
      id: '',
      name: formValue.name ?? '',
      endDate: formValue.endDate ? new Date(formValue.endDate) : null,
      category: formValue.category ?? '',
      description: formValue.description ?? '',
      isActive: true,
      isPublished: formValue.isPublished ?? true,
      isSubmitted: false,
      questions: formValue.questions.map((question) => ({
        question: question.question ?? '',
        allowMultipleAnswers: question.allowMultipleAnswers,
        answers: question.answers.map((answer) => ({
          answer: answer ?? '',
        })),
      })),
    };
    const result = await this.databaseService.createSurvey(newSurvey);
    if (result.success) {
      await this.filterService.loadSurveys();
      if (window.innerWidth <= 950) {
        await this.router.navigate(['/survey', result.id]);
        this.dialogService.close();
        return;
      }
      this.showDialog();
      setTimeout(() => {
        this.router.navigate(['/survey', result.id]);
        this.dialogService.close();
      }, 3000);
    }
  }

  // ---------------------------------------------------------------------------
  // Dialog Management
  // ---------------------------------------------------------------------------

  /**
   * Positions and opens the success dialog relative to the publish button.
   *
   * The button position is used to calculate the distance from the
   * bottom and right edges of the browser window.
   */
  showDialog() {
    const button = this.publishButton.nativeElement;
    const dialog = this.dialog.nativeElement;
    const buttonPosition = button.getBoundingClientRect();
    const distanceFromBottom = window.innerHeight - buttonPosition.bottom;
    const distanceFromRight = window.innerWidth - buttonPosition.right;
    dialog.style.bottom = `${distanceFromBottom}px`;
    dialog.style.right = `${distanceFromRight}px`;
    dialog.showModal();
  }

  /**
   * Closes the dialog when the user clicks directly on the dialog backdrop.
   *
   * @param event - The mouse event emitted by the dialog click.
   */
  closeDialogOnOutsideClick(event: MouseEvent) {
    if (event.target === this.dialog.nativeElement) {
      this.dialog.nativeElement.close();
    }
  }

  /**
   * Closes the success dialog.
   */
  closeDialog() {
    this.dialog.nativeElement.close();
  }
}
