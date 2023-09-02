import { Component } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';
import { BetUser, UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent {
  view$: Observable<BetUser[]>;

  constructor(spinner: SpinnerService, userService: UserService) {
    this.view$ = userService.getLeaderboard().pipe(
      tap(() => spinner.turnOff()),
      map((resp) => {
        resp.sort((a, b) => {
          return b.total - a.total;
        });
        return resp;
      })
    );
  }
}
