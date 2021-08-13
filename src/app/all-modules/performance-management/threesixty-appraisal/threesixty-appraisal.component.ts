import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { ActivatedRoute, Params } from "@angular/router";
import { PerformanceManagementService } from "../../../services/performance-management.service";
import { JwtService } from "../../../services/jwt.service";
import { UtilitiesService } from "../../../services/utilities.service";
import { ThreeSixtyFeedback } from "../../../interface/interfaces";
declare const $: any;
interface Preference {
  isReviewerOneInvloved: boolean;
  isReviewertwoInvloved: boolean;
  isReviewerThreeInvloved: boolean;
}
@Component({
  selector: "app-threesixty-appraisal",
  templateUrl: "./threesixty-appraisal.component.html",
  styleUrls: ["./threesixty-appraisal.component.css"],
})
export class ThreesixtyAppraisalComponent implements OnInit {
  appraisalFeedbackForm: FormGroup;
  reviewYears$: Observable<any>;
  preference: Preference;
  reviewer: string;
  commentTitle: string;
  employeeCommentForm: FormGroup;
  formControlName: string;
  spinner: boolean;
  scoreTitle: string;
  employeeScoreForm: FormGroup;
  employeeComments: any[] = [];
  staffId: any;
  personnel: string;
  feedBackId: number;
  employeeComments$: Observable<any>;
  feedbacks$: Observable<any>;
  employeeId: number;
  points$: Observable<any[]>;
  comments: any[] = [];
  companyId: number;
  appraisalCycleId: number;
  reviewerOneId: number;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private performanceManagementService: PerformanceManagementService,
    private jwtService: JwtService,
    private utilitiesService: UtilitiesService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((param: Params) => {
      this.feedBackId = param.id;
      this.employeeId = param.employeeId;
      this.appraisalCycleId = param.appraisalCycleId;
      this.reviewerOneId = param.reviewerOneId;
      // this.appraisalCycleId = param.appraisalCycleId;
      // this.getThreeSixtyFeedback(param.id);
    });
    this.jwtService.getHrmUserDetails().then((user) => {
      this.companyId = user.companyId;
      this.getThreeSixtyFeedback(this.feedBackId, user.companyId);
      this.getFeedBacks(this.employeeId);
    });
    this.points$ = this.performanceManagementService.getPointSettings();
    this.initializeForm();
    this.initialiseEmployeeScore();
    this.initialiseEmployeeComment();
  }
  getFeedBacks(id: number) {
    this.feedbacks$ = this.performanceManagementService.getThreeSixtyAppraisalFeedbacks(
      id
    );
  }
  initializeForm() {
    this.appraisalFeedbackForm = this.fb.group({
      reviewCycle: [""],
      name: [""],
      jobTitle: [""],
      office: [""],
      pointAwarded: [""],
      maxPoint: [""],
      score: [""],
      status: [""],
      reviewer: [""],
    });
  }
  initialiseEmployeeComment() {
    this.employeeCommentForm = this.fb.group({
      commentId: [0],
      staffId: +this.employeeId,
      kpiId: [""],
      comment: [""],
    });
  }
  initialiseEmployeeScore() {
    this.employeeScoreForm = this.fb.group({
      id: [0],
      kpiId: [""],
      staffId: +this.employeeId,
      reviewScore: [""],
    });
  }
  getThreeSixtyFeedback(id, companyId): Subscription {
    return this.performanceManagementService
      .getThreeSixtyFeedback(id, companyId)
      .subscribe((res) => {
        const data = res;
        this.appraisalFeedbackForm.patchValue({
          reviewCycle: data.reviewCycle,
          name: data.revieweeName,
          jobTitle: data.jobTitleName,
          office: data.companyName,
          pointAwarded: data.pointAwarded,
          maxPoint: data.maximumPossiblepoint,
          score: data.score,
          status: data.statusName,
          reviewer: data.reviewerOneName,
        });
      });
  }
  getAppraisalPeriods(value: any) {}

  getValue(value: any) {}

  addComment(id: number, type: string) {
    /*this.personnel = type;
    this.initialiseEmployeeComment();
    switch (type) {
      case "employee":
        this.commentTitle = "Employee Comment";
        this.formControlName = "revieweeComment";
        this.employeeCommentForm.addControl(
          this.formControlName,
          new FormControl()
        );
        break;
      case "reviewer1":
        this.commentTitle = "Reviewer 1 Comment";
        this.formControlName = "reviewerOneComment";
        this.employeeCommentForm.addControl(
          this.formControlName,
          new FormControl()
        );
        break;
      case "reviewer2":
        this.commentTitle = "Reviewer 2 Comment";
        this.formControlName = "reviewertwoComment";
        this.employeeCommentForm.addControl(
          this.formControlName,
          new FormControl()
        );
        break;
      case "reviewer3":
        this.commentTitle = "Reviewer 3 Comment";
        this.formControlName = "reviewerthreeComment";
        this.employeeCommentForm.addControl(
          this.formControlName,
          new FormControl()
        );
        break;
      default:
        this.commentTitle = "";
    }*/
    this.employeeCommentForm.patchValue({
      kpiId: +id,
    });
    $("#appraisal_feedback_page_modal").modal("show");
  }
  addScore(kpiId: number, score: number, type: string) {
    // console.log(id);
    this.personnel = type;
    switch (type) {
      case "employee":
        this.scoreTitle = "Employee Score";
        break;
      case "reviewer1":
        this.scoreTitle = "Reviewer 1 Score";
        break;
      case "reviewer2":
        this.scoreTitle = "Reviewer 2 Score";
        break;
      case "reviewer3":
        this.scoreTitle = "Reviewer 3 Score";
        break;
      default:
        "";
    }
    this.employeeScoreForm.patchValue({
      kpiId: +kpiId,
      reviewScore: +score,
    });
    $("#score_modal").modal("show");
  }
  viewComments(comments, type) {
    /*this.personnel = type;
    switch (type) {
      case "employee":
        this.commentTitle = "Employee Comment";
        break;
      case "reviewer1":
        this.commentTitle = "Reviewer 1 Comment";
        break;
      case "reviewer2":
        this.commentTitle = "Reviewer 2 Comment";
        break;
      case "reviewer3":
        this.commentTitle = "Reviewer 3 Comment";
        break;
      default:
        this.commentTitle = "";
    }*/
    this.comments = comments;
    // console.log(comments, this.comment);
    $("#comment_modal").modal("show");
  }
  submitAppraisalFeedbackPageForm(employeeCommentForm: FormGroup) {}

  saveScore(employeeScoreForm: FormGroup) {
    const payload = employeeScoreForm.value;
    payload.reviewScore = +payload.reviewScore;
    if (!payload.reviewScore) {
      return this.utilitiesService.showError("Score is required");
    }
    this.performanceManagementService.addThreeSixtyScore(payload).subscribe(
      (res) => {
        if (res.status.isSuccessful) {
          return this.utilitiesService.showMessage(res, "success").then(() => {
            $("#score_modal").modal("hide");
            this.initialiseEmployeeScore();
            this.getFeedBacks(this.employeeId);
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

  saveComment(employeeCommentForm: FormGroup) {
    const payload = employeeCommentForm.value;
    if (!payload.comment) {
      return this.utilitiesService.showError("Comment is required");
    }
    this.performanceManagementService.addThreeSixtyComment(payload).subscribe(
      (res) => {
        if (res.status.isSuccessful) {
          return this.utilitiesService.showMessage(res, "success").then(() => {
            $("#appraisal_feedback_page_modal").modal("hide");
            this.initialiseEmployeeComment();
            this.getFeedBacks(this.employeeId);
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

  submitFeedback() {
    const payload: ThreeSixtyFeedback = {
      revieweeId: +this.employeeId,
      employeePerformanceFeedback360Id: +this.feedBackId,
      companyId: +this.companyId,
      reviewerOneId: +this.reviewerOneId,
      appraisalCycleId: +this.appraisalCycleId,
    };
    this.performanceManagementService.sendThreeSixtyFeedback(payload).subscribe(
      (res) => {
        if (res.status.isSuccessful) {
          this.utilitiesService.showMessage(res, "success");
        } else {
          this.utilitiesService.showMessage(res, "error");
        }
      },
      (err) => {
        this.utilitiesService.showMessage(err, "error");
      }
    );
  }
}
