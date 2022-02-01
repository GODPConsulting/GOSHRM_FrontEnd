import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCompanyInfoDialogComponent } from './edit-company-info-dialog.component';

describe('EditCompanyInfoDialogComponent', () => {
  let component: EditCompanyInfoDialogComponent;
  let fixture: ComponentFixture<EditCompanyInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCompanyInfoDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCompanyInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
