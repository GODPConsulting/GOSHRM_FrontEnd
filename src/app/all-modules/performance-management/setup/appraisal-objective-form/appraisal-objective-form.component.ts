import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { data } from "jquery";
import { DataService } from "src/app/services/data.service";
import { PerformanceManagementService } from "src/app/services/performance-management.service";
import { LoadingService } from "../../../../services/loading.service";

@Component({
  selector: "app-appraisal-objective-form",
  templateUrl: "./appraisal-objective-form.component.html",
  styleUrls: ["./appraisal-objective-form.component.css"],
})
export class AppraisalObjectiveFormComponent implements OnInit {
  appraisalObjectiveForm: FormGroup;
  reviewStatus: any[] = [];
  user: any;
  staffId: any;
  employeeAppraisalInfo: any = {};

  constructor(
    private formbuilder: FormBuilder,
    private performanceManagementService: PerformanceManagementService,
    private router: Router,
    private dataService: DataService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem("userDetails"));
    console.log(user);
    if (user) {
      this.staffId = user.staffId;
    }
    this.initializeForm();
    this.getAppraisalCycle();
    this.getCareer(this.staffId);
  }
  initializeForm() {
    this.appraisalObjectiveForm = this.formbuilder.group({
      id: [0],
      reviewYear: [""],
      period: [""],
      staffName: [""],
      job_Grade: [""],
      job_title: [""],
      line_ManagerName: [""],
      first_Level_ReviewerName: [""],
      second_Level_ReviewerName: [""],
      third_Level_ReviewerName: [""],
    });
  }

  getAppraisalCycle() {
    this.loadingService.show();
    return this.performanceManagementService
      .getAppraisalCycleByStatus()
      .subscribe(
        (data) => {
          this.loadingService.hide();
          this.reviewStatus = data.setupList;
        },
        (err) => {
          this.loadingService.hide();
        }
      );
  }

  getCareer(id) {
    this.loadingService.show();
    return this.performanceManagementService.getCareerByStaffId(id).subscribe(
      (data) => {
        this.loadingService.hide();
        this.employeeAppraisalInfo = data.employeeList[0];
        this.appraisalObjectiveForm.patchValue({
          staffName: this.employeeAppraisalInfo.staffName,
          job_Grade: this.employeeAppraisalInfo.job_Grade,
          job_title: this.employeeAppraisalInfo.job_title,
          line_ManagerName: this.employeeAppraisalInfo.line_ManagerName,
          first_Level_ReviewerName: this.employeeAppraisalInfo
            .first_Level_ReviewerName,
          second_Level_ReviewerName: this.employeeAppraisalInfo
            .second_Level_ReviewerName,
          third_Level_ReviewerName: this.employeeAppraisalInfo
            .second_Level_ReviewerName,
        });
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
}
