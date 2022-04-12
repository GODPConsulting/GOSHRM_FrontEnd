import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyStructureListComponent } from './company-structure-list.component';

describe('CompanyStructureListComponent', () => {
  let component: CompanyStructureListComponent;
  let fixture: ComponentFixture<CompanyStructureListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyStructureListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyStructureListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
