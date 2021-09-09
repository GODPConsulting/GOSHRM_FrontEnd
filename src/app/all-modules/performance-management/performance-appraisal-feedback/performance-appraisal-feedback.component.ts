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
  initialiseForm() {
    this.feebackForm = this.formBuilder.group({
      id: [0],
      reviewerId: [[]],
      revieweeId: [""],
      reviewerSelectedById: [""],
    });
  }
  show360Modal() {
    $("#feedback_modal").modal("show");
  }

  closeScheduleModal() {
    $("#feedback_modal").modal("hide");
    this.initialiseForm();
  }
  getAppraisal(empId: number, appraisalCycleId: number) {
    this.performanceManagementService
      .getPerformanceFeedback(empId, appraisalCycleId)
      .subscribe((data) => {
        console.log(data);
      });
  }
  getReviewers() {
    this.reviewers$.subscribe((data) => {
      this.reviewers = data;
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
