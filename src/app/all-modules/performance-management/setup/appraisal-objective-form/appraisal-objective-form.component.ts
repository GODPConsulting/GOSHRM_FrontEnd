import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { data } from "jquery";
import { DataService } from "src/app/services/data.service";
import { PerformanceManagementService } from "src/app/services/performance-management.service";
import { LoadingService } from "../../../../services/loading.service";
import { JwtService } from "../../../../services/jwt.service";
import { UtilitiesService } from "../../../../services/utilities.service";
import { Location } from "@angular/common";
import { Observable } from "rxjs";
import { AppraisalObjectivesComponent } from "../appraisal-objectives/appraisal-objectives.component";

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
  objectiveId: number;
  lineManagerId: number;
  reviewYears$: Observable<any> = this.performanceManagementService.getReviewYears();
  reviewPeriods$: Observable<any>;
  status: string;
  reviewPeriods: any[] = [];
  pageStatus: number = 0;
  employeePerformId: number = 0;
  disableField: boolean = false;
  reviewYear: any;
  reviewPeriod: any;
  employeeId: any;

  constructor(
    private formbuilder: FormBuilder,
    private performanceManagementService: PerformanceManagementService,
    private router: Router,
    private dataService: DataService,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    private jwtService: JwtService,
    private utilitiesService: UtilitiesService,
    public location: Location
  ) {
    this.dataService.setPageStatus.subscribe((res) => {
      this.pageStatus = res;
    });
  }

  ngOnInit(): void {
    this.initializeForm();
    this.route.queryParams.subscribe((param) => {
      this.appraisalCycleId = param.appraisalCycleId;
      if (param.employeePerformId) {
        this.employeePerformId = param.employeePerformId;
        this.disableField = true;
      }
      this.objectiveId = param.objectiveId;
      this.status = param.start;
      this.pageStatus = +param.pageStatus;
      if (this.appraisalCycleId) {
        // this.getSingleEmployeeObjective();
        this.getComment(this.objectiveId);
      }
      /* if (this.pageStatus === 1) {
        // this.getSingleEmployeeObjective();
      }*/
    });
    /*const user = JSON.parse(localStorage.getItem("userDetails"));
    if (user) {
      this.staffId = user.staffId;
      this.deptId = user.departmentId;
    }*/
    this.jwtService.getHrmUserDetails().then((employee) => {
      if (employee) {
        this.jobGradeId = employee.jobGrade;
        this.staffId = employee.employeeId;
        this.deptId = employee.departmentId;
        // this.getAppraisalCycle();
        if (this.appraisalCycleId) {
          this.getSingleEmployeeObjective();
          // this.getComment(this.objectiveId);
        }
        this.getCareer(employee.employeeId);
      }
    });
    // this.getAppraisalCycle();
  }
  initializeForm() {
    this.appraisalObjectiveForm = this.formbuilder.group({
      id: [0],
      reviewYear: [""],
      reviewPeriod: [""],
      employee: [""],
      lineManager: [""],
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
  getComment(id: number) {
    return this.performanceManagementService
      .getComment(id)
      .subscribe((data) => {
        if (data) {
          this.appraisalObjectiveForm.patchValue({
            comment: data,
          });
        }
      });
  }
  getAppraisalCycle() {
    // // this.loadingService.show();
    return this.performanceManagementService
      .getEmployeeAppraisalCycle(
        this.staffId,
        this.deptId,
        this.jobGradeId,
        this.appraisalCycleId
      )
      .subscribe(
        (data) => {
          // this.loadingService.hide();
          this.appraisalCycles = data;
        },
        (err) => {
          // this.loadingService.hide();
        }
      );
  }

  getCareer(id) {
    // // this.loadingService.show();
    return this.performanceManagementService.getCareerByStaffId(id).subscribe(
      (data) => {
        // // this.loadingService.hide();
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
          lineManager: this.employeeAppraisalInfo.line_ManagerId,
          department: this.deptId,
          appraisalCycleId: this.appraisalCycleId,
          firstReviewer: this.employeeAppraisalInfo.first_Level_ReviewerId,
          secondReviewer: this.employeeAppraisalInfo.second_Level_ReviewerId,
          thirdReviewer: this.employeeAppraisalInfo.third_Level_ReviewerId,
          jobGradeId: this.employeeAppraisalInfo.job_GradeId,
        });
      },
      (err) => {
        // // this.loadingService.hide();
      }
    );
  }

  viewObjectives() {
    const payload = this.appraisalObjectiveForm.value;
    payload.reviewYear = +this.reviewYear;
    payload.reviewPeriod = this.reviewPeriod;
    payload.appraisalCycleId = +this.appraisalCycleId;
    payload.id = +this.employeePerformId;
    if (!payload.id) {
      payload.id = 0;
    }
    // this.loadingService.show();
    return this.performanceManagementService.startAppraisal(payload).subscribe(
      (res) => {
        // this.loadingService.hide();
        const message = res["status"].message.friendlyMessage;
        if (res["status"].isSuccessful) {
          this.status = "false";
          this.employeePerformId = res.list[0].employeePerformId;
          /* this.utilitiesService.showMessage(res, "success").then(() => {
            // this.getSingleEmployeeObjective();


            // const url = this.router
            //   .createUrlTree([], {
            //     relativeTo: this.route,
            //     queryParams: {
            //       appraisalCycleId: this.appraisalCycleId,
            //       objectiveId: this.objectiveId,
            //     },
            //   })
            //   .toString();
            //
            // this.location.go(url);
          });*/
          // this.router.navigate(["/performance/appraisal-objectives"], {
          //   queryParams: {
          //     appraisalCycleId: this.appraisalCycleId,
          //     objectiveId: this.objectiveId,
          //   },
          // });
        } else {
          return this.utilitiesService.showMessage(res, "error");
        }
      },
      (err) => {
        // this.loadingService.hide();
        return this.utilitiesService.showMessage(err, "error");
      }
    );
  }
  getSingleEmployeeObjective() {
    // this.loadingService.show();
    return this.performanceManagementService
      .getSingleEmployeeObjective(this.staffId, this.employeePerformId)
      .subscribe(
        (data) => {
          // console.log(data);
          // this.loadingService.hide();
          this.lineManagerId = data[0].lineManger;
          this.objectiveId = data[0].id;
          const year = data[0].reviewYear;
          this.getAppraisalPeriods(year);
          this.reviewYear = data[0].reviewYear;
          this.reviewPeriod = data[0].reviewPeriod;
          // console.log(this.lineManagerId);
          // this.appraisalObjectiveForm.patchValue({
          //   reviewYear: data[0].reviewYear,
          //   reviewPeriod: data[0].reviewPeriod,
          // });
        },
        (err) => {
          // this.loadingService.hide();
        }
      );
  }

  getAppraisalPeriods(value: any) {
    // this.reviewPeriods$ =
    this.performanceManagementService
      .getAppraisalPeriods(value)
      .subscribe((res) => {
        this.reviewPeriods = res;
      });
  }

  getValue(value: any) {
    const item = this.reviewPeriods.find((item) => item.period === value);
    this.appraisalCycleId = item.appraisalCycleId;
    this.employeePerformId = item.employeePerformId;
    // this.status = "false";
  }

  sendToLineManager() {
    return this.performanceManagementService
      .saveObjectives(+this.employeePerformId)
      .subscribe(
        (res) => {
          // this.loadingService.hide();
          const message = res.status.message.friendlyMessage;
          this.dataService.setPageStatus.emit(1);
          if (res.status.isSuccessful) {
            return this.utilitiesService.showMessage(res, "success");
          } else {
            this.utilitiesService.showMessage(res, "error");
          }
        },
        (err) => {
          // this.loadingService.hide();
          return this.utilitiesService.showMessage(err, "error");
        }
      );
  }
}
