import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CreateSurveyService } from '../../services/create-survey-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  createSurveyService = inject(CreateSurveyService);

}