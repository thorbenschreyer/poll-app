import { Injectable } from '@angular/core';

@Injectable()
export class Questions {

  arrayAnswers = (['', '']);
  arrayQuestions = (['',]);
  numberOfQuestions = this.arrayQuestions.length
  numberOfAnswers = this.arrayAnswers.length


}
