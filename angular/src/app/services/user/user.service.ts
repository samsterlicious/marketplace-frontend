import { Injectable } from '@angular/core';
import { AuthService, IdToken, User } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  creds$: Observable<IdToken | null | undefined>;
  user$: Observable<User | null | undefined>;

  constructor(auth: AuthService) {
    this.creds$ = auth.idTokenClaims$;
    this.user$ = auth.user$;
  }
}
