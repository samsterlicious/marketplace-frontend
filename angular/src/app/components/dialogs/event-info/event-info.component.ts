import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { Bid, BidService } from 'src/app/services/bid/bid.service';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';

@Component({
  selector: 'app-event-info',
  templateUrl: './event-info.component.html',
  styleUrls: ['./event-info.component.scss'],
})
export class EventInfoComponent implements OnInit {
  @Input() kind = '';
  @Input() date = new Date();
  @Input() awayTeam = '';
  @Input() homeTeam = '';

  visible = true;

  bids = new Subject<Bid[]>();
  bids$ = this.bids.asObservable();

  @Output() hideEvent = new EventEmitter<boolean>();

  constructor(
    private bidService: BidService,
    private spinner: SpinnerService
  ) {}

  onHide(hide: boolean) {
    this.hideEvent.emit(true);
  }

  ngOnInit(): void {
    this.spinner.turnOn();
    this.bidService
      .getByEvent(this.kind, new Date(this.date), this.awayTeam, this.homeTeam)
      .subscribe({
        next: (resp) => {
          this.bids.next(resp);
        },
        complete: () => this.spinner.turnOff(),
        error: () => {
          this.spinner.turnOff();
          this.bids.next([]);
        },
      });
  }
}
