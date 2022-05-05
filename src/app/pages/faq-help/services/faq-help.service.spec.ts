import { TestBed } from '@angular/core/testing';

import { FaqHelpService } from './faq-help.service';

describe('FaqHelpService', () => {
  let service: FaqHelpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FaqHelpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
