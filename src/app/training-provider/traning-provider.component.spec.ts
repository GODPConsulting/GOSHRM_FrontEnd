import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraningProviderComponent } from './traning-provider.component';

describe('TraningProviderComponent', () => {
  let component: TraningProviderComponent;
  let fixture: ComponentFixture<TraningProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TraningProviderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TraningProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
