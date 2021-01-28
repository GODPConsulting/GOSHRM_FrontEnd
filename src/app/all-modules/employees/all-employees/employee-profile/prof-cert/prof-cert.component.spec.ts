import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfCertComponent } from './prof-cert.component';

describe('ProfCertComponent', () => {
  let component: ProfCertComponent;
  let fixture: ComponentFixture<ProfCertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfCertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfCertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
