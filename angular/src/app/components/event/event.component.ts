import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Bet } from 'src/app/services/bet/bet.service';
import { CartItem } from 'src/app/services/cart/cart.service';
import { MarketplaceEvent } from 'src/app/services/marketplace/marketplace.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventComponent implements OnInit {
  @Input()
  event!: MarketplaceEvent;

  @Input()
  cartItem?: CartItem;

  info = new BehaviorSubject<boolean>(false);
  info$ = this.info.asObservable();

  favAmount?: number;
  dogAmount?: number;

  constructor() {}
  ngOnInit(): void {
    this.favAmount = this.getTeam(true, { event: this.event })?.totalAmount;
    this.dogAmount = this.getTeam(false, { event: this.event })?.totalAmount;
  }

  toggleInfo() {
    if (this.info.getValue()) {
      this.info.next(false);
    } else {
      this.info.next(true);
    }
  }

  toggle(input: any) {
    this.info.next(false);
  }

  getTeam(
    isFavorite: boolean,
    params: { event?: MarketplaceEvent; bet?: Bet }
  ): Team | undefined {
    return EventComponent.getTeam(isFavorite, params);
  }

  static getTeam(
    isFavorite: boolean,
    params: { event?: MarketplaceEvent; bet?: Bet }
  ): Team | undefined {
    const event = (params.event ?? params.bet)!;
    const regex = /^(\S+)\s+(\S+).*/i;

    const match = event.spread.match(regex);
    console.log('match', match);
    console.log('b', params.bet);
    console.log('event', event);
    //away is favorited team
    if (!match) return;

    if (match[1] === event.awayAbbreviation) {
      if (isFavorite) {
        //i'm a favorite
        return {
          abbreviatedName: event.awayAbbreviation!,
          name: event.awayTeam,
          user: params.bet?.awayUser,
          totalAmount: params.event?.awayAmount,
          record: params.event?.awayRecord!,
          points: parseFloat(match[2]),
        };
      } else {
        return {
          abbreviatedName: event.homeAbbreviation!,
          name: event.homeTeam,
          user: params.bet?.homeUser,
          totalAmount: params.event?.homeAmount,
          record: params.event?.homeRecord!,
          points: parseFloat(match[2]),
        };
      }
    }
    // home is favorite
    if (isFavorite) {
      return {
        abbreviatedName: event.homeAbbreviation!,
        name: event.homeTeam,
        totalAmount: params.event?.homeAmount,
        user: params.bet?.homeUser,
        record: params.event?.homeRecord,
        points: parseFloat(match[2]),
      };
    } else {
      return {
        abbreviatedName: event.awayAbbreviation!,
        name: event.awayTeam,
        totalAmount: params.event?.awayAmount,
        user: params.bet?.awayUser,
        record: params.event?.awayRecord!,
        points: parseFloat(match[2]),
      };
    }
  }
}

export type Team = {
  abbreviatedName: string;
  name: string;
  record?: string;
  totalAmount?: number;
  points: number;
  user?: string;
};
