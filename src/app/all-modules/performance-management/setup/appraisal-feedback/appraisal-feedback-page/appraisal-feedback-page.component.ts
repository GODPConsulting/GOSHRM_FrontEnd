import { id } from "./../../../../../../assets/all-modules-data/id";
import { SetupService } from "src/app/services/setup.service";
import { Validators } from "@angular/forms";
import { Component, OnInit, ElementRef, Input, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { PerformanceManagementService } from "src/app/services/performance-management.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import { Location } from "@angular/common";
import swal from "sweetalert2";
import { LoadingService } from "../../../../../services/loading.service";
import { CommonService } from "../../../../../services/common.service";
declare const $: any;

@Component({
  selector: "app-appraisal-feedback-page",
  templateUrl: "./appraisal-feedback-page.component.html",
  styleUrls: ["./appraisal-feedback-page.component.css"],
})
export class AppraisalFeedbackPageComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  cardFormTitle: string;
  spinner: boolean = false;

  @ViewChild("fileInput")
  fileInput: ElementRef;

  @Input() staffId: number;

  //Form
  appraisalFeedbackForm: FormGroup;

  performanceAppraisalFeedback: any = {};
  years: any[] = [];

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

  constructor(
    private formBuilder: FormBuilder,
    private performanceManagementService: PerformanceManagementService,
    private utilitiesService: UtilitiesService,
    private setupService: SetupService,
    private _location: Location,
    private loadingService: LoadingService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.dtOptions = {
      dom:
        "<'row'<'col-sm-8 col-md-5'f><'col-sm-4 col-md-6 align-self-end'l>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Start typing to search by any field",
      },

      columns: [
        { orderable: false },
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ],
      order: [[1, "asc"]],
    };
    this.getAppraisalFeedbacks();
    this.cardFormTitle = "Add Appraisal Feedback";
    this.createYears(2000, 2050);
    this.getJobGrade();
  }

  createYears(from, to) {
    for (let i = from; i <= to; i++) {
      this.years.push({ year: i });
    }
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
    this.loadingService.show();
    this.performanceManagementService
      .getAppraisalFeedbacksByStaffId(2)
      .subscribe(
        (data) => {
          this.loadingService.hide();
          this.appraisalFeedbacks = data.objectiveList;
        },
        (err) => {
          this.loadingService.hide();
        }
      );
  }

  getJobGrade() {
    this.loadingService.show();
    return this.commonService.getJobGrades().subscribe(
      (data) => {
        this.loadingService.hide();

        this.jobGrades = data.setuplist;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  setFeedbackBtn(event) {
    this.tableDisabled = true;
  }

  edit(row) {
    this.cardFormTitle = "Edit Appraisal Feedback";
    this.appraisalFeedbackForm.patchValue({
      id: row.id,
      reviewPeriod: row.reviewPeriod,
      company: row.company,
      startTitle: row.startTitle,
      jobGradeId: row.jobGradeId,
      jobTitleId: row.jobTitleId,
      submittedForReview: row.submittedForReview,
      reviewCycleStatus: row.reviewCycleStatus,
      firstLevelReviewerId: row.firstLevelReviewerId,
      dateDue: row.dateDue,
      table: row.table,
      comment: row.comment,
    });
    $("#appraisal_feedback_modal").modal("show");
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
          this.loadingService.show();
          return this.performanceManagementService
            .deleteAppraisalFeedback(payload)
            .subscribe(
              (res) => {
                this.loadingService.hide();
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
                this.loadingService.hide();
                this.utilitiesService.showMessage(err, "error");
              }
            );
        }
      });
    this.selectedId = [];
  }

  submitAppraisalFeedbackPageForm() {}
}
