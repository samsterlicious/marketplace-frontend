import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-game-display',
  templateUrl: './game-display.component.html',
  styleUrls: ['./game-display.component.scss'],
})
export class GameDisplayComponent {
  @Input() awayTeam = '';
  @Input() homeTeam = '';
  @Input() amount = 0;
  @Input() isHome = true;
  @Input() team = '';
  @Input() spread = '';
  @Input() kind = '';
  @Input() date = new Date();
  @Input() myAmount = 0;
  @Input() chosenCompetitor = '';

  @Output() onClick = new EventEmitter<number>();

  click() {
    this.onClick.emit(this.amount);
  }
}
