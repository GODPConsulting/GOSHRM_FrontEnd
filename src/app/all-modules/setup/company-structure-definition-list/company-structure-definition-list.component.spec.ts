import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyStructureDefinitionListComponent } from './company-structure-definition-list.component';

describe('CompanyStructureDefinitionListComponent', () => {
  let component: CompanyStructureDefinitionListComponent;
  let fixture: ComponentFixture<CompanyStructureDefinitionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyStructureDefinitionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyStructureDefinitionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
