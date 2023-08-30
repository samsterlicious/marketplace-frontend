import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { MarketplaceEvent } from '../marketplace/marketplace.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItemSubject = new BehaviorSubject<CartItem | undefined>({});
  cart$ = this.cartItemSubject.asObservable().pipe(
    map((item) => {
      if (!item) {
        return {};
      }
      const cart = this.cartSubject.getValue();
      const { chosenTeam, event } = item;
      if (event && chosenTeam) {
        if (cart[CartService.getKeyFromEvent(event, chosenTeam)]) {
          delete cart[CartService.getKeyFromEvent(event, chosenTeam)];
        } else {
          delete cart[CartService.getKeyFromEvent(event, event.homeTeam)];
          delete cart[CartService.getKeyFromEvent(event, event.awayTeam)];
          cart[CartService.getKeyFromEvent(event, chosenTeam)] = event;
        }
      }
      return cart;
    })
  );

  cartSubject = new BehaviorSubject<{ [key: string]: MarketplaceEvent }>({});

  constructor() {}

  addCartItem(cartItem: CartItem) {
    this.cartItemSubject.next(cartItem);
  }

  clear() {
    this.cartItemSubject.next(undefined);
  }

  static getKeyFromEvent(event: MarketplaceEvent, chosenTeam?: string): string {
    return `${event.kind}|${new Date(event.date)
      .toISOString()
      .replace(/\.\d{3}Z$/, 'Z')}|${event.awayTeam}|${event.homeTeam}${
      chosenTeam ? '|' + chosenTeam : ''
    }`;
  }
}

type CartItem = {
  event?: MarketplaceEvent;
  chosenTeam?: string;
};
