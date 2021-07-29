import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachingSchedulesComponent } from './coaching-schedules.component';

describe('CoachingSchedulesComponent', () => {
  let component: CoachingSchedulesComponent;
  let fixture: ComponentFixture<CoachingSchedulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoachingSchedulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachingSchedulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
