import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndustryDialogComponent } from './industry-dialog.component';

describe('IndustryDialogComponent', () => {
  let component: IndustryDialogComponent;
  let fixture: ComponentFixture<IndustryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndustryDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndustryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
