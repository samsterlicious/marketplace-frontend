import { Component } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { MarketplaceService } from 'src/app/services/marketplace/marketplace.service';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';
import { Outcome, UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-my-history',
  templateUrl: './my-history.component.html',
  styleUrls: ['./my-history.component.scss'],
})
export class MyHistoryComponent {
  view$: Observable<Outcome[]>;
  visible = false;
  eventInfo$: Observable<any>;

  constructor(
    private spinner: SpinnerService,
    userService: UserService,
    private marketplaceService: MarketplaceService
  ) {
    spinner.turnOn();
    this.view$ = userService.getMyOutcomes().pipe(tap(() => spinner.turnOff()));
    this.eventInfo$ = marketplaceService.eventInfo$.pipe(
      tap((resp: any) => {
        window.location.href = resp.sports[0].leagues[0].events[0].link;
      })
    );
  }

  getInfo(id: string) {
    this.spinner.turnOn();
    this.marketplaceService.getEventInfo(id);
  }
}
