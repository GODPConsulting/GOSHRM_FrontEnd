import {
  AfterViewInit,
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { CdkPortal, DomPortalHost } from "@angular/cdk/portal";
@Component({
  selector: "app-windows",
  templateUrl: "./windows.component.html",
  styleUrls: ["./windows.component.css"],
})
export class WindowsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(CdkPortal) portal: CdkPortal;
  private externalWindow = null;
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef,
    private injector: Injector
  ) {}

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    this.externalWindow = window.open(
      "",
      "",
      "width=400,height=300,left=50,top=10"
    );
    const host = new DomPortalHost(
      this.externalWindow.document.body,
      this.componentFactoryResolver,
      this.applicationRef,
      this.injector
    );

    // STEP 6: Attach the portal
    host.attach(this.portal);
  }

  ngOnDestroy() {
    // STEP 7: close the window when this component destroyed
    this.externalWindow.close();
  }
}
