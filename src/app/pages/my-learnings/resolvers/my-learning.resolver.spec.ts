import { TestBed } from '@angular/core/testing';

import { MyLearningResolver } from './my-learning.resolver';

describe('MyLearningResolver', () => {
  let resolver: MyLearningResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(MyLearningResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
