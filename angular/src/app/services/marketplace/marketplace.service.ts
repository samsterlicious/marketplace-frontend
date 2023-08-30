import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MarketplaceService {
  baseUrl = `${environment.api.url}/marketplace`;

  constructor(private httpClient: HttpClient) {}

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
};
