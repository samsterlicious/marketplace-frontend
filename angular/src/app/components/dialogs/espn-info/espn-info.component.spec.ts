import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspnInfoComponent } from './espn-info.component';

describe('EspnInfoComponent', () => {
  let component: EspnInfoComponent;
  let fixture: ComponentFixture<EspnInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EspnInfoComponent]
    });
    fixture = TestBed.createComponent(EspnInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
