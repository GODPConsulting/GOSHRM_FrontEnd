import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyStructureDefinitionComponent } from './company-structure-definition.component';

describe('CompanyStructureDefinitionComponent', () => {
  let component: CompanyStructureDefinitionComponent;
  let fixture: ComponentFixture<CompanyStructureDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyStructureDefinitionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyStructureDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
