import { Component, OnInit } from "@angular/core";
import { PrimeNGConfig } from "primeng/api";
import { JwtHelperService } from "@auth0/angular-jwt";
import { JwtService } from "./services/jwt.service";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  title = "smarthr";
  constructor(
    private primengConfig: PrimeNGConfig,
    private jwtService: JwtService,
    private router: Router
  ) {}
  ngOnInit() {
    const helper = new JwtHelperService();
    const token = this.jwtService.getToken();
    const decodedToken = helper.decodeToken(token);
    // console.log(decodedToken);
    const isExpired = helper.isTokenExpired(token);
    if (isExpired) {
      this.jwtService.destroyToken().then(() => {
        this.router.navigate(["/login"]);
      });
    }

    this.primengConfig.ripple = true;
    // Minified Sidebar

    $(document).on("click", "#toggle_btn", () => {
      if ($("body").hasClass("mini-sidebar")) {
        $("body").removeClass("mini-sidebar");
        $(".subdrop + ul").slideDown();
      } else {
        $("body").addClass("mini-sidebar");
        $(".subdrop + ul").slideUp();
      }
      return false;
    });

    $(document).on("mouseover", (e) => {
      e.stopPropagation();
      if (
        $("body").hasClass("mini-sidebar") &&
        $("#toggle_btn").is(":visible")
      ) {
        const targ = $(e.target).closest(".sidebar").length;
        if (targ) {
          $("body").addClass("expand-menu");
          $(".subdrop + ul").slideDown();
        } else {
          $("body").removeClass("expand-menu");
          $(".subdrop + ul").slideUp();
        }
        return false;
      }
    });
    $("body").append('<div class="sidebar-overlay"></div>');
    $(document).on("click", "#mobile_btn", function () {
      var $wrapper = $(".main-wrapper");
      $wrapper.toggleClass("slide-nav");
      $(".sidebar-overlay").toggleClass("opened");
      $("html").addClass("menu-opened");
      $("#task_window").removeClass("opened");
      return false;
    });

    $(".sidebar-overlay").on("click", function () {
      var $wrapper = $(".main-wrapper");
      $("html").removeClass("menu-opened");
      $(this).removeClass("opened");
      $wrapper.removeClass("slide-nav");
      $(".sidebar-overlay").removeClass("opened");
      $("#task_window").removeClass("opened");
    });
  }
}
