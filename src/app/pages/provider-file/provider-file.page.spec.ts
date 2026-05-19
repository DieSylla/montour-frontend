import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProviderFilePage } from './provider-file.page';

describe('ProviderFilePage', () => {
  let component: ProviderFilePage;
  let fixture: ComponentFixture<ProviderFilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderFilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
