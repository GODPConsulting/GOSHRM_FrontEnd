import { TestBed } from '@angular/core/testing';

import { UserActivitiesService } from './user-activities.service';

describe('UserActivitiesService', () => {
  let service: UserActivitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserActivitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
