import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  map,
  mergeMap,
  tap,
} from 'rxjs';
import { BidService } from 'src/app/services/bid/bid.service';
import { CartService } from 'src/app/services/cart/cart.service';
import {
  MarketplaceEvent,
  MarketplaceMap,
  MarketplaceService,
} from 'src/app/services/marketplace/marketplace.service';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService],
})
export class HomeComponent implements OnInit {
  view$: Observable<HomeView>;

  message: any;

  showCart = new BehaviorSubject(false);
  showCart$ = this.showCart.asObservable();

  cart$;

  loadPage = new BehaviorSubject<string>('');

  constructor(
    private cart: CartService,
    private bidService: BidService,
    private marketplaceService: MarketplaceService,
    private spinner: SpinnerService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.cart$ = cart.cart$;
    this.message = router.getCurrentNavigation()?.extras.state?.['message'];
    spinner.turnOn();
    this.view$ = this.loadPage.asObservable().pipe(
      mergeMap(() => {
        return combineLatest({
          myBids: this.bidService.getByUser().pipe(
            map((bids) => {
              let ret: {
                [key: string]: { chosenCompetitor: string; amount: number };
              } = {};
              bids.forEach((bid) => {
                let existingBid =
                  ret[
                    `${bid.kind}|${bid.date}|${bid.awayTeam}|${bid.homeTeam}`
                  ];
                if (existingBid) {
                  existingBid.amount += bid.amount;
                } else {
                  ret[
                    `${bid.kind}|${bid.date}|${bid.awayTeam}|${bid.homeTeam}`
                  ] = {
                    chosenCompetitor: bid.chosenCompetitor,
                    amount: bid.amount,
                  };
                }
              });
              return ret;
            })
          ),
          marketplaceMap: this.marketplaceService.get().pipe(
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
            }),
            tap((m) => console.log('m', m))
          ),
        });
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

  getCartKey(event: MarketplaceEvent, homeOrAway: string) {
    return CartService.getKeyFromEvent(
      event,
      homeOrAway === 'home' ? event.homeTeam : event.awayTeam
    );
  }

  toggleCart(event: boolean) {
    if (event) {
      this.showCart.next(false);
    } else {
      this.showCart.next(true);
    }
  }

  reloadPage(event: string) {
    this.loadPage.next(event);
  }
}

type HomeView = {
  myBids: { [key: string]: { chosenCompetitor: string; amount: number } };
  marketplaceMap: MarketplaceMap | undefined;
};
