import { Component, OnInit } from "@angular/core";
import { Router, Event, NavigationEnd } from "@angular/router";
import { AllModulesService } from "../all-modules/all-modules.service";
import { DataService } from "../services/data.service";
import { EmployeeService } from "../services/employee.service";
import { JwtService } from "../services/jwt.service";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent implements OnInit {
  urlComplete = {
    mainUrl: "",
    subUrl: "",
    childUrl: "",
  };

  sidebarMenus = {
    default: true,
    chat: false,
    settings: false,
  };

  members = {};
  groups = {};
  userRights: any[] = [];
  staffId: number;
  user: any;
  hrmUser: any = {};

  constructor(
    private router: Router,
    private allModulesService: AllModulesService,
    public jwtService: JwtService,
    private dataService: DataService,
    private employeeService: EmployeeService
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        $(".main-wrapper").removeClass("slide-nav");
        $(".sidebar-overlay").removeClass("opened");
        const url = event.url.split("/");
        this.urlComplete.mainUrl = url[1];
        this.urlComplete.subUrl = url[2];
        this.urlComplete.childUrl = url[3];
        if (url[1] === "") {
          this.urlComplete.mainUrl = "dashboard";
          this.urlComplete.subUrl = "admin";
        }

        if (url[2] === "chat" || url[2] === "calls") {
          this.sidebarMenus.chat = true;
          this.sidebarMenus.default = false;
        } else {
          this.sidebarMenus.chat = false;
          this.sidebarMenus.default = true;
        }
      }
    });

    this.groups = { ...this.allModulesService.groups };
    this.members = { ...this.allModulesService.members };
  }

  ngOnInit() {
    this.userRights = this.jwtService.getUserActivities();
    this.user = this.jwtService.getUserDetails();

    // Slide up and down of menus
    $(document).on("click", "#sidebar-menu a", function (e) {
      e.stopImmediatePropagation();
      if ($(this).parent().hasClass("submenu")) {
        e.preventDefault();
      }
      if (!$(this).hasClass("subdrop")) {
        $("ul", $(this).parents("ul:first")).slideUp(350);
        $("a", $(this).parents("ul:first")).removeClass("subdrop");
        $(this).next("ul").slideDown(350);
        $(this).addClass("subdrop");
      } else if ($(this).hasClass("subdrop")) {
        $(this).removeClass("subdrop");
        $(this).next("ul").slideUp(350);
      }
    });
  }

  setActive(member) {
    this.allModulesService.members.active = member;
  }
}
