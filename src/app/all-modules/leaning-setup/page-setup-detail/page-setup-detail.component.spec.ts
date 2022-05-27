import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSetupDetailComponent } from './page-setup-detail.component';

describe('PageSetupDetailComponent', () => {
  let component: PageSetupDetailComponent;
  let fixture: ComponentFixture<PageSetupDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageSetupDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageSetupDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
