import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfMembershipComponent } from './prof-membership.component';

describe('ProfMembershipComponent', () => {
  let component: ProfMembershipComponent;
  let fixture: ComponentFixture<ProfMembershipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfMembershipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfMembershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
