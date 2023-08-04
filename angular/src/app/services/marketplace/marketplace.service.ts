import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MarketplaceService {
  baseUrl = `${environment.api.url}/marketplace`;
  constructor(private httpClient: HttpClient) {}

  get(): Observable<MarketplaceMap | undefined> {
    return this.httpClient.get<MarketplaceEvent[]>(this.baseUrl).pipe(
      map((events) => {
        if (events.length < 1) return;
        const map: MarketplaceMap = {};
        events.forEach((event) => {
          const existingSport = map[event.sport];
          if (existingSport) {
            const existingLeague = existingSport[event.league];
            if (existingLeague) {
              existingLeague.push(event);
            } else {
              existingSport[event.league] = [event];
            }
          } else {
            map[event.sport] = {
              [event.league]: [event],
            };
          }
        });

        return map;
      })
    );
  }
}

export type MarketplaceMap = {
  [key: string]: Sport;
};

type Sport = {
  [key: string]: MarketplaceEvent[];
};

export type MarketplaceEvent = {
  name: string;
  awayCompetitor: string;
  homeCompetitor: string;
  date: Date;
  sport: string;
  league: string;
  awayLogo: string;
  homeLogo: string;
  spread: string;
};
