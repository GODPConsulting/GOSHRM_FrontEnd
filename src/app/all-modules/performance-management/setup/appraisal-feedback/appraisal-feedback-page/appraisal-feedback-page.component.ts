import { id } from "./../../../../../../assets/all-modules-data/id";
import { SetupService } from "src/app/services/setup.service";
import { FormControl, Validators } from "@angular/forms";
import { Component, OnInit, ElementRef, Input, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { PerformanceManagementService } from "src/app/services/performance-management.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import { Location } from "@angular/common";
import swal from "sweetalert2";
import { LoadingService } from "../../../../../services/loading.service";
import { CommonService } from "../../../../../services/common.service";
import { JwtService } from "../../../../../services/jwt.service";
import { ActivatedRoute, Router } from "@angular/router";
import { catchError } from "rxjs/operators";
import { Observable } from "rxjs";
import { EmployeeService } from "../../../../../services/employee.service";
import { CoachingSchedule } from "../../../../../interface/interfaces";
import * as ClassicEditor from "@ckeditor/ckeditor5-angular";
declare const $: any;

interface Preference {
  isReviewerOneInvloved: boolean;
  isReviewertwoInvloved: boolean;
  isReviewerThreeInvloved: boolean;
}

@Component({
  selector: "app-appraisal-feedback-page",
  templateUrl: "./appraisal-feedback-page.component.html",
  styleUrls: ["./appraisal-feedback-page.component.css"],
})
export class AppraisalFeedbackPageComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  cardFormTitle: string;
  spinner: boolean = false;
  employeeComments: any[] = [];
  @ViewChild("fileInput")
  fileInput: ElementRef;

  @Input() staffId: number;

  //Form
  appraisalFeedbackForm: FormGroup;

  performanceAppraisalFeedback: any = {};
  years: any;
  appraisalFeedbacks: any[] = [];
  selectedId: number[] = [];
  company: string;
  reviewPeriod: string = "";
  startTitle: any;
  jobGradeId: any;
  jobTitleId: any;
  submittedForReview: any;
  reviewCircleStatus: any;
  dueDate: string = "";
  comment: any;
  table: any;
  firstLevelReviewerId: any;
  secondLevelReviewerId: any;
  tableDisabled: boolean = false;
  reviewYear: any;
  job_GradeId: any;
  public offices: number[] = [];
  public jobGrades: any[] = [];
  reviewCycleStatus: any;
  finalComment: any;
  firstLevelReviewer: any;
  secondLevelReviewer: any;
  score: any;
  date: any;
  preference: Preference;
  employeeId: number;
  appraisalCycleId: number;
  reviewer: string;
  employeeCommentForm: FormGroup;
  employeeScoreForm: FormGroup;
  employeeObjectiveFeedbackID: number;
  commentTitle: string;
  scoreTitle: string;
  personnel: string;
  formControlName: string = "";
  employeePerformId: number;
  points$: Observable<any[]>;
  scheduleForm: FormGroup;
  reviewerName: string;
  scheduleDate: string;
  time: any;
  objective: any[] = [];
  scheduleComment: string;
  scheduleTime: string;
  employees$: Observable<any>;
  objectives: any[] = [];
  revieweeId: number;
  companyId: number;
  selectedComments: any[] = [];
  public Editor = ClassicEditor;
  public model = {
    editordata: "",
  };
  public editorConfig = {
    extraPlugins: [],
  };
  constructor(
    private formBuilder: FormBuilder,
    private performanceManagementService: PerformanceManagementService,
    private utilitiesService: UtilitiesService,
    private setupService: SetupService,
    private _location: Location,
    private loadingService: LoadingService,
    private commonService: CommonService,
    private jwtService: JwtService,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private router: Router
  ) {
    this.initialiseFeedbackForm();
  }

  ngOnInit(): void {
    this.employees$ = this.employeeService.getEmployees();
    // this.initialiseFeedbackForm();
    this.route.queryParams.subscribe((param) => {
      this.employeeId = param.id;
      this.appraisalCycleId = param.appraisalCycleId;
      this.employeePerformId = +param.employeePerformId;
      this.getEmployeeAppraisalDetails(this.employeeId);
    });
    this.jwtService.getHrmUserDetails().then((user) => {
      this.staffId = user.employeeId;
      this.companyId = user.companyId;
      this.getAppraisalFeedbacks();
      this.initialiseEmployeeScore();
      this.initialiseEmployeeComment();
      // this.initialiseEmployeeComment();
    });
    // this.getAppraisalFeedbacks();
    this.cardFormTitle = "Appraisal Feedback";
    this.years = this.utilitiesService.createYears(2000, 2050);
    this.getJobGrade();
    this.points$ = this.performanceManagementService.getPointSettings();
    // this.initialiseScheduleForm();
    this.initialiseFeedbackForm();
    this.initialiseScheduleForm();
  }
  initialiseEmployeeComment() {
    this.employeeCommentForm = this.formBuilder.group({
      employeeObjectiveFeedbackID: [0],
      staffId: this.staffId,
      appraisalCycleId: +this.appraisalCycleId,
      employeePerformId: this.employeePerformId,
      comment: [""],
      revieweeComment: [""],
      commentId: [0],
    });
  }
  initialiseEmployeeScore() {
    this.employeeScoreForm = this.formBuilder.group({
      employeeObjectiveFeedbackID: [0],
      score: [""],
      staffId: this.staffId,
      appraisalCycleId: +this.appraisalCycleId,
      employeePerformId: this.employeePerformId,
    });
  }
  initialiseFeedbackForm() {
    this.appraisalFeedbackForm = this.formBuilder.group({
      reviewYear: [""],
      employeeName: [""],
      jobGradeName: [""],
      jobTitleName: [""],
      lengthOfService: [""],
      firstReviewerName: [""],
      secondReviewerName: [""],
      thirdReviewerName: [""],
      timeInPresentPosition: [""],
      startDate: [""],
      endDate: [""],
      overallRemark: [""],
    });
  }
  submitAppraisalFeedbackForm() {
    const payload = {
      reviewPeriod: this.reviewPeriod,
      company: +this.company,
      jobGradeId: this.jobGradeId,
      jobTitleId: this.jobTitleId,
      submittedForReview: this.submittedForReview,
      reviewCircleStatus: this.reviewCircleStatus,
      dueDate: this.dueDate,
      table: this.table,
      comment: this.comment,
      firstLevelReviewerId: this.firstLevelReviewerId,
      secondLevelReviewerId: this.secondLevelReviewerId,
    };

    this.spinner = true;
    return this.performanceManagementService
      .postAppraisalFeedback(payload)
      .subscribe(
        (res) => {
          this.spinner = false;
          const message = res.status.message.friendlyMessage;
          if (res.status.isSuccessful) {
            swal.fire("GOSHRM", message, "success");
            $("#appraisal_feedback_modal").modal("hide");

            this.reviewPeriod = "";
            this.company = "";
            this.jobGradeId = "";
            this.jobTitleId + "";
            this.submittedForReview = "";
            this.reviewCircleStatus = "";
            this.dueDate = "";
            this.table = "";
            this.comment = "";
            this.firstLevelReviewerId = "";
            this.secondLevelReviewerId = "";
          }

          this.getAppraisalFeedbacks();
        },
        (err) => {
          this.spinner = false;
          const message = err.status.message.friendlyMessage;
          swal.fire("GOSHRM", message, "error");
        }
      );
  }

  getAppraisalFeedbacks() {
    // this.loadingService.show();
    this.performanceManagementService
      .getAppraisalFeedback(
        this.employeeId,
        this.staffId,
        this.appraisalCycleId,
        this.employeePerformId
      )
      .subscribe(
        (data) => {
          // this.loadingService.hide();
          if (data.length > 0) {
            this.appraisalFeedbacks = data;
            this.objectives = data.map((item) => {
              return {
                label: item.kpiObjectives,
                id: item.employeeObjectiveIdicatorId,
              };
            });
            // console.log(this.appraisalFeedbacks);
            this.preference = {
              isReviewerOneInvloved: data[0].isReviewerOneInvloved,
              isReviewertwoInvloved: data[0].isReviewertwoInvloved,
              isReviewerThreeInvloved: data[0].isReviewerThreeInvloved,
            };
            this.reviewer = data[0].reviewer;
            this.employeeObjectiveFeedbackID =
              data[0].employeeObjectiveFeedbackID;
          }
        },
        (err) => {
          // this.loadingService.hide();
        }
      );
  }

  getJobGrade() {
    // this.loadingService.show();
    return this.commonService.getJobGrades().subscribe(
      (data) => {
        // this.loadingService.hide();

        this.jobGrades = data.setuplist;
      },
      (err) => {
        // this.loadingService.hide();
      }
    );
  }

  setFeedbackBtn(event) {
    this.tableDisabled = true;
  }

  edit(row) {
    this.cardFormTitle = "Appraisal Feedback";
    // this.appraisalFeedbackForm.patchValue({
    //   id: row.id,
    //   reviewPeriod: row.reviewPeriod,
    //   company: row.company,
    //   startTitle: row.startTitle,
    //   jobGradeId: row.jobGradeId,
    //   jobTitleId: row.jobTitleId,
    //   submittedForReview: row.submittedForReview,
    //   reviewCycleStatus: row.reviewCycleStatus,
    //   firstLevelReviewerId: row.firstLevelReviewerId,
    //   dateDue: row.dateDue,
    //   table: row.table,
    //   comment: row.comment,
    // });
    // $("#appraisal_feedback_modal").modal("show");
  }
  hack(val: any[]) {
    return Array.from(val);
  }

  onSelectedFile(event: Event, form: FormGroup) {
    this.utilitiesService.uploadFileValidator(event, form, this.staffId);
  }
  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
  }

  delete() {
    let payload: object;
    if (this.selectedId.length === 0) {
      return swal.fire("Error", "Select items to delete", "error");
    } else {
      payload = {
        itemIds: this.selectedId,
      };
    }
    swal
      .fire({
        title: "Are you sure you want to delete this record?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!",
      })
      .then((result) => {
        if (result.value) {
          // this.loadingService.show();
          return this.performanceManagementService
            .deleteAppraisalFeedback(payload)
            .subscribe(
              (res) => {
                // this.loadingService.hide();
                const message = res.status.message.friendlyMessage;
                if (res.status.isSuccessful) {
                  swal.fire("GOSHRM", message, "success").then(() => {
                    this.getAppraisalFeedbacks();
                  });
                } else {
                  swal.fire("GOSHRM", message, "error");
                }
              },
              (err) => {
                // this.loadingService.hide();
                this.utilitiesService.showMessage(err, "error");
              }
            );
        }
      });
    this.selectedId = [];
  }

  addComment(id: number, type: string) {
    this.personnel = type;
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
  submitAppraisalFeedbackPageForm() {
    const payload = this.employeeCommentForm.value;
    switch (this.personnel) {
      case "employee":
        return this.submitEmployeeComment(payload);
        break;
      case "reviewer1":
        return this.submitReviewerOneComment(payload);
        break;
      case "reviewer2":
        return this.submitReviewerTwoComment(payload);
        break;
      case "reviewer3":
        return this.submitReviewerThreeComment(payload);
        break;
    }
    // // this.loadingService.show();
    // return this.performanceManagementService
    //   .addEmployeeComment(payload)
    //   .subscribe(
    //     (res) => {
    // //       this.loadingService.hide();
    //       if (res.status.isSuccessful) {
    //         this.utilitiesService.showMessage(res, "success").then(() => {
    //           this.initialiseEmployeeComment();
    //           this.appraisalFeedbacks = res.list;
    //           $("#appraisal_feedback_page_modal").modal("hide");
    //         });
    //       } else {
    //         return this.utilitiesService.showMessage(res, "error");
    //       }
    //     },
    //     (err) => {
    // //       this.loadingService.hide();
    //       return this.utilitiesService.showMessage(err, "error");
    //     }
    //   );
  }
  saveScore(form: FormGroup) {
    const payload = form.value;
    payload.score = +payload.score;
    switch (this.personnel) {
      case "employee":
        return this.submitEmployeeScore(payload);
        break;
      case "reviewer1":
        return this.submitReviewerOneScore(payload);
        break;
      case "reviewer2":
        return this.submitReviewerTwoScore(payload);
        break;
      case "reviewer3":
        return this.submitReviewerThreeScore(payload);
        break;
    }
  }

  submitFeedback(reviewer) {
    switch (reviewer) {
      case "employee":
        return this.submitEmployeeFeedback();
        break;
      case "reviewer1":
        return this.submitReviewerOneFeedback();
        break;
      case "reviewer2":
        return this.submitReviewerTwoFeedback();
        break;
      case "reviewer3":
        return this.submitReviewerThreeFeedback();
        break;
      default:
        return "";
    }
  }
  submitEmployeeFeedback() {
    const payload = {
      appraisalCycleId: +this.appraisalCycleId,
      employee: +this.employeeId,
      employeeObjectiveFeedbackID: this.employeeObjectiveFeedbackID,
    };
    // this.loadingService.show();
    this.performanceManagementService.sendEmployeeFeedback(payload).subscribe(
      (res) => {
        // this.loadingService.hide();
        if (res.status.isSuccessful) {
          this.utilitiesService.showMessage(res, "success");
        } else {
          this.utilitiesService.showMessage(res, "error");
        }
      },
      (err) => {
        // this.loadingService.hide();
        this.utilitiesService.showMessage(err, "error");
      }
    );
  }
  submitReviewerOneFeedback() {
    const payload = {
      appraisalCycleId: +this.appraisalCycleId,
      employee: +this.employeeId,
      employeeObjectiveFeedbackID: this.employeeObjectiveFeedbackID,
    };
    // this.loadingService.show();
    this.performanceManagementService
      .sendReviewerOneFeedback(payload)
      .subscribe(
        (res) => {
          // this.loadingService.hide();
          if (res.status.isSuccessful) {
            this.utilitiesService.showMessage(res, "success");
          } else {
            this.utilitiesService.showMessage(res, "error");
          }
        },
        (err) => {
          // this.loadingService.hide();
          this.utilitiesService.showMessage(err, "error");
        }
      );
  }
  submitReviewerTwoFeedback() {
    const payload = {
      appraisalCycleId: +this.appraisalCycleId,
      employee: +this.employeeId,
      employeeObjectiveFeedbackID: this.employeeObjectiveFeedbackID,
    };
    // this.loadingService.show();
    this.performanceManagementService
      .sendReviewerTwoFeedback(payload)
      .subscribe(
        (res) => {
          // this.loadingService.hide();
          if (res.status.isSuccessful) {
            this.utilitiesService.showMessage(res, "success");
          } else {
            this.utilitiesService.showMessage(res, "error");
          }
        },
        (err) => {
          // this.loadingService.hide();
          this.utilitiesService.showMessage(err, "error");
        }
      );
  }
  submitReviewerThreeFeedback() {
    const payload = {
      appraisalCycleId: +this.appraisalCycleId,
      employee: +this.employeeId,
      employeeObjectiveFeedbackID: this.employeeObjectiveFeedbackID,
    };
    // this.loadingService.show();
    this.performanceManagementService
      .sendReviewerThreeFeedback(payload)
      .subscribe(
        (res) => {
          // this.loadingService.hide();
          if (res.status.isSuccessful) {
            this.utilitiesService.showMessage(res, "success");
          } else {
            this.utilitiesService.showMessage(res, "error");
          }
        },
        (err) => {
          // this.loadingService.hide();
          this.utilitiesService.showMessage(err, "error");
        }
      );
  }

  submitEmployeeComment(payload) {
    // this.loadingService.show();
    return this.performanceManagementService
      .addEmployeeComment(payload)
      .subscribe(
        (res) => {
          // this.loadingService.hide();
          if (res.status.isSuccessful) {
            this.utilitiesService.showMessage(res, "success").then(() => {
              this.initialiseEmployeeComment();
              $("#appraisal_feedback_page_modal").modal("hide");
              // this.appraisalFeedbacks = res.list;
              this.getAppraisalFeedbacks();
            });
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
  submitReviewerOneComment(payload) {
    // this.loadingService.show();
    return this.performanceManagementService
      .addReviewerOneComment(payload)
      .subscribe(
        (res) => {
          // this.loadingService.hide();
          if (res.status.isSuccessful) {
            this.utilitiesService.showMessage(res, "success").then(() => {
              this.initialiseEmployeeComment();
              $("#appraisal_feedback_page_modal").modal("hide");
              // this.appraisalFeedbacks = res.list;
              this.getAppraisalFeedbacks();
            });
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

  submitReviewerTwoComment(payload) {
    // this.loadingService.show();
    return this.performanceManagementService
      .addReviewerTwoComment(payload)
      .subscribe(
        (res) => {
          // this.loadingService.hide();
          if (res.status.isSuccessful) {
            this.utilitiesService.showMessage(res, "success").then(() => {
              this.initialiseEmployeeComment();
              $("#appraisal_feedback_page_modal").modal("hide");
              // this.appraisalFeedbacks = res.list;
              this.getAppraisalFeedbacks();
            });
            // this.appraisalFeedbacks = res.list;
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

  submitReviewerThreeComment(payload) {
    // this.loadingService.show();
    return this.performanceManagementService
      .addReviewerThreeComment(payload)
      .subscribe(
        (res) => {
          // this.loadingService.hide();
          if (res.status.isSuccessful) {
            this.utilitiesService.showMessage(res, "success").then(() => {
              this.initialiseEmployeeComment();
              $("#appraisal_feedback_page_modal").modal("hide");
              // this.appraisalFeedbacks = res.list;
              this.getAppraisalFeedbacks();
            });
            // this.appraisalFeedbacks = res.list;
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

  submitEmployeeScore(payload) {
    // this.loadingService.show();
    return this.performanceManagementService
      .addEmployeeScore(payload)
      .subscribe(
        (res) => {
          // this.loadingService.hide();
          if (res.status.isSuccessful) {
            this.utilitiesService.showMessage(res, "success").then(() => {
              this.initialiseEmployeeScore();
              this.getAppraisalFeedbacks();
              $("#score_modal").modal("hide");
            });
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

  submitReviewerOneScore(payload) {
    // this.loadingService.show();
    return this.performanceManagementService
      .addReviewerOneScore(payload)
      .subscribe(
        (res) => {
          // this.loadingService.hide();
          if (res.status.isSuccessful) {
            this.utilitiesService.showMessage(res, "success").then(() => {
              this.initialiseEmployeeScore();
              this.getAppraisalFeedbacks();
              $("#score_modal").modal("hide");
            });
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
  submitReviewerTwoScore(payload) {
    // this.loadingService.show();
    return this.performanceManagementService
      .addReviewerTwoScore(payload)
      .subscribe(
        (res) => {
          // this.loadingService.hide();
          if (res.status.isSuccessful) {
            this.utilitiesService.showMessage(res, "success").then(() => {
              this.initialiseEmployeeScore();
              this.getAppraisalFeedbacks();
              $("#score_modal").modal("hide");
            });
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
  submitReviewerThreeScore(payload) {
    // this.loadingService.show();
    return this.performanceManagementService
      .addReviewerThreeScore(payload)
      .subscribe(
        (res) => {
          // this.loadingService.hide();
          if (res.status.isSuccessful) {
            this.utilitiesService.showMessage(res, "success").then(() => {
              this.initialiseEmployeeScore();
              this.getAppraisalFeedbacks();
              $("#score_modal").modal("hide");
            });
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

  closeCommentModal() {
    // this.commentTitle = "";
    $("#comment_modal ").modal("hide");
  }

  getEmployeeAppraisalDetails(employeeId: number) {
    // this.loadingService.show();
    return this.performanceManagementService
      .getEmployeeAppraisalDetails(employeeId)
      .subscribe(
        (data) => {
          // this.loadingService.hide();
          if (data) {
            // this.initialiseFeedbackForm();
            this.appraisalFeedbackForm.patchValue({
              reviewYear: data.reviewYear,
              employeeName: data.employeeName,
              jobGradeName: data.jobGradeName,
              jobTitleName: data.jobTitleName,
              lengthOfService: data.lengthOfService,
              firstReviewerName: data.firstReviewerName,
              secondReviewerName: data.secondReviewerName,
              thirdReviewerName: data.thirdReviewerName,
              timeInPresentPosition: data.timeInPresentPosition,
              startDate: data.startDate,
              endDate: data.endDate,
              overallRemark: data.overallRemark,
            });
            this.revieweeId = data.employeeId;
            // this.initialiseFeedbackForm();
          }
        },
        (error) => {
          // this.loadingService.hide();
        }
      );
  }
  initialiseScheduleForm() {
    this.scheduleForm = this.formBuilder.group({
      reviewerId: [""],
      revieweeId: [""],
      date: [""],
      time: [""],
      objectiveId: [[]],
      comment: [""],
    });
  }
  showScheduleForm() {
    $("#schedlule_modal").modal("show");
  }
  onTimeChange(value) {
    var timeSplit = value.split(":"),
      hours,
      minutes,
      meridian;
    hours = timeSplit[0];
    minutes = timeSplit[1];
    if (hours > 12) {
      meridian = "PM";
      hours -= 12;
    } else if (hours < 12) {
      meridian = "AM";
      if (hours == 0) {
        hours = 12;
      }
    } else {
      meridian = "PM";
    }
    this.scheduleTime = hours + ":" + minutes + " " + meridian;
  }
  submitSchedule(form: FormGroup) {
    const payload: CoachingSchedule = form.value;
    payload.revieweeId = +this.revieweeId;
    payload.reviewerId = +payload.reviewerId;
    payload.date = new Date(payload.date);
    // console.log(payload);
    this.performanceManagementService.scheduleCoaching(payload).subscribe(
      (res) => {
        if (res.status.isSuccessful) {
          return this.utilitiesService.showMessage(res, "success").then(() => {
            this.closeScheduleModal();
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

  closeScheduleModal() {
    this.initialiseScheduleForm();
    $("#schedlule_modal").modal("hide");
  }

  viewSchedule() {
    this.router.navigate(["/performance/coaching-schedules"], {
      queryParams: {
        revieweeId: this.revieweeId,
        companyId: this.companyId,
      },
    });
  }

  editComment(row) {
    // appraisal_feedback_page_modal
    $("#comment_modal").modal("hide");
    this.formControlName = "revieweeComment";
    this.employeeCommentForm.addControl(
      this.formControlName,
      new FormControl()
    );
    this.employeeCommentForm.patchValue({
      commentId: row.commentId,
      employeeObjectiveFeedbackID: row.employeeObjectiveFeedbackID,
      staffId: this.staffId,
      appraisalCycleId: +this.appraisalCycleId,
      employeePerformId: this.employeePerformId,
      comment: row.comment,
      revieweeComment: row.comment,
    });
    console.log(this.employeeCommentForm.value);
    $("#appraisal_feedback_page_modal").modal("show");
  }

  deleteComment() {
    if (this.selectedComments.length === 0) {
      return this.utilitiesService.showError("Select comment to delete");
    }
    const commentIds: number[] = [];
    this.selectedComments.map((item) => {
      commentIds.push(item.commentId);
    });
    const payload = {
      itemIds: commentIds,
    };
    this.utilitiesService.confirmDelete().then((value) => {
      if (value.isConfirmed) {
        return this.performanceManagementService
          .deleteComments(payload)
          .subscribe(
            (res) => {
              if (res.status.isSuccessful) {
                return this.utilitiesService
                  .showMessage(res, "success")
                  .then(() => {
                    $("#comment_modal").modal("hide");
                    this.getAppraisalFeedbacks();
                  });
              } else {
                return this.utilitiesService.showMessage(res, "error");
              }
              this.selectedComments = [];
            },
            (err) => {
              return this.utilitiesService.showMessage(err, "error");
            }
          );
      }
    });
  }
}
