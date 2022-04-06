import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SceduleClassDialogComponent } from './scedule-class-dialog.component';

describe('SceduleClassDialogComponent', () => {
  let component: SceduleClassDialogComponent;
  let fixture: ComponentFixture<SceduleClassDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SceduleClassDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SceduleClassDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
