import { Component, OnInit, ElementRef, Input, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SetupService } from "src/app/services/setup.service";
import { PerformanceManagementService } from "src/app/services/performance-management.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import { Location } from "@angular/common";
import swal from "sweetalert2";
import { LoadingService } from "../../../../../services/loading.service";
import { CommonService } from "../../../../../services/common.service";
declare const $: any;
@Component({
  selector: "app-appraisal-cycle-page",
  templateUrl: "./appraisal-cycle-page.component.html",
  styleUrls: ["./appraisal-cycle-page.component.css"],
})
export class AppraisalCyclePageComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  cardFormTitle: string;
  spinner: boolean = false;

  @ViewChild("fileInput")
  fileInput: ElementRef;

  @Input() staffId: number;

  appraisalCyclePageForm: FormGroup;

  performanceAppraisalCycle: any = {};
  years: any[] = [];

  appraisalCycles: any[] = [];
  selectedId: number[] = [];
  company: string;
  reviewYear: string = "";
  startDate: any;
  endDate: any;
  dueDate: any;
  calenderRange: any;
  officeId: string = "";
  reviewerOneWeight: any;
  reviewerTwoWeight: any;
  reviewerThreeWeight: any;
  revieweeWeight: any;
  status: string;
  appraisalCycleForm: any;
  public offices: number[] = [];
  appraisalCycleUploadForm: any;
  dateObj: any;
  formGenerated: any;
  notificationSent: any;
  createdBy: any;
  createdOn: any;
  updatedOn: any;
  updatedBy: any;
  constructor(
    private formBuilder: FormBuilder,
    private performanceManagementService: PerformanceManagementService,
    private utilitiesService: UtilitiesService,
    private setupService: SetupService,
    private loadingService: LoadingService,
    private commonService: CommonService
  ) {
    this.appraisalCycleUploadForm = this.formBuilder.group({
      uploadInput: [""],
    });
  }

  ngOnInit(): void {
    this.getAppraisalCycles();
    this.cardFormTitle = "Add Appraisal Cycle";
    this.createYears(2000, 2050);
    this.getStaffDepartments();
  }

  createYears(from, to) {
    for (let i = from; i <= to; i++) {
      this.years.push({ year: i });
    }
  }

  submitAppraisalCycleForm() {
    const payload = {
      reviewYear: this.reviewYear,
      company: +this.company,
      startDate: this.startDate,
      endDate: this.endDate,
      dueDate: this.dueDate,
      reviewerOneWeight: this.reviewerOneWeight,
      reviewerTwoWeight: this.reviewerTwoWeight,
      reviewerThreeWeight: this.reviewerThreeWeight,
      revieweeWeight: this.revieweeWeight,
      status: +this.status,
      calenderRange: this.calenderRange,
    };

    this.spinner = true;
    return this.performanceManagementService
      .postAppraisalCycle(payload)
      .subscribe(
        (res) => {
          this.spinner = false;
          const message = res.status.message.friendlyMessage;
          if (res.status.isSuccessful) {
            swal.fire("GOSHRM", message, "success");
            $("#appraisal_cycle_modal").modal("hide");

            this.reviewYear = "";
            this.company = "";
            this.startDate = "";
            this.endDate = "";
            this.dueDate = "";
            this.reviewerOneWeight = "";
            this.reviewerTwoWeight = "";
            this.reviewerThreeWeight = "";
            this.revieweeWeight = "";
            this.status = "";
            this.calenderRange = "";
          }

          this.getAppraisalCycles();
        },
        (err) => {
          this.spinner = false;
          const message = err.status.message.friendlyMessage;
          swal.fire("GOSHRM", message, "error");
        }
      );
  }

  getAppraisalCycles() {
    this.loadingService.show();
    this.performanceManagementService.getAppraisalCycles().subscribe(
      (data) => {
        this.loadingService.hide();
        this.appraisalCycles = data.setupList;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  edit(row) {
    this.cardFormTitle = "Edit Appraisal Cycle";
    this.appraisalCycleForm.patchValue({
      id: row.id,
      reviewYear: row.reviewYear,
      company: row.company,
      startDate: row.startDate,
      endDate: row.endDate,
      dueDate: row.dueDate,
      reviewerOneWeight: row.reviewerOneWeight,
      reviewerTwoWeight: row.reviewerTwoWeight,
      reviewerThreeWeight: row.reviewerThreeWeight,
      revieweeWeight: row.revieweeWeight,
      status: row.status,
    });
    $("#appraisal_cycle_modal").modal("show");
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

  getStaffDepartments() {
    this.loadingService.show();
    return this.commonService.getCompanyStructures().subscribe(
      (data) => {
        this.loadingService.hide();
        this.offices = data.companyStructures;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  addItemId(event, id: number) {
    if (event.target.checked) {
      if (!this.selectedId.includes(id)) {
        this.selectedId.push(id);
      }
    } else {
      this.selectedId = this.selectedId.filter((_id) => {
        return _id !== id;
      });
    }
  }

  checkAll(event) {
    if (event.target.checked) {
      this.selectedId = this.performanceAppraisalCycle.map((item) => {
        return item.id;
      });
    } else {
      this.selectedId = [];
    }
  }
}
