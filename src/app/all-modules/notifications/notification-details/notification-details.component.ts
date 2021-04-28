import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { EmployeeService } from "src/app/services/employee.service";
import { LoadingService } from "../../../services/loading.service";

@Component({
  selector: "app-notification-details",
  templateUrl: "./notification-details.component.html",
  styleUrls: ["./notification-details.component.css"],
})
export class NotificationDetailsComponent implements OnInit {
  emailId: number;
  mail: any = {};
  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.loadingService.show();
    this.route.paramMap.subscribe((param) => {
      this.emailId = +param.get("id");
      this.employeeService.getEmailById(this.emailId).subscribe(
        (data) => {
          this.loadingService.hide();
          this.mail = data.emails[0];
        },
        (err) => {
          this.loadingService.hide();
        }
      );
    });
  }
}
