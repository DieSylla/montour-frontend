import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminEntreprisesPage } from './admin-entreprises.page';

describe('AdminEntreprisesPage', () => {
  let component: AdminEntreprisesPage;
  let fixture: ComponentFixture<AdminEntreprisesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEntreprisesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
