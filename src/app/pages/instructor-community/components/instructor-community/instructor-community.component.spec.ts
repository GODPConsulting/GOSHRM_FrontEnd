import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorCommunityComponent } from './instructor-community.component';

describe('InstructorCommunityComponent', () => {
  let component: InstructorCommunityComponent;
  let fixture: ComponentFixture<InstructorCommunityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstructorCommunityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructorCommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
