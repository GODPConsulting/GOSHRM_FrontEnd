import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Observable } from "rxjs";
import { EmployeeService } from "../../../services/employee.service";
import { JwtService } from "../../../services/jwt.service";
import { PerformanceManagementService } from "../../../services/performance-management.service";

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
  comment: string;
  showFeedback: boolean;
  reviewPeriod$: Observable<unknown>;
  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private jwtService: JwtService,
    private performanceManagementService: PerformanceManagementService
  ) {}

  ngOnInit(): void {
    this.initialiseForm();
    this.initialiseCommentForm();
    this.initialiseScoreForm();
    this.employees$ = this.employeeService.getEmployees();
    this.jwtService.getHrmUserDetails().then((user) => {
      this.reviewPeriod$ = this.performanceManagementService.getOpenCycle(
        user.companyId
      );
      this.reviewPeriod$.subscribe((res) => {
        const data = res[0];
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
    });
  }
  initialiseScoreForm() {
    this.scoreForm = this.fb.group({
      reviewScore: [""],
    });
  }
  getCareerDetails(id) {
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

  addComment(kpiId: any, employee: string) {}

  viewComments(revieweeComment: any, employee: string) {}

  addScore(kpiId: any, revieweeScore: any, employee: string) {}

  saveComment(commentForm: FormGroup) {}

  saveScore(scoreForm: FormGroup) {}

  closeCommentModal() {}
}
