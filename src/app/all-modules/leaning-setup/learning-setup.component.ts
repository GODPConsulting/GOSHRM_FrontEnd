import { Component, HostListener, NgZone, OnInit } from "@angular/core";

@Component({
  selector: "app-learning-setup",
  templateUrl: "./learning-setup.component.html",
  styleUrls: ["./learning-setup.component.css"],
})
@HostListener("window: resize", ["$event"])
export class LearningSetupComponent implements OnInit {
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

  ngOnInit(): void {}
  onResize(event) {
    this.innerHeight = event.target.innerHeight + "px";
  }
}
