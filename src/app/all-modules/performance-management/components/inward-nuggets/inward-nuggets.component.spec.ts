import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InwardNuggetsComponent } from './inward-nuggets.component';

describe('InwardNuggetsComponent', () => {
  let component: InwardNuggetsComponent;
  let fixture: ComponentFixture<InwardNuggetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InwardNuggetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InwardNuggetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
