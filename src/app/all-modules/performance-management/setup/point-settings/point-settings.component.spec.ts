import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointSettingsComponent } from './point-settings.component';

describe('PointSettingsComponent', () => {
  let component: PointSettingsComponent;
  let fixture: ComponentFixture<PointSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PointSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PointSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
