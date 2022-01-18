import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraningInstructorComponent } from './traning-instructor.component';

describe('TraningInstructorComponent', () => {
  let component: TraningInstructorComponent;
  let fixture: ComponentFixture<TraningInstructorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TraningInstructorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TraningInstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
