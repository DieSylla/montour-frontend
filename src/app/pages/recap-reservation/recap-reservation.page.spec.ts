import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecapReservationPage } from './recap-reservation.page';

describe('RecapReservationPage', () => {
  let component: RecapReservationPage;
  let fixture: ComponentFixture<RecapReservationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecapReservationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
