import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { data } from "jquery";
import { DataService } from "src/app/services/data.service";
import { PerformanceManagementService } from "src/app/services/performance-management.service";
import { LoadingService } from "../../../../services/loading.service";
import { JwtService } from "../../../../services/jwt.service";

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
  appraisalCycleId: number;
  deptId: number;
  jobGradeId: number;
  appraisalCycles: any[] = [];
  constructor(
    private formbuilder: FormBuilder,
    private performanceManagementService: PerformanceManagementService,
    private router: Router,
    private dataService: DataService,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    private jwtService: JwtService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((param) => {
      this.appraisalCycleId = param.appraisalCycleId;
    });
    const user = JSON.parse(localStorage.getItem("userDetails"));
    if (user) {
      this.staffId = user.staffId;
      this.deptId = user.departmentId;
    }
    this.jwtService.getHrmUserDetails().then((user) => {
      if (user) {
        this.jobGradeId = user.jobGrade;
        this.getAppraisalCycle();
      }
    });
    this.initializeForm();
    // this.getAppraisalCycle();
    this.getCareer(this.staffId);
  }
  initializeForm() {
    this.appraisalObjectiveForm = this.formbuilder.group({
      id: [0],
      reviewYear: [""],
      reviewPeriod: [""],
      employee: [""],
      lineManger: [""],
      jobGradeId: [""],
      firstReviewer: [""],
      secondReviewer: [""],
      thirdReviewer: [""],
      comment: [""],
      appraisalCycleId: [""],
      department: [""],
      staffName: [""],
      line_ManagerName: [""],
      first_Level_ReviewerName: [""],
      second_Level_ReviewerName: [""],
      third_Level_ReviewerName: [""],
      job_title: [""],
      job_Grade: [""],
    });
  }

  getAppraisalCycle() {
    this.loadingService.show();
    return this.performanceManagementService
      .getEmployeeAppraisalCycle(
        this.staffId,
        this.deptId,
        this.jobGradeId,
        this.appraisalCycleId
      )
      .subscribe(
        (data) => {
          this.loadingService.hide();
          this.appraisalCycles = data;
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
          employee: this.employeeAppraisalInfo.staffId,
          lineManger: this.employeeAppraisalInfo.line_ManagerId,
          department: this.deptId,
          appraisalCycleId: this.appraisalCycleId,
          firstReviewer: this.employeeAppraisalInfo.first_Level_ReviewerId,
          secondReviewer: this.employeeAppraisalInfo.second_Level_ReviewerId,
          thirdReviewer: this.employeeAppraisalInfo.third_Level_ReviewerId,
          jobGradeId: this.employeeAppraisalInfo.job_GradeId,
        });
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  viewObjectives() {
    const payload = this.appraisalObjectiveForm.value;
    payload.reviewYear = +payload.reviewYear;
    payload.appraisalCycleId = +payload.appraisalCycleId;
    this.loadingService.show();
    return this.performanceManagementService.startAppraisal(payload).subscribe(
      (res) => {
        this.loadingService.hide();
        const message = res["status"].message.friendlyMessage;
        if (res["status"].isSuccessful) {
          this.router.navigate(["/performance/appraisal-objectives"], {
            queryParams: {
              appraisalCycleId: this.appraisalCycleId,
            },
          });
        } else {
        }
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
}
