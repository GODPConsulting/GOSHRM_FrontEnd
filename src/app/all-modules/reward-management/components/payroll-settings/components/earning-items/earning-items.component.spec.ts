import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarningItemsComponent } from './earning-items.component';

describe('EarningItemsComponent', () => {
  let component: EarningItemsComponent;
  let fixture: ComponentFixture<EarningItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EarningItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EarningItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
