import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiToJobgradeComponent } from './kpi-to-jobgrade.component';

describe('KpiToJobgradeComponent', () => {
  let component: KpiToJobgradeComponent;
  let fixture: ComponentFixture<KpiToJobgradeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiToJobgradeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiToJobgradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
