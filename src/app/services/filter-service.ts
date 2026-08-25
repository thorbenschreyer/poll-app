import { Injectable, signal } from '@angular/core';
import { Survey } from '../interfaces/survey';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  pastSurvey = signal(false);
  activeSurvey = signal(true);
  

  filterByCategory(category: string, newList: Survey[]) {
    if (category == 'All Surveys') {
      return newList;
    } else {
      return newList.filter((survey) => survey.category == category);
    }
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
      id: 1,
      category: 'Team Activities',
      surveyHeadline: 'Wie zufrieden bist du mit unseren Teamevents?',
      endDate: new Date('2026-09-05'),
      isActive: true,
      surveyEnds: 0
    },
    {
      id: 2,
      category: 'Health & Wellness',
      surveyHeadline: 'Wie wichtig ist dir Bewegung im Arbeitsalltag?',
      endDate: new Date('2026-09-08'),
      isActive: true,
      surveyEnds: 0
    },
    {
      id: 3,
      category: 'Gaming & Entertainment',
      surveyHeadline: 'Welches Gaming-Genre bevorzugst du?',
      endDate: new Date('2026-09-10'),
      isActive: true,
      surveyEnds: 0
    },
    {
      id: 4,
      category: 'Education & Learning',
      surveyHeadline: 'Welche Weiterbildung interessiert dich am meisten?',
      endDate: new Date('2026-09-12'),
      isActive: true,
      surveyEnds: 0
    },
    {
      id: 5,
      category: 'Lifestyle & Preferences',
      surveyHeadline: 'Wie wichtig ist dir eine flexible Arbeitszeit?',
      endDate: new Date('2026-09-15'),
      isActive: true,
      surveyEnds: 0
    },
    {
      id: 6,
      category: 'Technology & Innovation',
      surveyHeadline: 'Welche Technologie sollte stärker eingesetzt werden?',
      endDate: new Date('2026-09-18'),
      isActive: true,
      surveyEnds: 0
    },
    {
      id: 7,
      category: 'Team Activities',
      surveyHeadline: 'Welches Teamevent würdest du gerne besuchen?',
      endDate: new Date('2026-09-20'),
      isActive: true,
      surveyEnds: 0
    },
    {
      id: 8,
      category: 'Health & Wellness',
      surveyHeadline: 'Wie gut findest du unsere aktuellen Gesundheitsangebote?',
      endDate: new Date('2026-09-22'),
      isActive: true,
      surveyEnds: 0
    },
    {
      id: 9,
      category: 'Gaming & Entertainment',
      surveyHeadline: 'Welches Spiel sollte beim nächsten Spieleabend gespielt werden?',
      endDate: new Date('2026-09-25'),
      isActive: true,
      surveyEnds: 0
    },
    {
      id: 10,
      category: 'Education & Learning',
      surveyHeadline: 'Wie sollte unser internes Training verbessert werden?',
      endDate: new Date('2026-09-28'),
      isActive: true,
      surveyEnds: 0
    },
    {
      id: 11,
      category: 'Lifestyle & Preferences',
      surveyHeadline: 'Welche Arbeitsumgebung bevorzugst du?',
      endDate: new Date('2026-10-01'),
      isActive: true,
      surveyEnds: 0
    },
    {
      id: 12,
      category: 'Technology & Innovation',
      surveyHeadline: 'Welche digitalen Tools erleichtern deinen Arbeitsalltag?',
      endDate: new Date('2026-10-03'),
      isActive: true,
      surveyEnds: 0
    },
    {
      id: 13,
      category: 'Team Activities',
      surveyHeadline: 'Wie oft sollten gemeinsame Aktivitäten stattfinden?',
      endDate: new Date('2026-10-05'),
      isActive: false,
      surveyEnds: 0
    },
    {
      id: 14,
      category: 'Health & Wellness',
      surveyHeadline: 'Wie wichtig ist dir ein gesunder Arbeitsplatz?',
      endDate: new Date('2026-10-08'),
      isActive: false,
      surveyEnds: 0
    },
    {
      id: 15,
      category: 'Gaming & Entertainment',
      surveyHeadline: 'Welche Unterhaltungsmöglichkeiten wünschst du dir?',
      endDate: new Date('2026-10-10'),
      isActive: false,
      surveyEnds: 0
    },
    {
      id: 16,
      category: 'Education & Learning',
      surveyHeadline: 'Welche neuen Lernformate würdest du ausprobieren?',
      endDate: new Date('2026-10-12'),
      isActive: false,
      surveyEnds: 0
    },
    {
      id: 17,
      category: 'Lifestyle & Preferences',
      surveyHeadline: 'Welche Benefits sind dir besonders wichtig?',
      endDate: new Date('2026-10-15'),
      isActive: false,
      surveyEnds: 0
    },
    {
      id: 18,
      category: 'Technology & Innovation',
      surveyHeadline: 'Wie offen bist du für neue Technologien?',
      endDate: new Date('2026-07-18'),
      isActive: false,
      surveyEnds: 0
    },
    {
      id: 19,
      category: 'Team Activities',
      surveyHeadline: 'Welche gemeinsame Aktivität sollten wir als Nächstes planen?',
      endDate: new Date('2026-10-20'),
      isActive: false,
      surveyEnds: 0
    },
    {
      id: 20,
      category: 'Health & Wellness',
      surveyHeadline: 'Welche Gesundheitsangebote würdest du nutzen?',
      endDate: new Date('2026-10-22'),
      isActive: false,
      surveyEnds: 0
    },
  ]);
}
