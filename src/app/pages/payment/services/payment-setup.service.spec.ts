import { TestBed } from '@angular/core/testing';

import { PaymentSetupService } from './payment-setup.service';

describe('PaymentSetupService', () => {
  let service: PaymentSetupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentSetupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
