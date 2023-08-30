import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BetService {
  baseUrl = `${environment.api.url}/bet`;

  constructor(private httpClient: HttpClient) {}

  getByUser() {
    return this.httpClient.get<Bet[]>(this.baseUrl);
  }

  getByDate(date: string) {
    return this.httpClient.get<Bet[]>(`${this.baseUrl}/date/${date}`);
  }
}

export type Bet = {
  awayUser: string;
  homeUser: string;
  amount: number;
  awayTeam: string;
  homeTeam: string;
  status: string;
  spread: string;
  kind: string;
  date: Date;
};
