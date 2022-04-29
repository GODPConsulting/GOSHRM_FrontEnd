import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleClassDialogComponent } from './schedule-class-dialog.component';

describe('ScheduleClassDialogComponent', () => {
  let component: ScheduleClassDialogComponent;
  let fixture: ComponentFixture<ScheduleClassDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleClassDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleClassDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
