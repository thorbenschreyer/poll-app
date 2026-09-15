import { Component, ElementRef, Inject, ViewChild, inject, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Questions } from '../../services/questions';
import { Survey } from '../../interfaces/survey';
import { FilterService } from '../../services/filter-service';
import { DatabaseService } from '../../services/database-service';
import { Router } from '@angular/router';
import { validate } from '@angular/forms/signals';

@Component({
  selector: 'app-create-survey',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './create-survey.html',
  styleUrls: ['./create-survey.scss', './survey-questions.scss'],
  providers: [Questions],
})
export class CreateSurvey {
  categoryIsShown = signal(false);
  closeCreateSurvey = output<void>();
  survey = inject(Questions);
  router = inject(Router);
  shownCategory!: string;
  filterService = inject(FilterService);
  databaseService = inject(DatabaseService);
  publishAttempted = signal(false);

  @ViewChild('dialog')
  dialog!: ElementRef<HTMLDialogElement>;

  @ViewChild('publishButton')
  publishButton!: ElementRef<HTMLElement>;

  setCategory(category: string) {
    this.surveyForm.patchValue({
      category: category,
    });
    this.shownCategory = category;
  }

  async onSubmit() {
    const formValue = this.surveyForm.getRawValue();
    this.publishAttempted.set(true);

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

      this.showDialog();

      setTimeout(() => {
        this.router.navigate(['/survey', result.id]);
      }, 3000);
    }
  }

  deleteText(toDelete: 'name' | 'endDate' | 'description') {
    this.surveyForm.controls[toDelete].setValue('');
  }

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

  addAnswer(index: number) {
    (this.questions.at(index).get('answers') as FormArray).push(
      new FormControl('', Validators.required),
    );
  }

  removeQuestion(index: number) {
    if (this.questions.length != 1) {
      this.questions.removeAt(index);
    } else {
      this.questions.at(0).get('question')?.setValue('');
    }
  }

  removeAnswer(answerIndex: number, questionIndex: number) {
    const answers = (this.questions.at(questionIndex).get('answers') as FormArray).length;
    if (answers > 1) {
      (this.questions.at(questionIndex).get('answers') as FormArray).removeAt(answerIndex);
    } else {
      (this.questions.at(questionIndex).get('answers') as FormArray).at(0).setValue('');
    }
  }

  get questions(): FormArray {
    return this.surveyForm.get('questions') as FormArray;
  }

  get questionForms(): FormGroup[] {
    return this.questions.controls as FormGroup[];
  }

  getAnswers(question: FormGroup): FormArray<FormControl<string>> {
    return question.get('answers') as FormArray<FormControl<string>>;
  }

  getNumberofAnswers(index: number) {
    let result = (this.questions.at(index).get('answers') as FormArray).length;
    return result;
  }

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

  closeDialogOnOutsideClick(event: MouseEvent) {
    if (event.target === this.dialog.nativeElement) {
      this.dialog.nativeElement.close();
    }
  }

  closeDialog() {
    this.dialog.nativeElement.close();
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
