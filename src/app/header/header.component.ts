import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
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

    // Get access to the user data shared from sidebar
    this.dataService.currentUser.subscribe((result) => {
      this.user = result;
    //  if (this.user !== null) {
    //   localStorage.setItem('user', JSON.stringify(this.user))
    //  }
      console.log(this.user);
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
}
