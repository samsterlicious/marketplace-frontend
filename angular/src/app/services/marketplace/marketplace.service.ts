import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, mergeMap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MarketplaceService {
  baseUrl = `${environment.api.url}/marketplace`;

  constructor(private httpClient: HttpClient) {}

  private eventSubject = new Subject<string>();
  eventInfo$ = this.eventSubject.asObservable().pipe(
    mergeMap((id) =>
      this.httpClient.get(`${environment.api.url}/espn-info`, {
        params: {
          eventId: id,
        },
      })
    )
  );

  getEventInfo(id: string) {
    this.eventSubject.next(id);
  }

  get(): Observable<MarketplaceEvent[]> {
    return this.httpClient.get<MarketplaceEvent[]>(this.baseUrl);
  }

  static areEqualEvents(
    eventOne: MarketplaceEvent,
    eventTwo: MarketplaceEvent
  ): boolean {
    if (
      eventOne.kind === eventTwo.kind &&
      eventOne.date === eventTwo.date &&
      eventOne.awayTeam === eventTwo.awayTeam &&
      eventOne.homeTeam === eventTwo.homeTeam
    )
      return true;
    return false;
  }
}

export type MarketplaceMap = {
  [key: string]: MarketplaceEvent[];
};

export type MarketplaceEvent = {
  awayTeam: string;
  homeTeam: string;
  date: Date;
  kind: string;
  spread: string;
  homeAmount: number;
  awayAmount: number;
  homeRecord?: string;
  awayRecord?: string;
  awayAbbreviation?: string;
  homeAbbreviation?: string;
  week: number;
  id?: string;
};
