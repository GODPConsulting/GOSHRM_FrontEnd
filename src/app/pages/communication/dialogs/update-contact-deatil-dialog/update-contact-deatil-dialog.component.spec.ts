import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateContactDeatilDialogComponent } from './update-contact-deatil-dialog.component';

describe('UpdateContactDeatilDialogComponent', () => {
  let component: UpdateContactDeatilDialogComponent;
  let fixture: ComponentFixture<UpdateContactDeatilDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateContactDeatilDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateContactDeatilDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
