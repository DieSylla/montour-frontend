import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RechercheServicePage } from './recherche-service.page';

describe('RechercheServicePage', () => {
  let component: RechercheServicePage;
  let fixture: ComponentFixture<RechercheServicePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RechercheServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
