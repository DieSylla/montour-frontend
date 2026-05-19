import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MesRdvPage } from './mes-rdv.page';

describe('MesRdvPage', () => {
  let component: MesRdvPage;
  let fixture: ComponentFixture<MesRdvPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MesRdvPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
