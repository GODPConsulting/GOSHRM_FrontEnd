import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Observable } from "rxjs";
import { EmployeeService } from "../../../services/employee.service";
import { JwtService } from "../../../services/jwt.service";
import { PerformanceManagementService } from "../../../services/performance-management.service";
import { UtilitiesService } from "../../../services/utilities.service";
import {
  KudosComment,
  KudosFeedback,
  KudosScore,
} from "../../../interface/interfaces";
import { Location } from "@angular/common";
declare const $;
@Component({
  selector: "app-others-feedback-kudos",
  templateUrl: "./others-feedback-kudos.component.html",
  styleUrls: ["./others-feedback-kudos.component.css"],
})
export class OthersFeedbackKudosComponent implements OnInit {
  appraisalFeedbackForm: FormGroup;
  employees$: Observable<any[]>;
  feedbacks$: Observable<any[]>;
  commentForm: FormGroup;
  scoreForm: FormGroup;
  points$: Observable<any[]>;
  comment: any[] = [];
  showFeedback: boolean;
  reviewPeriod$: Observable<unknown>;
  reviewerId: number;
  revieweeId: number;
  appraisalCycleId: number;
  companyId: number;
  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private jwtService: JwtService,
    private performanceManagementService: PerformanceManagementService,
    private utilitiesService: UtilitiesService,
    public location: Location
  ) {}

  ngOnInit(): void {
    this.initialiseCommentForm();
    this.initialiseScoreForm();
    this.initialiseForm();
    this.employees$ = this.employeeService.getEmployees();
    this.points$ = this.performanceManagementService.getPointSettings();
    this.jwtService.getHrmUserDetails().then((user) => {
      this.reviewerId = user.employeeId;
      this.companyId = user.companyId;
      this.reviewPeriod$ = this.performanceManagementService.getOpenCycle(
        user.companyId
      );
      this.reviewPeriod$.subscribe((res) => {
        const data = res[0];
        this.appraisalCycleId = data.appraisalCycleId;
        this.appraisalFeedbackForm.patchValue({
          reviewPeriod: data.period,
        });
      });
      this.appraisalFeedbackForm.patchValue({
        reviewerName: `${user.firstName} ${user.lastName}`,
        reviewerJobGrade: user.jobGradeName,
        reviewerJobTitle: user.jobTitleName,
        department: user.companyName,
      });
    });
  }
  initialiseCommentForm() {
    this.commentForm = this.fb.group({
      comment: [""],
      kpiId: [""],
      createdOn: [""],
    });
  }
  initialiseScoreForm() {
    this.scoreForm = this.fb.group({
      reviewScore: [0],
      kpiId: [0],
      appraisalcycle: [0],
      revieweeId: [0],
    });
  }
  getCareerDetails(id) {
    this.revieweeId = +id;
    this.employeeService.getCareerByStaffId(id).subscribe((res) => {
      const employee = res.employeeList[0];
      this.appraisalFeedbackForm.patchValue({
        revieweeJobGrade: employee.job_Grade,
        revieweeJobTitle: employee.job_title,
        office: employee.officeName,
      });
    });
  }
  initialiseForm() {
    this.appraisalFeedbackForm = this.fb.group({
      employee: [""],
      revieweeJobGrade: [""],
      revieweeJobTitle: [""],
      office: [""],
      reviewPeriod: [""],
      lengthOfService: [""],
      reviewerName: [""],
      department: [""],
      reviewerJobGrade: [""],
      reviewerJobTitle: [""],
    });
  }

  addComment(kpiId: any, employee: string) {
    if (!this.revieweeId) {
      return this.utilitiesService.showError("Select an employee to review");
    }
    this.commentForm.patchValue({
      kpiId: +kpiId,
    });
    $("#appraisal_feedback_page_modal").modal("show");
  }

  viewComments(revieweeComment: any, employee: string) {
    this.comment = revieweeComment;
    $("#comment_modal").modal("show");
  }

  addScore(kpiId: any, revieweeScore: any) {
    if (!this.revieweeId) {
      return this.utilitiesService.showError("Select an employee to review");
    }
    this.scoreForm.patchValue({
      reviewScore: revieweeScore.toString(),
      kpiId: +kpiId,
    });
    $("#score_modal").modal("show");
  }

  saveComment(commentForm: FormGroup) {
    const payload: KudosComment = commentForm.value;
    payload.staffId = this.reviewerId;
    payload.appraisalCycleId = this.appraisalCycleId;
    payload.revieweeId = this.revieweeId;
    payload.createdOn = new Date(payload.createdOn);
    console.log(payload);
    this.performanceManagementService.addKudosComment(payload).subscribe(
      (res) => {
        if (res.status.isSuccessful) {
          $("#appraisal_feedback_page_modal").modal("hide");
          this.utilitiesService.showMessage(res, "success").then(() => {
            this.initialiseCommentForm();
            this.feedbacks$ = this.performanceManagementService.getKudosFeedback(
              this.reviewerId
            );
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

  saveScore(scoreForm: FormGroup) {
    const payload: KudosScore = scoreForm.value;
    payload.reviewScore = +payload.reviewScore;
    payload.staffId = this.reviewerId;
    payload.appraisalCycleId = this.appraisalCycleId;
    payload.revieweeId = this.revieweeId;
    console.log(payload);
    this.performanceManagementService.addKudosScore(payload).subscribe(
      (res) => {
        if (res.status.isSuccessful) {
          $("#score_modal").modal("hide");
          this.utilitiesService.showMessage(res, "success").then(() => {
            this.initialiseScoreForm();
            this.feedbacks$ = this.performanceManagementService.getKudosFeedback(
              this.reviewerId
            );
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

  closeCommentModal() {}

  submitFeedback() {
    if (!this.revieweeId) {
      return this.utilitiesService.showError("Select an employee to review");
    }
    const payload: KudosFeedback = {
      appraisalCycleId: this.appraisalCycleId,
      revieweeId: this.revieweeId,
      reviewerOneId: this.reviewerId,
      companyId: this.companyId,
      appraisalNuggetId: 0,
    };
    this.performanceManagementService.sendKudosFeedback(payload).subscribe(
      (res) => {
        if (res.status.isSuccessful) {
          return this.utilitiesService.showMessage(res, "success");
        } else {
          return this.utilitiesService.showMessage(res, "error");
        }
      },
      (err) => {
        return this.utilitiesService.showMessage(err, "error");
      }
    );
  }

  getFeedbacks() {
    if (!this.revieweeId) {
      return this.utilitiesService.showError("Select an employee");
    }
    this.feedbacks$ = this.performanceManagementService.getKudosFeedback(
      this.revieweeId
    );
  }
}
