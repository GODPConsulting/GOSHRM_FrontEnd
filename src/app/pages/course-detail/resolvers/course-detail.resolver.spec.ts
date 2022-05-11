import { TestBed } from '@angular/core/testing';

import { CourseDetailResolver } from './course-detail.resolver';

describe('CourseDetailResolver', () => {
  let resolver: CourseDetailResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(CourseDetailResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
