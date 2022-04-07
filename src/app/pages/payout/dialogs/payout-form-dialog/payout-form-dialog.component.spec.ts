import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutFormDialogComponent } from './payout-form-dialog.component';

describe('PayoutFormDialogComponent', () => {
  let component: PayoutFormDialogComponent;
  let fixture: ComponentFixture<PayoutFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayoutFormDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayoutFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
