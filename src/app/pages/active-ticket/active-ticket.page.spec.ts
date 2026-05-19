import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActiveTicketPage } from './active-ticket.page';

describe('ActiveTicketPage', () => {
  let component: ActiveTicketPage;
  let fixture: ComponentFixture<ActiveTicketPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveTicketPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
