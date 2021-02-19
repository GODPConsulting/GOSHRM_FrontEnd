import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeSettingComponent } from './grade-setting.component';

describe('GradeSettingComponent', () => {
  let component: GradeSettingComponent;
  let fixture: ComponentFixture<GradeSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradeSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GradeSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
