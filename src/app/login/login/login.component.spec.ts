import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { LoginComponent } from "./login.component";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { By } from "@angular/platform-browser";
import { Component } from "@angular/core";
import { Location } from "@angular/common";
import { SpyLocation } from "@angular/common/testing";
import { DomHelper } from "../../../testing/dom-helper";
import { AuthService } from "../../services/auth.service";
import { of } from "rxjs";
import { Router } from "@angular/router";
describe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let dh: DomHelper<LoginComponent>;
  let authServiceMock: any;
  beforeEach(
    waitForAsync(() => {
      authServiceMock = jasmine.createSpyObj("AuthService", [
        "login",
        "getProfile",
      ]);
      authServiceMock.getProfile.and.returnValue(of([]));
      TestBed.configureTestingModule({
        declarations: [LoginComponent],
        imports: [
          ReactiveFormsModule,
          HttpClientTestingModule,
          RouterTestingModule.withRoutes([
            {
              path: "dashboard",
              component: DummyComponent,
            },
          ]),
        ],
        providers: [
          { provide: Location, useClass: SpyLocation },
          { provide: AuthService, useValue: authServiceMock },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    dh = new DomHelper(fixture);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have at least one button element", () => {
    const btn = fixture.debugElement.queryAll(By.css("button"));
    expect(btn.length >= 1).toBeTruthy();
  });

  // test for input fields

  it("should have 2 input fields", () => {
    const inputs = fixture.debugElement.queryAll(By.css("input"));
    expect(dh.counter("input")).toEqual(2);
  });

  // test for input type
  it("should have input type of text and password", () => {
    const inputs = fixture.debugElement.queryAll(By.css("input"));
    const firstInput: HTMLInputElement = inputs[0].nativeElement;
    const secondInput: HTMLInputElement = inputs[1].nativeElement;
    expect(firstInput.type).toBe("text");
    expect(secondInput.type).toBe("password");
  });

  // test for input labels

  it("should have 2 labels and have Username and Password as text content", () => {
    // const labels = fixture.debugElement.queryAll(By.css("label"));
    // const userNameLabel: HTMLLabelElement = labels[0].nativeElement;
    // const passwordLabel: HTMLLabelElement = labels[1].nativeElement;
    expect(dh.multipleElement("label", 0)).toBe("Username");
    expect(dh.multipleElement("label", 1)).toBe("Password");
  });

  it("should navigate to /login on load", () => {
    const router = TestBed.inject(Router);
    expect(router.url).toBe("/");
  });
});

@Component({
  template: "",
})
class DummyComponent {}
