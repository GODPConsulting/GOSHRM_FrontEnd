import { TestBed } from '@angular/core/testing';

import { AddCourseResolver } from './add-course.resolver';

describe('AddCourseResolver', () => {
  let resolver: AddCourseResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(AddCourseResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
