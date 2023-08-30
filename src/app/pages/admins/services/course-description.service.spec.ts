import { TestBed } from '@angular/core/testing';

import { CourseDescriptionService } from './course-description.service';

describe('CourseDescriptionService', () => {
  let service: CourseDescriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseDescriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
