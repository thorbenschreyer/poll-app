import { Injectable, signal } from '@angular/core';
import { Survey } from '../interfaces/survey';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  pastSurvey = signal(false);
  activeSurvey = signal(true);
  currentDay = signal(new Date());

  filterByCategory(category: string, newList: Survey[]) {
    if (category == 'All Surveys') {
      return newList;
    } else {
      return newList.filter((survey) => survey.category == category);
    }
  }

  /**
   * berechnet wieviele tage noch bis zum ende der umfrage bleiben
   */
  getSurveyEnds(survey:Survey) {
    const msPerDay = 1000 * 60 * 60 * 24;
    let ExpDayInList = survey.endDate;
      let diffInMs = ExpDayInList.getTime() - this.currentDay().getTime();
      let daysUntilExpires = Math.ceil(diffInMs / msPerDay);
      if (daysUntilExpires <= 0) {
        survey.isActive = false;
        return 0
      } 
        return daysUntilExpires
    };

  sortNextThreeExpDay() {
    const endingSurveys = this.surveyList()
      .filter((survey) => survey.endDate.getTime() >= this.currentDay().getTime())
      .sort((a, b) => a.endDate.getTime() - b.endDate.getTime())
      .slice(0, 3);
    return endingSurveys;
  }

  filterByActivity(pastSurvey: boolean, activeSurvey: boolean) {
    if (activeSurvey == true && pastSurvey == true) {
      return this.surveyList();
    } else if (activeSurvey == false && pastSurvey == false) {
      return [];
    } else if (activeSurvey == true) {
      return this.surveyList().filter((survey) => survey.isActive == true);
    } else if (pastSurvey == true) {
      return this.surveyList().filter((survey) => survey.isActive == false);
    }
    return this.surveyList();
  }

  surveyList = signal<Survey[]>([
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      category: 'Team Activities',
      surveyHeadline: 'Wie zufrieden bist du mit unseren Teamevents?',
      endDate: new Date('2026-09-05'),
      description: 'Wir möchten wissen, wie zufrieden du mit unseren bisherigen Teamevents bist.',
      isActive: true,
      questions: [],
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      category: 'Health & Wellness',
      surveyHeadline: 'Wie wichtig ist dir Bewegung im Arbeitsalltag?',
      endDate: new Date('2026-09-08'),
      description:
        'Deine Meinung hilft uns dabei, Bewegung und Gesundheit im Arbeitsalltag besser zu unterstützen.',
      isActive: true,
      questions: [],
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      category: 'Gaming & Entertainment',
      surveyHeadline: 'Welches Gaming-Genre bevorzugst du?',
      endDate: new Date('2026-09-10'),
      description:
        'Wir möchten herausfinden, welche Gaming-Genres bei unseren Mitarbeitenden besonders beliebt sind.',
      isActive: true,
      questions: [],
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440004',
      category: 'Education & Learning',
      surveyHeadline: 'Welche Weiterbildung interessiert dich am meisten?',
      endDate: new Date('2026-09-12'),
      description:
        'Welche Weiterbildungsangebote würden dich beruflich und persönlich am meisten weiterbringen?',
      isActive: true,
      questions: [],
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440005',
      category: 'Lifestyle & Preferences',
      surveyHeadline: 'Wie wichtig ist dir eine flexible Arbeitszeit?',
      endDate: new Date('2026-09-15'),
      description:
        'Wir möchten erfahren, welchen Stellenwert flexible Arbeitszeiten für dich haben.',
      isActive: true,
      questions: [],
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440006',
      category: 'Technology & Innovation',
      surveyHeadline: 'Welche Technologie sollte stärker eingesetzt werden?',
      endDate: new Date('2026-09-18'),
      description:
        'Welche Technologien könnten unseren Arbeitsalltag deiner Meinung nach verbessern?',
      isActive: true,
      questions: [],
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440007',
      category: 'Team Activities',
      surveyHeadline: 'Welches Teamevent würdest du gerne besuchen?',
      endDate: new Date('2026-09-20'),
      description: 'Stimme darüber ab, welches Teamevent du dir als Nächstes wünschst.',
      isActive: true,
      questions: [],
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440008',
      category: 'Health & Wellness',
      surveyHeadline: 'Wie gut findest du unsere aktuellen Gesundheitsangebote?',
      endDate: new Date('2026-09-22'),
      description: 'Bewerte unsere bestehenden Angebote rund um Gesundheit und Wohlbefinden.',
      isActive: true,
      questions: [],
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440009',
      category: 'Gaming & Entertainment',
      surveyHeadline: 'Welches Spiel sollte beim nächsten Spieleabend gespielt werden?',
      endDate: new Date('2026-09-25'),
      description:
        'Hilf uns bei der Auswahl des nächsten Spiels für unseren gemeinsamen Spieleabend.',
      isActive: true,
      questions: [],
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440010',
      category: 'Education & Learning',
      surveyHeadline: 'Wie sollte unser internes Training verbessert werden?',
      endDate: new Date('2026-09-28'),
      description: 'Welche Veränderungen würden unsere internen Trainings für dich besser machen?',
      isActive: true,
      questions: [],
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440011',
      category: 'Lifestyle & Preferences',
      surveyHeadline: 'Welche Arbeitsumgebung bevorzugst du?',
      endDate: new Date('2026-10-01'),
      description:
        'Wir möchten herausfinden, welche Arbeitsumgebung für dich am angenehmsten und produktivsten ist.',
      isActive: true,
      questions: [],
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440012',
      category: 'Technology & Innovation',
      surveyHeadline: 'Welche digitalen Tools erleichtern deinen Arbeitsalltag?',
      endDate: new Date('2026-10-03'),
      description:
        'Welche digitalen Werkzeuge möchtest du in deinem Arbeitsalltag nicht mehr missen?',
      isActive: true,
      questions: [],
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440013',
      category: 'Team Activities',
      surveyHeadline: 'Wie oft sollten gemeinsame Aktivitäten stattfinden?',
      endDate: new Date('2026-10-05'),
      description: 'Wie häufig sollten gemeinsame Aktivitäten und Teamevents angeboten werden?',
      isActive: true,
      questions: [],
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440014',
      category: 'Health & Wellness',
      surveyHeadline: 'Wie wichtig ist dir ein gesunder Arbeitsplatz?',
      endDate: new Date('2026-10-08'),
      description:
        'Wie wichtig sind dir ergonomische und gesundheitsfördernde Bedingungen am Arbeitsplatz?',
      isActive: true,
      questions: [],
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440015',
      category: 'Gaming & Entertainment',
      surveyHeadline: 'Welche Unterhaltungsmöglichkeiten wünschst du dir?',
      endDate: new Date('2026-10-10'),
      description: 'Welche zusätzlichen Unterhaltungsangebote würdest du dir wünschen?',
      isActive: true,
      questions: [],
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440016',
      category: 'Education & Learning',
      surveyHeadline: 'Welche neuen Lernformate würdest du ausprobieren?',
      endDate: new Date('2026-10-12'),
      description: 'Welche modernen Lernformate würdest du gerne einmal ausprobieren?',
      isActive: true,
      questions: [],
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440017',
      category: 'Lifestyle & Preferences',
      surveyHeadline: 'Welche Benefits sind dir besonders wichtig?',
      endDate: new Date('2026-10-15'),
      description:
        'Welche zusätzlichen Benefits sind für dich im Arbeitsumfeld besonders interessant?',
      isActive: true,
      questions: [],
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440018',
      category: 'Technology & Innovation',
      surveyHeadline: 'Wie offen bist du für neue Technologien?',
      endDate: new Date('2026-07-18'),
      description: 'Wie offen stehst du neuen Technologien und digitalen Veränderungen gegenüber?',
      isActive: true,
      questions: [],
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440019',
      category: 'Team Activities',
      surveyHeadline: 'Welche gemeinsame Aktivität sollten wir als Nächstes planen?',
      endDate: new Date('2026-10-20'),
      description:
        'Welche gemeinsame Aktivität würdest du gerne als Nächstes mit dem Team erleben?',
      isActive: true,
      questions: [],
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440020',
      category: 'Health & Wellness',
      surveyHeadline: 'Welche Gesundheitsangebote würdest du nutzen?',
      endDate: new Date('2026-10-22'),
      description:
        'Welche Gesundheitsangebote wären für dich im Arbeitsalltag besonders hilfreich?',
      isActive: true,
      questions: [],
    },
  ]);
}
