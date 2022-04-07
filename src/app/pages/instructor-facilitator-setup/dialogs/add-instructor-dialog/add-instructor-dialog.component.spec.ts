import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInstructorDialogComponent } from './add-instructor-dialog.component';

describe('AddInstructorDialogComponent', () => {
  let component: AddInstructorDialogComponent;
  let fixture: ComponentFixture<AddInstructorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddInstructorDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInstructorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
