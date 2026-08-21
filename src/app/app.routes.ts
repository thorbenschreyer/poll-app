import { Routes } from '@angular/router';
import { MainPage } from './main-page/main-page';
import { SurveyView } from './surveys/survey-view/survey-view';
import { CreateSurvey } from './surveys/create-survey/create-survey';
import { ErrorPage } from './error-page/error-page';

export const routes: Routes = [
    { path: "", component:MainPage},
    { path: "view-survey", component:SurveyView},
    { path: "new-survey", component:CreateSurvey},

    { path: "**", component:ErrorPage}
];
