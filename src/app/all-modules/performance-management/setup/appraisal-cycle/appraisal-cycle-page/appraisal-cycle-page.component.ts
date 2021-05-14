import { Component, OnInit, ElementRef, Input, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SetupService } from "src/app/services/setup.service";
import { PerformanceManagementService } from "src/app/services/performance-management.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import { Location } from "@angular/common";
import swal from "sweetalert2";
import { LoadingService } from "../../../../../services/loading.service";
import { CommonService } from "../../../../../services/common.service";
import { IAppraisalCycle } from "../../../../../interface/interfaces";
import { Router } from "@angular/router";

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
  appraisalCycleForm: FormGroup;
  offices: any[] = [];
  appraisalCycleUploadForm: any;
  dateObj: any;
  constructor(
    private formBuilder: FormBuilder,
    private performanceManagementService: PerformanceManagementService,
    private utilitiesService: UtilitiesService,
    private setupService: SetupService,
    private loadingService: LoadingService,
    private commonService: CommonService,
    private router: Router
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
    this.initialiseForm();
  }

  createYears(from, to) {
    for (let i = from; i <= to; i++) {
      this.years.push({ year: i });
    }
  }
  initialiseForm() {
    this.appraisalCycleForm = this.formBuilder.group({
      appraisalCycleId: [0],
      reviewYear: [""],
      startPeriod: [""],
      endPeriod: [""],
      dueDate: [""],
      reviewerOneWeight: [""],
      reviewerTwoWeight: [""],
      reviewerThreeWeight: [""],
      status: [""],
      department: [""],
    });
  }
  submitAppraisalCycleForm(form: FormGroup) {
    const payload: IAppraisalCycle = form.value;
    payload.department = +payload.department;
    payload.status = +payload.status;
    payload.reviewYear = +payload.reviewYear;
    this.loadingService.show();
    return this.performanceManagementService
      .postAppraisalCycle(payload)
      .subscribe(
        (res) => {
          this.loadingService.hide();
          const message = res.status.message.friendlyMessage;
          if (res.status.isSuccessful) {
            swal.fire("GOSHRM", message, "success");
            $("#appraisal_cycle_modal").modal("hide");
            this.initialiseForm();
            this.router.navigate(["/performance/setup/appraisal-cycle"]);
          }
        },
        (err) => {
          this.loadingService.hide();
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
