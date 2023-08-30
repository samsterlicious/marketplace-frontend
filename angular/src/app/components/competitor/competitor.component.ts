import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { CartService } from 'src/app/services/cart/cart.service';
import { logos } from 'src/app/util/logos';

@Component({
  selector: 'app-competitor',
  templateUrl: './competitor.component.html',
  styleUrls: ['./competitor.component.scss'],
  providers: [ConfirmationService],
})
export class CompetitorComponent {
  @Input() awayTeam = '';
  @Input() homeTeam = '';
  @Input() amount = 0;
  @Input() isHome = true;
  @Input() team = '';
  @Input() spread = '';
  @Input() kind = '';
  @Input() date = new Date();
  @Input() myAmount = 0;
  @Input() selectDisabled = false;
  @Input() selected = false;

  constructor(private cartService: CartService, private router: Router) {}

  select() {
    if (this.selectDisabled) {
      return;
    }
    this.cartService.addCartItem({
      chosenTeam: this.team,
      event: {
        awayTeam: this.awayTeam,
        homeTeam: this.homeTeam,
        spread: this.spread,
        date: this.date,
        kind: this.kind,
        awayAmount: 0,
        homeAmount: 0,
      },
    });
  }

  getLogo(team: string) {
    return logos[team];
  }
}
