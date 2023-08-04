import { Component } from '@angular/core';
import { AuthService, User } from '@auth0/auth0-angular';
import { Observable, tap } from 'rxjs';
import {
  MarketplaceMap,
  MarketplaceService,
} from 'src/app/services/marketplace/marketplace.service';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  auth$: Observable<User | null | undefined>;
  marketplaceMap$: Observable<MarketplaceMap | undefined>;
  constructor(
    auth: AuthService,
    marketplaceService: MarketplaceService,
    spinner: SpinnerService
  ) {
    this.auth$ = auth.user$;
    spinner.turnOn();
    this.marketplaceMap$ = marketplaceService
      .get()
      .pipe(tap(() => spinner.turnOff()));
  }
}
