import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProviderRdvPage } from './provider-rdv.page';

describe('ProviderRdvPage', () => {
  let component: ProviderRdvPage;
  let fixture: ComponentFixture<ProviderRdvPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderRdvPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
