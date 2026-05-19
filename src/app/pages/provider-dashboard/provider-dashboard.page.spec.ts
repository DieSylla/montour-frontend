import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProviderDashboardPage } from './provider-dashboard.page';

describe('ProviderDashboardPage', () => {
  let component: ProviderDashboardPage;
  let fixture: ComponentFixture<ProviderDashboardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
