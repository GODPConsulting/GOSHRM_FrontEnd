import { TestBed } from '@angular/core/testing';

import { InstructorInformationService } from './instructor-information.service';

describe('InstructorInformationService', () => {
  let service: InstructorInformationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstructorInformationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
