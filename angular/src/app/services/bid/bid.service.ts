import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Bet } from '../bet/bet.service';

@Injectable({
  providedIn: 'root',
})
export class BidService {
  baseUrl = `${environment.api.url}/bid`;

  constructor(private httpClient: HttpClient) {}

  create(bid: Bid[]): Observable<CreateResponse> {
    return this.httpClient.post<CreateResponse>(this.baseUrl, bid);
  }

  getByUser(): Observable<Bid[]> {
    return this.httpClient.get<Bid[]>(this.baseUrl);
  }

  update(bid: Bid): Observable<any> {
    return this.httpClient.put<any>(this.baseUrl, bid);
  }

  getByEvent(
    kind: string,
    date: Date,
    awayTeam: string,
    homeTeam: string
  ): Observable<Bid[]> {
    return this.httpClient.get<Bid[]>(
      `${this.baseUrl}/event/${kind}|${date
        .toISOString()
        .replace(/\.\d{3}Z$/, 'Z')}|${awayTeam}|${homeTeam}`
    );
  }
}

type CreateResponse = {
  [key: string]: Bet;
};

export type Bid = {
  kind: string;
  awayTeam: string;
  homeTeam: string;
  chosenCompetitor: string;
  spread: string;
  amount: number;
  date: Date;
  createDate?: Date;
  user?: string;
  week: number;
  homeAbbreviation?: string;
  awayAbbreviation?: string;
  div: string;
};
