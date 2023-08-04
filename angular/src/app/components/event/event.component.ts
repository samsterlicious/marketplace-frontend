import { Component, Input } from '@angular/core';
import { MarketplaceEvent } from 'src/app/services/marketplace/marketplace.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
})
export class EventComponent {
  @Input()
  event!: MarketplaceEvent;
}
