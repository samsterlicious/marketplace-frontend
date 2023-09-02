import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = `${environment.api.url}/user`;

  betUser$: Observable<BetUser>;
  betUser?: BetUser;

  constructor(auth: AuthService, private httpClient: HttpClient) {
    this.betUser$ = httpClient.get<BetUser>(this.baseUrl).pipe(
      tap((user) => {
        this.betUser = user;
      })
    );
  }

  getLeaderboard(): Observable<BetUser[]> {
    return this.httpClient.get<BetUser[]>(`${environment.api.url}/leaderboard`);
  }

  getMyOutcomes(): Observable<Outcome[]> {
    return this.httpClient
      .get<ApiOutcome[]>(`${environment.api.url}/my-outcomes`)
      .pipe(
        map((outcomes) => {
          return outcomes.map((outcome) => {
            let mappedOutcome: Outcome = {
              user:
                outcome.winner === this.betUser!.email
                  ? outcome.loser
                  : outcome.winner,
              amount:
                outcome.winner === this.betUser!.email
                  ? outcome.amount
                  : -1 * outcome.amount,
              eventId: outcome.eventId,
              week: outcome.week,
            };

            return mappedOutcome;
          });
        })
      );
  }
}

export type BetUser = {
  email: string;
  total: number;
};

export type ApiOutcome = {
  winner: string;
  loser: string;
  eventId: string;
  week: string;
  amount: number;
  id: string;
};

export type Outcome = {
  user: string;
  eventId: string;
  week: string;
  amount: number;
};
