import { Component, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-create-survey',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './create-survey.html',
  styleUrl: './create-survey.scss',
})
export class CreateSurvey {

  closeCreateSurvey = output<void>();

  surveyForm = new FormGroup ({

  })



  onSubmit() {
    console.log(this.surveyForm.value); // Zeigt die eingegebenen Daten an
  }
}
