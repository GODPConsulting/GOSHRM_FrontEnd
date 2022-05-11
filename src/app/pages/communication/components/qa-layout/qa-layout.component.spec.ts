import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QaLayoutComponent } from './qa-layout.component';

describe('QaLayoutComponent', () => {
  let component: QaLayoutComponent;
  let fixture: ComponentFixture<QaLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QaLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QaLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
