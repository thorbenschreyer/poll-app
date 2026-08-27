import { Component, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-create-survey',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './create-survey.html',
  styleUrls: [ 
    './create-survey.scss',
    './survey-questions.scss'
  ]
})
export class CreateSurvey {

  categoryIsShown = signal(false);
  closeCreateSurvey = output<void>();

  surveyForm = new FormGroup ({

  })


  setCategory(category:string) {
    console.log(category);
  }

  onSubmit() {
    console.log(this.surveyForm.value); // Zeigt die eingegebenen Daten an
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
