import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutwardNuggetsComponent } from './outward-nuggets.component';

describe('OutwardNuggetsComponent', () => {
  let component: OutwardNuggetsComponent;
  let fixture: ComponentFixture<OutwardNuggetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutwardNuggetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutwardNuggetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
