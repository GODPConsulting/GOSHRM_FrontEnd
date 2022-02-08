import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DucumentTypeComponent } from './ducument-type.component';

describe('DucumentTypeComponent', () => {
  let component: DucumentTypeComponent;
  let fixture: ComponentFixture<DucumentTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DucumentTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DucumentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
