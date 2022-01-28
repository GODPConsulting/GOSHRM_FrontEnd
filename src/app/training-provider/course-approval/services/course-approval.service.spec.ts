import { TestBed } from '@angular/core/testing';

import { CourseApprovalService } from './course-approval.service';

describe('CourseApprovalService', () => {
  let service: CourseApprovalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseApprovalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
