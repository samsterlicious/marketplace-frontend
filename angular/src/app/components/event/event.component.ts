import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MarketplaceEvent } from 'src/app/services/marketplace/marketplace.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventComponent {
  @Input()
  event!: MarketplaceEvent;

  @Input()
  bid?: { chosenCompetitor: string; amount: number };

  @Input()
  homeSelected = false;
  @Input()
  awaySelected = false;

  info = new BehaviorSubject<boolean>(false);
  info$ = this.info.asObservable();

  isSelected = false;

  constructor() {}

  getMyAmount(team: string): number {
    if (!this.bid) return 0;
    if (this.bid.chosenCompetitor === team) {
      return this.bid.amount;
    }
    return 0;
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
}
