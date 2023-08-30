import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitorComponent } from './competitor.component';

describe('CompetitorComponent', () => {
  let component: CompetitorComponent;
  let fixture: ComponentFixture<CompetitorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompetitorComponent]
    });
    fixture = TestBed.createComponent(CompetitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
