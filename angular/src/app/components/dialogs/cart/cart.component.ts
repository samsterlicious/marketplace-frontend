import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MessageService } from 'primeng/api';
import { Bid, BidService } from 'src/app/services/bid/bid.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { MarketplaceEvent } from 'src/app/services/marketplace/marketplace.service';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService],
})
export class CartComponent {
  @Input() show = false;

  @Output() hideEmitter = new EventEmitter<boolean>();

  @Output() reload = new EventEmitter<string>();

  visible = true;

  @Input() cart: { [key: string]: MarketplaceEvent } = {};

  cartAmounts: { [key: string]: number } = {};

  constructor(
    private bidService: BidService,
    private spinner: SpinnerService,
    private messageService: MessageService,
    private cartService: CartService
  ) {}
  onHide(_hide: Event) {
    this.hideEmitter.emit(true);
  }

  getTeam(eventKey: string) {
    const groups = eventKey.match(/\|([^\|]+)$/);
    return groups![1];
  }

  place() {
    const bids: Bid[] = Object.entries(this.cartAmounts).map(
      ([eventKey, amount]) => {
        const event = this.cart[eventKey];
        return {
          amount,
          kind: event.kind,
          awayTeam: event.awayTeam,
          homeTeam: event.homeTeam,
          chosenCompetitor: this.getTeam(eventKey),
          spread: event.spread,
          date: event.date,
        };
      }
    );
    this.spinner.turnOn();
    this.bidService.create(bids).subscribe({
      complete: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Succesfully submitted',
        });
        this.reload.emit('success');
        this.cartService.clear();
        this.visible = false;
        this.hideEmitter.emit(true);
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
}
