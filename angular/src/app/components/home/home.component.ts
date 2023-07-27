import { Component } from '@angular/core';
import { AuthService, User } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { EspnService, EspnSport } from 'src/app/services/espn/espn.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  auth$: Observable<User | null | undefined>;
  espnSports$: Observable<EspnSport[]>;
  constructor(auth: AuthService, espn: EspnService) {
    this.auth$ = auth.user$;
    this.espnSports$ = espn.loadSports();
  }
}
