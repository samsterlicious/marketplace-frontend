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
      const { chosenTeam, event, amount, amountChange } = item;
      if (event && chosenTeam) {
        const existingCartItem = cart[CartService.getKeyFromEvent(event)];
        if (existingCartItem) {
          if (amountChange) {
            existingCartItem.amount = amount;
            return cart;
          }
          if (existingCartItem.chosenTeam === chosenTeam) {
            delete cart[CartService.getKeyFromEvent(event)];
          } else {
            cart[CartService.getKeyFromEvent(event)] = {
              event,
              chosenTeam,
              amount: 0,
            };
          }
        } else {
          cart[CartService.getKeyFromEvent(event)] = {
            event,
            chosenTeam,
            amount: 0,
          };
        }
      }
      return cart;
    })
  );

  cartSubject = new BehaviorSubject<Cart>({});

  constructor() {}

  addCartItem(cartItem: CartItem) {
    this.cartItemSubject.next(cartItem);
  }

  clear() {
    this.cartItemSubject.next(undefined);
  }

  getKeyFromEvent(event: MarketplaceEvent): string {
    return `${event.kind}|${new Date(event.date)
      .toISOString()
      .replace(/\.\d{3}Z$/, 'Z')}|${event.awayTeam}|${event.homeTeam}`;
  }

  static getKeyFromEvent(event: MarketplaceEvent): string {
    return `${event.kind}|${new Date(event.date)
      .toISOString()
      .replace(/\.\d{3}Z$/, 'Z')}|${event.awayTeam}|${event.homeTeam}`;
  }
}

export type Cart = {
  [key: string]: CartItem;
};

export type CartItem = {
  event?: MarketplaceEvent;
  chosenTeam?: string;
  amount?: number;
  amountChange?: boolean;
};
