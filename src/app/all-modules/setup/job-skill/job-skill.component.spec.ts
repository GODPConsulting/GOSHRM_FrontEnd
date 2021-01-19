import { ComponentFixture, TestBed } from "@angular/core/testing";

import { JobSkillComponent } from "./job-skill.component";

describe("JobSkillComponent", () => {
  let component: JobSkillComponent;
  let fixture: ComponentFixture<JobSkillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JobSkillComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobSkillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
