import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetsComponent } from './bets.component';

describe('BetComponent', () => {
  let component: BetsComponent;
  let fixture: ComponentFixture<BetsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BetsComponent],
    });
    fixture = TestBed.createComponent(BetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
