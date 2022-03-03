import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationalSetupComponent } from './educational-setup.component';

describe('EducationalSetupComponent', () => {
  let component: EducationalSetupComponent;
  let fixture: ComponentFixture<EducationalSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EducationalSetupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EducationalSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
