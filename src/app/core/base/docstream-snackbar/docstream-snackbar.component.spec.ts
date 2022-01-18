import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocstreamSnackbarComponent } from './docstream-snackbar.component';

describe('DocstreamSnackbarComponent', () => {
  let component: DocstreamSnackbarComponent;
  let fixture: ComponentFixture<DocstreamSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocstreamSnackbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocstreamSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
