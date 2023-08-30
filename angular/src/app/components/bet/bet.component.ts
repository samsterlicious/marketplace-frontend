import { Component, Input } from '@angular/core';
import { Bet } from 'src/app/services/bet/bet.service';
import { logos } from 'src/app/util/logos';

@Component({
  selector: 'app-bet',
  templateUrl: './bet.component.html',
  styleUrls: ['./bet.component.scss'],
})
export class BetComponent {
  @Input()
  bet!: Bet;

  getLogo(team: string) {
    return logos[team];
  }
}
