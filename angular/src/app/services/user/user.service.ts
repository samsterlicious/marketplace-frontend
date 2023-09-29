import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  map,
  mergeMap,
  tap,
} from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = `${environment.api.url}/user`;

  getBetUser$: Observable<BetUser[]>;
  betUserSubject = new BehaviorSubject<BetUser | undefined>(undefined);
  betUser$ = this.betUserSubject.asObservable();
  nameError = false;
  visible = false;

  leagueUsersSubject = new ReplaySubject<string>(1);
  leagueUsers$: Observable<{ [key: string]: LeagueUser }>;

  constructor(auth: AuthService, private httpClient: HttpClient) {
    this.getBetUser$ = httpClient.get<BetUser[]>(this.baseUrl).pipe(
      tap((users) => {
        if (users.length > 1) {
          //multiple leagues
        } else {
          if (!users[0].name) {
            this.nameError = false;
            this.visible = true;
          }
          this.setUser(users[0]);
          this.leagueUsersSubject.next(users[0].league);
        }
      })
    );

    this.leagueUsers$ = this.leagueUsersSubject.asObservable().pipe(
      mergeMap((div) =>
        this.httpClient.get<LeagueUser[]>(
          `${environment.api.url}/league/users/${div}`
        )
      ),
      map((leagueUsers) => {
        const resp: { [key: string]: LeagueUser } = {};

        leagueUsers.forEach((user) => {
          resp[user.email] = user;
        });
        return resp;
      })
    );
  }

  setUser(user: BetUser) {
    console.log('set');
    this.betUserSubject.next(user);
  }

  getLeaderboard(league: string): Observable<BetUser[]> {
    return this.httpClient.get<BetUser[]>(
      `${environment.api.url}/league/users/${league}`
    );
  }

  updateName(div: string, name: string): Observable<string> {
    return this.httpClient.put<any>(`${this.baseUrl}`, {
      name,
      div,
    });
  }

  getMyOutcomes(): Observable<Outcome[]> {
    return this.httpClient
      .get<ApiOutcome[]>(`${environment.api.url}/my-outcomes`)
      .pipe(
        map((outcomes) => {
          return outcomes.map((outcome) => {
            let mappedOutcome: Outcome = {
              user:
                outcome.winner === this.betUserSubject.value!.email
                  ? outcome.loser
                  : outcome.winner,
              amount:
                outcome.winner === this.betUserSubject.value!.email
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
  name: string;
  league: string;
  email: string;
  total: number;
};

export type LeagueUser = {
  email: string;
  name: string;
  league: string;
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
