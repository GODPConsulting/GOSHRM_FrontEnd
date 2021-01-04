import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSubSkillComponent } from './job-sub-skill.component';

describe('JobSubSkillComponent', () => {
  let component: JobSubSkillComponent;
  let fixture: ComponentFixture<JobSubSkillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobSubSkillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobSubSkillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
