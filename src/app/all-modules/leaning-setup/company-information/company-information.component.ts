import { Component, HostListener, NgZone, OnInit } from "@angular/core";
declare const $: any;

@Component({
  selector: "app-company-information",
  templateUrl: "./company-information.component.html",
  styleUrls: ["./company-information.component.css"],
})
@HostListener("window: resize", ["$event"])
export class CompanyInformationComponent implements OnInit {
    spinner: boolean = false;
  constructor(private ngZone: NgZone) {
  }

  ngOnInit(): void {}

  openCompanyInfoModal() {
    $("#edit-company-info").modal("show");
  }

  closeCompanyInfoModal() {
    $("#edit-company-info").modal("hide");
  }

  openSocialMediaModal() {
    $("#social-media").modal("show");
  }

  closeSocialMediaModal() {
    $("#social-media").modal("hide");
  }

  openWebsiteModal() {
    $("#website").modal("show");
  }

  closeWebsiteModal() {
    $("#website").modal("hide");
  }
 
}
