import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Subject, mergeMap, tap } from 'rxjs';
import { Bet } from 'src/app/services/bet/bet.service';
import { Bid, BidService } from 'src/app/services/bid/bid.service';
import { CartItem, CartService } from 'src/app/services/cart/cart.service';
import { MarketplaceEvent } from 'src/app/services/marketplace/marketplace.service';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';
import { LeagueUser } from 'src/app/services/user/user.service';
import { logos } from 'src/app/util/logos';
import { EventComponent, Team } from '../event/event.component';

@Component({
  selector: 'app-competitor',
  templateUrl: './competitor.component.html',
  styleUrls: ['./competitor.component.scss'],
  providers: [ConfirmationService],
})
export class CompetitorComponent implements OnInit {
  @Input() event?: MarketplaceEvent;
  @Input() isFavorite = false;

  @Input() cartItem?: CartItem;
  @Input() bet?: Bet;

  @Input() leagueUsers?: { [key: string]: LeagueUser };
  amount = 0;
  team?: Team;

  @Output() reload = new EventEmitter<boolean>();

  editFlag = false;
  updateAmount = 0;
  updateBidSubject = new Subject<Bid>();
  save$ = this.updateBidSubject.asObservable().pipe(
    mergeMap((bid) => this.bidService.update(bid)),
    tap(() => {
      this.reload.emit(true);
    })
  );

  cartAmounts: { [key: string]: number } = {};

  constructor(
    private cartService: CartService,
    private router: Router,
    private bidService: BidService,
    private spinner: SpinnerService
  ) {}
  ngOnInit(): void {
    this.team = EventComponent.getTeam(this.isFavorite, {
      event: this.event,
      bet: this.bet,
    });
  }

  select() {
    if (this.event) {
      this.cartService.addCartItem({
        chosenTeam: this.team!.name,
        event: {
          awayTeam: this.event.awayTeam,
          homeTeam: this.event.homeTeam,
          spread: this.event.spread,
          date: this.event.date,
          kind: this.event.kind,
          awayAmount: 0,
          homeAmount: 0,
          week: this.event.week,
          awayAbbreviation: this.event.awayAbbreviation,
          homeAbbreviation: this.event.homeAbbreviation,
        },
      });
    }
  }

  getLogo(team: string) {
    return logos[team];
  }

  handleBetChange(event: number) {
    this.cartService.addCartItem({
      ...this.cartItem,
      amountChange: true,
      amount: event,
    });
  }

  deleteBid() {
    const bet = this.bet!;
    this.spinner.turnOn();
    console.log('b', bet);
    this.updateBidSubject.next({
      ...bet,
      amount: bet.amount,
      chosenCompetitor: bet.awayUser ? bet.awayTeam : bet.homeTeam,
      week: parseInt(bet.week),
      createDate: bet.createDate,
      div: bet.div,
      user: bet.awayUser || bet.homeUser,
    });
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
