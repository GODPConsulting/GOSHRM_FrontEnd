import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRoleActivitiesComponent } from './user-role-activities.component';

describe('UserRoleActivitiesComponent', () => {
  let component: UserRoleActivitiesComponent;
  let fixture: ComponentFixture<UserRoleActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserRoleActivitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRoleActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
