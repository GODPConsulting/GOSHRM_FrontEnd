import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailconfigListComponent } from './emailconfig-list.component';

describe('EmailconfigListComponent', () => {
  let component: EmailconfigListComponent;
  let fixture: ComponentFixture<EmailconfigListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailconfigListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailconfigListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
