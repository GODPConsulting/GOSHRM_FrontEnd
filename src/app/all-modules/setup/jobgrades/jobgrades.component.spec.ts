import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobgradesComponent } from './jobgrades.component';

describe('JobgradesComponent', () => {
  let component: JobgradesComponent;
  let fixture: ComponentFixture<JobgradesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobgradesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobgradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
