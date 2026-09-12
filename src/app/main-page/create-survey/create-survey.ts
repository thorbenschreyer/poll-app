import { Component, Inject, inject, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, FormArray} from '@angular/forms';
import { Questions } from '../../services/questions';
import { Question } from '../../interfaces/question';

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
  shownCategory!: string 

  ngOnInit() {}

  setCategory(category: string) {
    this.surveyForm.patchValue({
      category: category,
    });
    this.shownCategory = category
  }

  onSubmit() {
    console.log(this.surveyForm.value); // Zeigt die eingegebenen Daten an
  }

  addquestion() {
    const question = new FormGroup({
      question: new FormControl,
      allowMultipleAnswers: new FormControl(false),
      answers: new FormArray([])
    }) 
    this.questions.push(question)
  }

  get questions(): FormArray {
  return this.surveyForm.get('questions') as FormArray;
}

get questionForms(): FormGroup[] {
  return this.questions.controls as FormGroup[];
}

  surveyForm = new FormGroup({
    name: new FormControl(''),
    endDate: new FormControl(''),
    category: new FormControl(''),
    description: new FormControl(''),

    questions: new FormArray([])
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
