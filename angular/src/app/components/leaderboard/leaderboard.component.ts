import { Component } from '@angular/core';
import { Observable, map, mergeMap, tap } from 'rxjs';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';
import { BetUser, UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent {
  $users: Observable<BetUser[]>;

  constructor(
    private spinner: SpinnerService,
    public userService: UserService
  ) {
    this.spinner.turnOn();

    this.$users = this.userService.betUser$.pipe(
      mergeMap((user) =>
        this.userService.getLeaderboard(user!.league).pipe(
          map((users) => {
            users.sort((u1, u2) => u2.total - u1.total);
            return users;
          }),
          tap(() => this.spinner.turnOff())
        )
      )
    );
  }
}
