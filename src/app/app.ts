import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DatabaseService } from './services/database-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('poll_app');
  dataBase = inject(DatabaseService)

  constructor() {
    this.dataBase.getSurveys()
  }
}
