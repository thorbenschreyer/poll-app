import { Routes } from '@angular/router';
import { MainPage } from './main-page/main-page';
import { SurveyView } from './surveys/survey-view/survey-view';

export const routes: Routes = [
    { path: "", component:MainPage},
    { path: "survey/:id", component:SurveyView},
];
