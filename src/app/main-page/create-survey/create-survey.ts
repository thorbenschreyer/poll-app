import { Component, Inject, inject, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
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
  questions = inject(Questions)
  surveyForm = new FormGroup({});

  ngOnInit() {

  }

  setCategory(category: string) {
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
