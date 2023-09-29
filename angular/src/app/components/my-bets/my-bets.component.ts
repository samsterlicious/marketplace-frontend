import { Component } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  mergeMap,
  tap,
} from 'rxjs';
import { Bet, BetService } from 'src/app/services/bet/bet.service';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-my-bets',
  templateUrl: './my-bets.component.html',
  styleUrls: ['./my-bets.component.scss'],
})
export class MyBetsComponent {
  bets$: Observable<Bet[]>;
  reloadSubject = new BehaviorSubject<string>('initial');

  constructor(
    public userService: UserService,
    private betService: BetService,
    private spinner: SpinnerService
  ) {
    spinner.turnOn();
    console.log('hissss');
    this.bets$ = this.reloadSubject.asObservable().pipe(
      tap((val) => console.log('new value', val)),
      mergeMap(() => betService.getByUser()),
      tap(() => {
        spinner.turnOff();
        console.log('hi');
      })
    );

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

  reloadPage(bool: boolean) {
    console.log('wassssup');
    this.spinner.turnOn();
    this.reloadSubject.next('reload');
  }

  changeSelectedWeek(week: any) {
    this.selectedWeekSubject.next(week.value.code);
  }

  weeks: Week[] = [];
  selectedWeek: Week;
  selectedWeekSubject: ReplaySubject<string>;
  betsByWeek$: Observable<Bet[]>;
}

type Week = {
  name: string;
  code: string;
};
