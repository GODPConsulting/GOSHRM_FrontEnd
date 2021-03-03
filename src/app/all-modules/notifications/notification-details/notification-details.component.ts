import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { EmployeeService } from "src/app/services/employee.service";

@Component({
  selector: "app-notification-details",
  templateUrl: "./notification-details.component.html",
  styleUrls: ["./notification-details.component.css"],
})
export class NotificationDetailsComponent implements OnInit {
  emailId: number;
  mail: any = {};
  pageLoading: boolean = true;
  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((param) => {
      this.emailId = +param.get("id");
      this.employeeService.getEmailById(this.emailId).subscribe((data) => {
        this.pageLoading = false;
        this.mail = data.emails[0];
      });
    });
  }
}
