import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfCertificationComponent } from './prof-certification.component';

describe('ProfCertificationComponent', () => {
  let component: ProfCertificationComponent;
  let fixture: ComponentFixture<ProfCertificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfCertificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfCertificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
