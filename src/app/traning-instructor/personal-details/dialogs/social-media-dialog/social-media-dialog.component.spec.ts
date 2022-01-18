import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialMediaDialogComponent } from './social-media-dialog.component';

describe('SocialMediaDialogComponent', () => {
  let component: SocialMediaDialogComponent;
  let fixture: ComponentFixture<SocialMediaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocialMediaDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialMediaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
