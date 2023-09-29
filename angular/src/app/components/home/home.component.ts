import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  map,
  mergeMap,
  of,
  tap,
} from 'rxjs';
import { Bid, BidService } from 'src/app/services/bid/bid.service';
import { Cart, CartService } from 'src/app/services/cart/cart.service';
import {
  MarketplaceEvent,
  MarketplaceMap,
  MarketplaceService,
} from 'src/app/services/marketplace/marketplace.service';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';
import { BetUser, UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService],
})
export class HomeComponent implements OnInit {
  view$: Observable<MarketplaceMap>;

  message: any;

  betUser$: Observable<BetUser[]>;
  newUsername = '';

  showCart = new BehaviorSubject(false);
  showCart$ = this.showCart.asObservable();

  cart$;

  loadPage = new BehaviorSubject<string>('');

  constructor(
    public cartService: CartService,
    private bidService: BidService,
    private marketplaceService: MarketplaceService,
    private spinner: SpinnerService,
    public userService: UserService,
    private messageService: MessageService,
    private myRouter: Router
  ) {
    this.betUser$ = userService.getBetUser$;

    this.save$ = this.saveSubject.asObservable().pipe(
      tap((name) => console.log(name)),
      mergeMap((name) =>
        this.userService
          .updateName(this.userService.betUserSubject.value!.league, name)
          .pipe(catchError(() => of('error')))
      ),
      tap((resp) => {
        this.spinner.turnOff();
        if (resp === 'error') {
        } else {
          userService.visible = false;
          this.userService.leagueUsersSubject.next(
            this.userService.betUserSubject.value!.league
          );
        }
      })
    );

    this.cart$ = cartService.cart$;
    spinner.turnOn();
    this.view$ = this.loadPage.asObservable().pipe(
      mergeMap(() => {
        return this.marketplaceService.get().pipe(
          map((events) => {
            if (events.length < 1) return {};
            const map: MarketplaceMap = {};
            events.forEach((event) => {
              const existingKind = map[event.kind];
              if (existingKind) {
                existingKind.push(event);
              } else {
                map[event.kind] = [event];
              }
            });
            return map;
          })
        );
      }),
      tap(() => spinner.turnOff())
    );
  }

  ngOnInit(): void {}

  getBid(
    map: { [key: string]: { chosenCompetitor: string; amount: number } },
    kind: string,
    date: Date,
    awayTeam: string,
    homeTeam: string
  ): { chosenCompetitor: string; amount: number } {
    return map[`${kind}|${date}|${awayTeam}|${homeTeam}`];
  }

  getSelectedTeam(event: MarketplaceEvent, cart: Cart): string {
    const item = cart[CartService.getKeyFromEvent(event)];
    return item ? item.chosenTeam! : '';
  }

  submit(cart: Cart) {
    const bids: Bid[] = Object.entries(cart).map(([eventKey, cartItem]) => {
      const event = cartItem.event!;
      return {
        amount: cartItem.amount!,
        kind: event.kind,
        awayTeam: event.awayTeam,
        homeTeam: event.homeTeam,
        chosenCompetitor: cartItem.chosenTeam!,
        spread: event.spread,
        date: event.date,
        week: event.week,
        awayAbbreviation: event.awayAbbreviation,
        homeAbbreviation: event.homeAbbreviation,
        div: this.userService.betUserSubject.value!.league,
      };
    });
    this.spinner.turnOn();
    this.bidService.create(bids).subscribe({
      next: (betResponse) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `${Object.values(betResponse).length} bets created!`,
        });
        // this.reloadPage('success');
        this.cartService.clear();
        this.myRouter.navigate(['bets']);
      },
      error: (_err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An issue occurred during submission. Please contact Keith',
        });
        this.spinner.turnOff();
      },
    });
  }

  saveSubject = new Subject<string>();
  save$: Observable<string>;
  save() {
    this.userService.nameError = false;
    this.spinner.turnOn();
    this.saveSubject.next(this.newUsername);
  }

  reloadPage(event: string) {
    this.loadPage.next(event);
  }
}
