import { TestBed } from '@angular/core/testing';

import { InstructorCommunityService } from './instructor-community.service';

describe('InstructorCommunityService', () => {
  let service: InstructorCommunityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstructorCommunityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
