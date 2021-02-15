import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { NavigationEnd, Router } from "@angular/router";
import { HeaderService } from "./header.service";
import { AuthService } from "../services/auth.service";
import { DataService } from "../data.service";
import { EmployeeService } from "../services/employee.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit, OnDestroy {
  jsonData: any = {
    notification: [],
    message: [],
  };
  notifications: any;
  messagesData: any;
  user: any = {};
  mySubscription: any;
  allUsers: any;
  userPhoto: any;

  constructor(
    private headerService: HeaderService,
    private router: Router,
    private authService: AuthService,
    private dataService: DataService,
    private employeeService: EmployeeService
  ) {
    // This solves the issue of not being able to navigate to user profile when on another profile (Method 2)
    // Working but reloads all components on the view
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
      }
    });
  }

  ngOnInit() {
    // this.getDatas("notification");
    // this.getDatas("message");

    // Get access to the storeduser data
    this.dataService.currentUser.subscribe((result) => {
      this.user = result;
      console.log(this.user);
      this.getProfilePhoto();
    });

    this.notifications = [
      {
        message: "Patient appointment booking",
        author: "John Doe",
        function: "added new task",
        time: "4 mins ago",
      },
      {
        message: "Patient appointment booking",
        author: "John Doe",
        function: "added new task",
        time: "1 hour ago",
      },
      {
        message: "Patient appointment booking",
        author: "John Doe",
        function: "added new task",
        time: "4 mins ago",
      },
      {
        message: "Patient appointment booking",
        author: "John Doe",
        function: "added new task",
        time: "1 hour ago",
      },
      {
        message: "Patient appointment booking",
        author: "John Doe",
        function: "added new task",
        time: "4 mins ago",
      },
      {
        message: "Patient appointment booking",
        author: "John Doe",
        function: "added new task",
        time: "1 hour ago",
      },
    ];

    this.messagesData = [
      {
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing",
        author: "Mike Litorus",
        time: "4 mins ago",
      },
      {
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing",
        author: "Mike Litorus",
        time: "1 hour ago",
      },
      {
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing",
        author: "Mike Litorus",
        time: "4 mins ago",
      },
      {
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing",
        author: "Mike Litorus",
        time: "1 hour ago",
      },
      {
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing",
        author: "Mike Litorus",
        time: "4 mins ago",
      },
      {
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing",
        author: "Mike Litorus",
        time: "1 hour ago",
      },
    ];
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

  getDatas(section) {
    this.headerService.getDataFromJson(section).subscribe((data) => {
      this.jsonData[section] = data;
    });
  }

  clearData(section) {
    this.jsonData[section] = [];
  }
  onSubmit() {
    this.router.navigate(["/pages/search"]);
  }

  logOut() {
    this.authService.clearSession();
  }

  //To get profile photo of the signedin user
  getProfilePhoto() {
    this.employeeService.getEmployees().subscribe((data) => {
      this.allUsers = data.employeeList;
      // loop and check if the email is the same then get the photo
      for (const key of this.allUsers) {
        if (key.email === this.user.email) {
          this.userPhoto = key.photo;
        }
      }
    });
  }

  // This solves the issue of not being able to navigate to user profile when on another profile (Method 1)
  //However, navigating backwards has same issue
  /* viewUserProfile() {
    const currentRoute: string = `/employees/employeeprofile/${this.user.staffId}`;
    this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      this.router.navigate([currentRoute]);
    });
  } */
}
