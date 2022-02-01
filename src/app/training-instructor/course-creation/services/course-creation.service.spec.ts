import { TestBed } from '@angular/core/testing';

import { CourseCreationService } from './course-creation.service';

describe('CourseCreationService', () => {
  let service: CourseCreationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseCreationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
