import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { CartService } from 'src/app/services/cart/cart.service';
import { MarketplaceEvent } from 'src/app/services/marketplace/marketplace.service';
import { logos } from 'src/app/util/logos';

@Component({
  selector: 'app-competitor',
  templateUrl: './competitor.component.html',
  styleUrls: ['./competitor.component.scss'],
  providers: [ConfirmationService],
})
export class CompetitorComponent implements OnInit {
  @Input() event!: MarketplaceEvent;
  @Input() isFavorite = false;

  @Input() selectDisabled = false;
  @Input() selected = false;

  amount = 0;
  team?: Team;

  constructor(private cartService: CartService, private router: Router) {}
  ngOnInit(): void {
    this.team = this.getTeam();
  }

  select() {
    if (this.selectDisabled) {
      return;
    }
    // this.cartService.addCartItem({
    //   chosenTeam: this.team,
    //   event: {
    //     awayTeam: this.awayTeam,
    //     homeTeam: this.homeTeam,
    //     spread: this.spread,
    //     date: this.date,
    //     kind: this.kind,
    //     awayAmount: 0,
    //     homeAmount: 0,
    //   },
    // });
  }

  getLogo(team: string) {
    return logos[team];
  }

  getTeam(): Team | undefined {
    console.log('dsfsd', this.event);
    const event = this.event;
    const regex = /^(\S+)\s+(\S+).*/i;
    const match = event.spread.match(regex);
    //away is favorited team
    if (!match) return;

    if (match[1] === event.awayAbbreviation) {
      if (this.isFavorite) {
        //i'm a favorite
        return {
          abbreviatedName: event.awayAbbreviation,
          name: event.awayTeam,
          totalAmount: event.awayAmount,
          record: event.awayRecord,
          points: parseFloat(match[2]),
        };
      } else {
        return {
          abbreviatedName: event.homeAbbreviation,
          name: event.homeTeam,
          totalAmount: event.homeAmount,
          record: event.homeRecord,
          points: parseFloat(match[2]),
        };
      }
    }
    // home is favorite
    if (this.isFavorite) {
      return {
        abbreviatedName: event.homeAbbreviation,
        name: event.homeTeam,
        totalAmount: event.homeAmount,
        record: event.homeRecord,
        points: parseFloat(match[2]),
      };
    } else {
      return {
        abbreviatedName: event.awayAbbreviation,
        name: event.awayTeam,
        totalAmount: event.awayAmount,
        record: event.awayRecord,
        points: parseFloat(match[2]),
      };
    }
  }

  getPoints(): string {
    if (this.isFavorite) {
      return `${this.team!.points}`;
    } else if (this.team!.points != 0) {
      return `+${this.team!.points * -1}`;
    }
    return `${this.team!.points}`;
  }
}

type Team = {
  abbreviatedName: string;
  name: string;
  record: string;
  totalAmount: number;
  points: number;
};
