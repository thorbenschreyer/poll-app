import { Component, Inject, inject, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Questions } from '../../services/questions';
import { Survey } from '../../interfaces/survey';
import { Answer } from '../../interfaces/answer';

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
  shownCategory!: string;

  ngOnInit() {}

  setCategory(category: string) {
    this.surveyForm.patchValue({
      category: category,
    });
    this.shownCategory = category;
  }

onSubmit() {
  const formValue = this.surveyForm.getRawValue();

  const newSurvey: Survey = {
    id: crypto.randomUUID(),
    name: formValue.name ?? '',
    endDate: new Date(formValue.endDate ?? ''),
    category: formValue.category ?? '',
    description: formValue.description ?? '',
    isActive: true,
    isPublished: formValue.isPublished ?? false,

    questions: formValue.questions.map(question => ({
      question: question.question ?? '',
      allowMultipleAnswers: question.allowMultipleAnswers,
      answers: question.answers.map(answer => ({
        answer: answer ?? ''
      }))
    })),
  };

  console.log('Neuer Survey:', newSurvey);
}

  addQuestion() {
    const question = new FormGroup({
      question: new FormControl(),
      allowMultipleAnswers: new FormControl<boolean>(false),
      answers: new FormArray([new FormControl(''), new FormControl('')]),
    });
    this.questions.push(question);
  }

  addAnswer(index: number) {
    (this.questions.at(index).get('answers') as FormArray).push(new FormControl(''));
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  removeAnswer(answerIndex: number, questionIndex: number) {
    (this.questions.at(questionIndex).get('answers') as FormArray).removeAt(answerIndex);
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
    name: new FormControl(''),
    endDate: new FormControl(''),
    category: new FormControl(''),
    description: new FormControl(''),
    isPublished: new FormControl(false),
    questions: new FormArray([
      new FormGroup({
        question: new FormControl(),
        allowMultipleAnswers: new FormControl(false, { nonNullable: true }),
        answers: new FormArray([new FormControl<string>(''), new FormControl<string>('')]),
      }),
    ]),
  });

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
