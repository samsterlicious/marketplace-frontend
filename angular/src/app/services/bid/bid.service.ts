import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MarketplaceEvent } from '../marketplace/marketplace.service';

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

  getByEvent(kind: string, date: Date, awayTeam: string, homeTeam: string) {
    return this.httpClient.get<Bid[]>(
      `${this.baseUrl}/event/${kind}|${date
        .toISOString()
        .replace(/\.\d{3}Z$/, 'Z')}|${awayTeam}|${homeTeam}`
    );
  }
}

type CreateResponse = {
  event: MarketplaceEvent;
  message: string;
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
};
