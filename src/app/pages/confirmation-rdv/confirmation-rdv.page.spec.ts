import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationRdvPage } from './confirmation-rdv.page';

describe('ConfirmationRdvPage', () => {
  let component: ConfirmationRdvPage;
  let fixture: ComponentFixture<ConfirmationRdvPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationRdvPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
