import { TestBed } from '@angular/core/testing';

import { CommunicationResolver } from './communication.resolver';

describe('CommunicationResolver', () => {
  let resolver: CommunicationResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(CommunicationResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
