import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffInfoListComponent } from './staff-info-list.component';

describe('StaffInfoListComponent', () => {
  let component: StaffInfoListComponent;
  let fixture: ComponentFixture<StaffInfoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffInfoListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffInfoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
