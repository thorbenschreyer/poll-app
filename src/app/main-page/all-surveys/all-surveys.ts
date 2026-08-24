import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-all-surveys',
  imports: [],
  templateUrl: './all-surveys.html',
  styleUrl: './all-surveys.scss',
})
export class AllSurveys {
  isOpen:boolean = true;
  arrowState:number = 2;


}
