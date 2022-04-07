import { TestBed } from '@angular/core/testing';

import { RunningCoursesService } from './running-courses.service';

describe('RunningCoursesService', () => {
  let service: RunningCoursesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RunningCoursesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
