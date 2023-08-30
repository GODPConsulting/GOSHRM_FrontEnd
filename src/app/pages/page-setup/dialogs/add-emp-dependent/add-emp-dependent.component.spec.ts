import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmpDependentComponent } from './add-emp-dependent.component';

describe('AddEmpDependentComponent', () => {
  let component: AddEmpDependentComponent;
  let fixture: ComponentFixture<AddEmpDependentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEmpDependentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmpDependentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
