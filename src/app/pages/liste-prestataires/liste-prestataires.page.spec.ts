import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListePrestatairesPage } from './liste-prestataires.page';

describe('ListePrestatairesPage', () => {
  let component: ListePrestatairesPage;
  let fixture: ComponentFixture<ListePrestatairesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListePrestatairesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
