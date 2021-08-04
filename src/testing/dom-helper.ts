import { ComponentFixture } from "@angular/core/testing";
import { LoginComponent } from "../app/auth/auth/login/login.component";
import { By } from "@angular/platform-browser";

export class DomHelper<T> {
  private fixture: ComponentFixture<T>;
  constructor(fixture: ComponentFixture<T>) {
    this.fixture = fixture;
  }

  singleElement(tagName: string): string {
    const element = this.fixture.debugElement.query(By.css(tagName));
    if (element) {
      return element.nativeElement.textContent;
    }
  }

  counter(tagName: string): number {
    const elements = this.fixture.debugElement.queryAll(By.css(tagName));
    return elements.length;
  }
  multipleElement(tagName: string, index: number): string {
    const elements = this.fixture.debugElement.queryAll(By.css(tagName));
    if (elements) {
      return elements[index].nativeElement.textContent;
    }
  }
}
