import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DependentContactComponent } from './dependent-contact.component';

describe('DependentContactComponent', () => {
  let component: DependentContactComponent;
  let fixture: ComponentFixture<DependentContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DependentContactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DependentContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
