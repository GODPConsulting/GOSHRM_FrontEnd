import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTestimonyDialogComponent } from './add-testimony-dialog.component';

describe('AddTestimonyDialogComponent', () => {
  let component: AddTestimonyDialogComponent;
  let fixture: ComponentFixture<AddTestimonyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTestimonyDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTestimonyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
