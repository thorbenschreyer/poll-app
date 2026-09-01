import { Component, Inject, inject, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { Questions } from '../../services/questions';

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

  setCategory(category: string) {
    console.log(category);
  }

  
/*
  addElement(questionOrAnswer: string) {
    if (questionOrAnswer == 'question') {
      this.arrayQuestions.update((questions) => [...questions, '']);
    }
    if (questionOrAnswer == 'answer') {
      if (this.numberOfAnswers() == 6) {
        return;
      }
      this.arrayAnswers.update((answers) => [...answers, '']);
    }
  }

  removeElement(questionOrAnswer: string, id: number) {
    if (questionOrAnswer == 'question' && this.numberOfQuestions() > 1) {
      this.arrayQuestions.update((questions) => questions.filter((_, i) => i !== id));
    }
    if (questionOrAnswer == 'answer' && this.numberOfAnswers() > 1) {
      this.arrayAnswers.update((answers) => answers.filter((_, i) => i !== id));
    }
  }
*/
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
