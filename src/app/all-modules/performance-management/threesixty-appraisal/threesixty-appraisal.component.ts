import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { ActivatedRoute, Params } from "@angular/router";
import { PerformanceManagementService } from "../../../services/performance-management.service";
import { JwtService } from "../../../services/jwt.service";
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
  appraisalCycleId: any;
  personnel: string;
  feedBackId: number;
  employeeComments$: Observable<any>;
  feedbacks$: Observable<any>;
  employeeId: number;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private performanceManagementService: PerformanceManagementService,
    private jwtService: JwtService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((param: Params) => {
      this.feedBackId = param.id;
      this.employeeId = param.employeeId;
      this.appraisalCycleId = param.appraisalCycleId;
      // this.getThreeSixtyFeedback(param.id);
    });
    this.jwtService.getHrmUserDetails().then((user) => {
      this.getThreeSixtyFeedback(this.feedBackId, user.companyId);
      this.feedbacks$ = this.performanceManagementService.getThreeSixtyAppraisalFeedbacks(
        this.appraisalCycleId,
        this.employeeId,
        user.staffId
      );
    });
    this.initializeForm();
    this.initialiseEmployeeScore();
    this.initialiseEmployeeComment();
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
      employeeObjectiveFeedbackID: [0],
      staffId: this.staffId,
      appraisalCycleId: +this.appraisalCycleId,
    });
  }
  initialiseEmployeeScore() {
    this.employeeScoreForm = this.fb.group({
      employeeObjectiveFeedbackID: [0],
      score: [""],
      staffId: this.staffId,
      appraisalCycleId: +this.appraisalCycleId,
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
    this.personnel = type;
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
    }
    this.employeeCommentForm.patchValue({
      employeeObjectiveFeedbackID: id,
    });
    $("#appraisal_feedback_page_modal").modal("show");
  }
  addScore(id: number, score: number, type: string) {
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
      employeeObjectiveFeedbackID: id,
      score,
    });
    $("#score_modal").modal("show");
  }
  viewComments(comments, type) {
    this.personnel = type;
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
    }
    this.employeeComments = comments;
    $("#comment_modal").modal("show");
  }
  submitAppraisalFeedbackPageForm(employeeCommentForm: FormGroup) {}

  saveScore(employeeScoreForm: FormGroup) {}

  closeCommentModal() {}
}
