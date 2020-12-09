import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GymWorkoutComponent } from './gym-workout.component';

describe('GymWorkoutComponent', () => {
  let component: GymWorkoutComponent;
  let fixture: ComponentFixture<GymWorkoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GymWorkoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GymWorkoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
