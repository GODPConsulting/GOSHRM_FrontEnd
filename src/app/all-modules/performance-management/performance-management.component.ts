import { Component, OnInit, NgZone, HostListener } from "@angular/core";

@Component({
  selector: "app-performance-management",
  templateUrl: "./performance-management.component.html",
  styleUrls: ["./performance-management.component.css"],
})
@HostListener("window: resize", ["$event"])
export class PerformanceManagementComponent implements OnInit {
  public innerHeight: any;
  getScreenHeight() {
    this.innerHeight = window.innerHeight + "px";
  }

  constructor(private ngZone: NgZone) {
    window.onresize = (e) => {
      this.ngZone.run(() => {
        this.innerHeight = window.innerHeight + "px";
      });
    };
    this.getScreenHeight();
  }

  ngOnInit() {}

  onResize(event) {
    this.innerHeight = event.target.innerHeight + "px";
  }
}
