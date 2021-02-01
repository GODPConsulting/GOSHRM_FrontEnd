import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EmployeeHmoComponent } from "./employee-hmo.component";

describe("EmployeeHmoComponent", () => {
  let component: EmployeeHmoComponent;
  let fixture: ComponentFixture<EmployeeHmoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeeHmoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeHmoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
