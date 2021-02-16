import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { NavigationEnd, Router } from "@angular/router";
import { HeaderService } from "./header.service";
import { AuthService } from "../services/auth.service";
import { DataService } from "../services/data.service";
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
  ) {}

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
}
