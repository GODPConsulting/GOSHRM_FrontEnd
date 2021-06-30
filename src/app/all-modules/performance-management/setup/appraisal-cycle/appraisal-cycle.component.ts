import { SetupService } from "src/app/services/setup.service";
import { Validators } from "@angular/forms";
import { Component, OnInit, ElementRef, Input, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { PerformanceManagementService } from "src/app/services/performance-management.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import { Location } from "@angular/common";
import swal from "sweetalert2";
import { LoadingService } from "../../../../services/loading.service";
import { Subject } from "rxjs";

import { ISearchColumn } from "../../../../interface/interfaces";
import { CommonService } from "../../../../services/common.service";
import { Router } from "@angular/router";

declare const $: any;

@Component({
  selector: "app-appraisal-cycle",
  templateUrl: "./appraisal-cycle.component.html",
  styleUrls: ["./appraisal-cycle.component.css"],
})
export class AppraisalCycleComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  cardFormTitle: string;
  spinner: boolean = false;

  @ViewChild("fileInput")
  fileInput: ElementRef;

  @Input() staffId: number;

  //Form
  appraisalCycleForm: FormGroup;

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
  reviewerWeight: any;
  status: string;
  filteredArray: any[] = [];
  public offices: number[] = [];
  appraisalCycleUploadForm: any;
  public employeesList: any = [];
  dtTrigger: Subject<any> = new Subject();
  cols: ISearchColumn[] = [];
  selectedCycles: any[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private performanceManagementService: PerformanceManagementService,
    private utilitiesService: UtilitiesService,
    private setupService: SetupService,
    private _location: Location,
    private loadingService: LoadingService,
    private commonService: CommonService,
    private _router: Router
  ) {
    this.appraisalCycleUploadForm = this.formBuilder.group({
      uploadInput: [""],
    });
  }

  ngOnInit(): void {
    this.cols = [
      {
        header: "reviewYear",
        field: "reviewYear",
      },
      {
        header: "startDate",
        field: "startDate",
      },
      {
        header: "endDate",
        field: "endDate",
      },
      {
        header: "dueDate",
        field: "dueDate",
      },
      {
        header: "reviewerOneWeight",
        field: "reviewerOneWeight",
      },
      {
        header: "reviewerTwoWeight",
        field: "reviewerTwoWeight",
      },
      {
        header: "reviewerThreeWeight",
        field: "reviewerThreeWeight",
      },
      {
        header: "revieweeWeight",
        field: "revieweeWeight",
      },
      {
        header: "status",
        field: "status",
      },
    ];
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
      reviewerWeight: this.reviewerWeight,
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
            this.reviewerWeight = "";
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
        this.appraisalCycles = data;
        this.dtTrigger.next();
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  edit(row) {
    this._router.navigate(
      ["/performance/setup/appraisal-cycle/appraisal-cycle-page"],
      {
        queryParams: {
          id: row.appraisalCycleId,
        },
      }
    );
    // this.cardFormTitle = "Edit Appraisal Cycle";
    // this.appraisalCycleForm.patchValue({
    //   id: row.id,
    //   reviewYear: row.reviewYear,
    //   company: row.company,
    //   startDate: row.startDate,
    //   endDate: row.endDate,
    //   dueDate: row.dueDate,
    //   reviewerOneWeight: row.reviewerOneWeight,
    //   reviewerTwoWeight: row.reviewerTwoWeight,
    //   reviewerThreeWeight: row.reviewerThreeWeight,
    //   revieweeWeight: row.revieweeWeight,
    //   status: row.status,
    // });
    // $("#appraisal_cycle_modal").modal("show");
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
    if (this.selectedCycles.length === 0) {
      return swal.fire("Error", "Select items to delete", "error");
    } else {
    }
    this.selectedCycles.map((item) => {
      this.selectedId.push(item.appraisalCycleId);
    });
    payload = {
      itemIds: this.selectedId,
    };
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
            .deleteAppraisalCycle(this.selectedId)
            .subscribe(
              (res) => {
                this.loadingService.hide();
                const message = res.status.message.friendlyMessage;
                if (res.status.isSuccessful) {
                  swal.fire("GOSHRM", message, "success").then(() => {
                    this.getAppraisalCycles();
                  });
                } else {
                  swal.fire("GOSHRM", message, "error");
                }
              },
              (err) => {
                this.loadingService.hide();
                const message = err.status.message.friendlyMessage;
                swal.fire("GOSHRM", message, "error");
              }
            );
        }
      });
    this.selectedCycles = [];
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

  filterByCompany(id) {
    if (+id === 0) {
      this.filteredArray = this.appraisalCycles;
    } else {
      this.filteredArray = this.appraisalCycles.filter(
        (item) => item.staffOfficeId === +id
      );
    }
  }

  initializeForm() {
    throw new Error("Method not implemented.");
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

  downloadFile() {}
}
