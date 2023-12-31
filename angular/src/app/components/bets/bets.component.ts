import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, ReplaySubject, mergeMap, tap } from 'rxjs';
import { Bet, BetService } from 'src/app/services/bet/bet.service';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-bets',
  templateUrl: './bets.component.html',
  styleUrls: ['./bets.component.scss'],
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BetsComponent {
  weeks: Week[] = [];
  selectedWeek: Week;
  selectedWeekSubject: ReplaySubject<string>;
  betsByWeek$: Observable<Bet[]>;
  constructor(
    private betService: BetService,
    public userService: UserService,
    private spinner: SpinnerService
  ) {
    for (let i = 2; i > 0; i--) {
      this.weeks[2 - i] = { name: `Week ${i}`, code: `${i}` };
    }

    this.selectedWeek = this.weeks[0];
    this.selectedWeekSubject = new ReplaySubject<string>(1);
    this.betsByWeek$ = this.selectedWeekSubject.asObservable().pipe(
      tap(() => this.spinner.turnOn()),
      //@TODO fix league parameter
      mergeMap((week) =>
        this.betService.getByWeek(
          week,
          userService.betUserSubject.value!.league
        )
      ),
      tap(() => this.spinner.turnOff())
    );

    this.selectedWeekSubject.next(this.weeks[0].code);
  }

  changeSelectedWeek(week: any) {
    this.selectedWeekSubject.next(week.value.code);
  }
}

type Week = {
  name: string;
  code: string;
};
