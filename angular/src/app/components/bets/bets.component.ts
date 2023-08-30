import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable, combineLatest, tap } from 'rxjs';
import { Bet, BetService } from 'src/app/services/bet/bet.service';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';

@Component({
  selector: 'app-bets',
  templateUrl: './bets.component.html',
  styleUrls: ['./bets.component.scss'],
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BetsComponent {
  view$: Observable<View>;
  constructor(
    private betService: BetService,
    private route: ActivatedRoute,
    private spinner: SpinnerService
  ) {
    spinner.turnOn();
    this.route.queryParams.subscribe((params) => {});
    this.view$ = combineLatest({
      myBets: betService.getByUser(),
      recentBets: betService.getByDate(
        new Date().toISOString().replace(/T.+/, '').replace(/\-/g, '')
      ),
    }).pipe(tap(() => spinner.turnOff()));
  }
}

type View = {
  myBets: Bet[];
  recentBets: Bet[];
};
