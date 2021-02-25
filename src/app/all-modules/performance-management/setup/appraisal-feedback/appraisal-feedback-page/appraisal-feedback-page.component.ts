import { SetupService } from "src/app/services/setup.service";
import { Validators } from "@angular/forms";
import { Component, OnInit, ElementRef, Input, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { PerformanceManagementService } from "src/app/services/performance-management.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import { Location } from "@angular/common";
import swal from "sweetalert2";
declare const $: any;

@Component({
  selector: "app-appraisal-feedback-page",
  templateUrl: "./appraisal-feedback-page.component.html",
  styleUrls: ["./appraisal-feedback-page.component.css"],
})
export class AppraisalFeedbackPageComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  cardFormTitle: string;
  pageLoading: boolean = false; // controls the visibility of the page loader
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
  jobGrade: any;
  submittedForReview: any;
  reviewCycleStatus: any;
  dueDate: string = "";
  table: any;

  public offices: number[] = [];

  constructor(
    private FormBuilder: FormBuilder,
    private performanceManagementService: PerformanceManagementService,
    private utilitiesService: UtilitiesService,
    private setupService: SetupService,
    private _location: Location
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
      startTitle: this.startTitle,
      endDate: this.jobGrade,
      submittedForReview: this.submittedForReview,
      reviewCycleStatus: this.reviewCycleStatus,
      dueDate: this.dueDate,
      table: this.table,
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
            this.startTitle = "";
            this.jobGrade = "";
            this.submittedForReview = "";
            this.reviewCycleStatus = "";
            this.dueDate = "";
            this.table = "";
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
    this.pageLoading = true;
    this.performanceManagementService.getAppraisalFeedbacks().subscribe(
      (data) => {
        this.pageLoading = false;
        this.appraisalFeedbacks = data.setupList;
      },
      (err) => {
        this.pageLoading = false;
      }
    );
  }

  edit(row) {
    this.cardFormTitle = "Edit Point Settings";
    this.appraisalFeedbackForm.patchValue({
      id: row.id,
      reviewPeriod: row.reviewPeriod,
      company: row.company,
      startTitle: row.startTitle,
      jobGrade: row.jobGrade,
      submittedForReview: row.submittedForReview,
      reviewCycleStatus: row.reviewCycleStatus,
      dateDue: row.dateDue,
      table: row.table,
    });
    $("#appraisal_feedback_modal").modal("show");
  }

  // Fixes the misleading error message "Cannot find a differ supporting object '[object Object]'"
  hack(val: any[]) {
    return Array.from(val);
  }

  onSelectedFile(event: Event, form: FormGroup) {
    this.utilitiesService.uploadFileValidator(event, form, this.staffId);
  }

  // Prevents the edit modal from popping up when checkbox is clicked
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
          this.pageLoading = true;
          return this.performanceManagementService
            .deleteAppraisalFeedback(payload)
            .subscribe(
              (res) => {
                this.pageLoading = false;
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
                this.pageLoading = false;
              }
            );
        }
      });
    this.selectedId = [];
  }
}
