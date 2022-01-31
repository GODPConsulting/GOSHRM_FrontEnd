import { TestBed } from '@angular/core/testing';

import { InstructorResolver } from './instructor.resolver';

describe('InstructorResolver', () => {
  let resolver: InstructorResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(InstructorResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
