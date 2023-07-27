import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EspnService {
  espnBaseUrl = 'https://site.web.api.espn.com/apis/v2/scoreboard/header';

  constructor(private httpClient: HttpClient) {}

  loadSports(): Observable<EspnSport[]> {
    return this.httpClient
      .get<EspnResponse>(this.espnBaseUrl)
      .pipe(map((resp) => resp.sports));
  }
}

type EspnResponse = {
  sports: EspnSport[];
};

export type EspnSport = {
  name: string;
  logos: EspnLogo[];
  leagues: EspnLeague[];
};

type EspnLogo = {
  href: string;
};

type EspnLeague = {
  name: string;
  abbreviation: string;
  events: EspnEvent[];
};

type EspnEvent = {
  name: string;
  shortName: string;
  date: Date;
  odds: EspnOdds;
  status: string;
  competitors: EspnCompetitor[];
};

type EspnCompetitor = {
  name: string;
  homeAway: HomeAway;
  winner: boolean;
};

type EspnOdds = {
  details: string;
};

enum HomeAway {
  AWAY = 'away',
  HOME = 'home',
}
