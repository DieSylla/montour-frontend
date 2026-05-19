import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectCreneauPage } from './select-creneau.page';

describe('SelectCreneauPage', () => {
  let component: SelectCreneauPage;
  let fixture: ComponentFixture<SelectCreneauPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCreneauPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
