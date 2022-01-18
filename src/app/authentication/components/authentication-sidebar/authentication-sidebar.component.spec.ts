import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticationSidebarComponent } from './authentication-sidebar.component';

describe('AuthenticationSidebarComponent', () => {
  let component: AuthenticationSidebarComponent;
  let fixture: ComponentFixture<AuthenticationSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthenticationSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticationSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
