import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { UtilitiesService } from "../../../services/utilities.service";
import { EmployeeService } from "../../../services/employee.service";
import { PerformanceManagementService } from "../../../services/performance-management.service";
import { Observable } from "rxjs";
import { ThreeSixtyReviewer } from "../../../interface/interfaces";
import { JwtService } from "../../../services/jwt.service";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
declare const $: any;
@Component({
  selector: "app-performance-appraisal-feedback",
  templateUrl: "./performance-appraisal-feedback.component.html",
  styleUrls: ["./performance-appraisal-feedback.component.css"],
})
export class PerformanceAppraisalFeedbackComponent implements OnInit {
  feebackForm: FormGroup;
  employees: any[] = [];
  employees$: Observable<any>;
  revieweeId: number;
  reviewerSelectedById: number;
  reviewers$: Observable<ThreeSixtyReviewer[]>;
  reviewers: ThreeSixtyReviewer[];
  appraisalCycleId: number;
  employeeName: string;
  appraisalFeedbackForm: any;
  constructor(
    private formBuilder: FormBuilder,
    private utilitiesService: UtilitiesService,
    private employeeService: EmployeeService,
    private performanceManagementService: PerformanceManagementService,
    private jwtService: JwtService,
    private route: ActivatedRoute,
    public location: Location
  ) {}

  ngOnInit(): void {
    this.appraisalFeedbackForm = {};
    this.utilitiesService.employee.subscribe((user) => {
      this.employeeName = user;
    });
    this.jwtService.getHrmUserDetails().then((user) => {
      this.reviewerSelectedById = user.employeeId;
    });
    this.route.queryParams.subscribe((param) => {
      this.revieweeId = param.emp;
      this.appraisalCycleId = param.appraisalCycleId;
      this.getAppraisal(this.revieweeId, this.appraisalCycleId);
      this.reviewers$ = this.performanceManagementService.getThreeSixtyReviewers(
        this.revieweeId
      );
      this.getReviewers();
    });
    this.initialiseForm();
    this.employees$ = this.employeeService.getEmployees();
    this.employees$.subscribe((data) => {
      this.employees = data.map((item) => {
        return {
          label: `${item.firstName} ${item.lastName}`,
          id: item.employeeId,
        };
      });
      // console.log(this.employees);
    });
  }
  /* initialiseAppraisalFeedbackForm() {
    this.appraisalFeedbackForm = this.formBuilder.group({
      reviewYear: [''],
      jobGradeName: [''],
      employeeName: [''],
      lengthOfService: [''],
      firstReviewerName: [''],
      jobTitleName: [''],
      firstReviewerPoint: [''],
      secondReviewerName: [''],
      secondReviewerPoint: [''],
      thirdReviewerName: [''],
      firstReviewerRecommendation: [''],
      secondReviewerRecommendation: [''],
      thirdReviewerRecommendation: [''],
      overallRemark: ['']
    })
  }*/
  initialiseForm() {
    this.feebackForm = this.formBuilder.group({
      id: [0],
      reviewerId: [[]],
      revieweeId: [""],
      reviewerSelectedById: [""],
      appraisalCycleId: [""],
    });
  }
  show360Modal() {
    $("#feedback_modal").modal("show");
    if (this.reviewers.length > 0) {
      this.getSelectedReviewers();
    }
  }

  closeScheduleModal() {
    $("#feedback_modal").modal("hide");
    this.initialiseForm();
  }
  getAppraisal(empId: number, appraisalCycleId: number) {
    this.performanceManagementService
      .getPerformanceFeedback(empId, appraisalCycleId)
      .subscribe((data) => {
        const startDate = this.formatDate(data.startDate);
        const endDate = this.formatDate(data.endDate);
        this.appraisalFeedbackForm = data;
        this.appraisalFeedbackForm.startDate = startDate;
        this.appraisalFeedbackForm.endDate = endDate;
      });
  }
  formatDate(date) {
    const d = new Date(date);
    console.log(d);
    let month = d.getMonth() + 1 + "";
    if (month.length == 1) {
      month = "0" + month;
    }
    let day = d.getDate() + "";
    if (day.length == 1) {
      day = "0" + day;
    }
    return `${d.getFullYear()}-${month}-${day}`;
  }
  getReviewers() {
    this.reviewers$.subscribe((data) => {
      this.reviewers = data;
      if (this.reviewers.length > 0) {
        this.getSelectedReviewers();
      }
    });
  }
  getSelectedReviewers() {
    const reviewerIds = this.reviewers.map((item) => {
      return item.reviewerId;
    });
    this.feebackForm.patchValue({
      reviewerId: reviewerIds,
    });
  }
  public onSelectAll() {
    const selected = this.employees.map((item) => item.id);
    this.feebackForm.get("employeeId").patchValue(selected);
  }

  public onClearAll() {
    this.feebackForm.get("employeeId").patchValue([]);
  }

  addThreeSixtyReviewers() {
    // console.log(this.feebackForm.value);
    const payload = this.feebackForm.value;
    payload.revieweeId = +this.revieweeId;
    payload.reviewerSelectedById = +this.reviewerSelectedById;
    payload.appraisalCycleId = +this.appraisalCycleId;
    // console.log(payload);
    return this.performanceManagementService
      .addThreeSixtyReviewer(payload)
      .subscribe(
        (res) => {
          if (res.status.isSuccessful) {
            return this.utilitiesService
              .showMessage(res, "success")
              .then(() => {
                this.getReviewers();
              });
          } else {
            return this.utilitiesService.showMessage(res, "error");
          }
        },
        (err) => {
          return this.utilitiesService.showMessage(err, "error");
        }
      );
  }
}
