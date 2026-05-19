import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionCreneauxPage } from './gestion-creneaux.page';

describe('GestionCreneauxPage', () => {
  let component: GestionCreneauxPage;
  let fixture: ComponentFixture<GestionCreneauxPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionCreneauxPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
