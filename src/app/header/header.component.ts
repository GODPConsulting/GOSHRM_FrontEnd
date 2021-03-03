import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HeaderService } from "./header.service";
import { AuthService } from "../services/auth.service";
import { DataService } from "../services/data.service";
import { EmployeeService } from "../services/employee.service";
import { JwtService } from "../services/jwt.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  jsonData: any = {
    notification: [],
    message: [],
  };
  notifications: any;
  messagesData: any;
  user: any = {};
  allUsers: any;
  mails: any;
  emailCount: number;

  constructor(
    private headerService: HeaderService,
    private router: Router,
    private authService: AuthService,
    private dataService: DataService,
    private employeeService: EmployeeService,
    private jwtService: JwtService
  ) {}

  ngOnInit() {
    this.getAllEmails();

    // this.getDatas("notification");
    // this.getDatas("message");
    this.user = this.jwtService.getHrmUserDetails();
    // Get access to the user data shared from sidebar
    /* this.dataService.currentUser.subscribe((result) => {
      this.user = result;
    }); */

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

  getAllEmails() {
    this.employeeService.getAllEmails().subscribe(
      (data) => {
        this.emailCount = data.emailCount;
        this.mails = data.emails;
        this.dataService.saveCurrentMail(this.mails);
      },
      (err) => {}
    );
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
