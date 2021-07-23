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
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { JwtService } from "../../../../../services/jwt.service";

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
  offices$: Observable<any>;
  appraisalCycleUploadForm: any;
  dateObj: any;
  constructor(
    private formBuilder: FormBuilder,
    private performanceManagementService: PerformanceManagementService,
    private utilitiesService: UtilitiesService,
    private setupService: SetupService,
    private loadingService: LoadingService,
    private commonService: CommonService,
    private router: Router,
    private _route: ActivatedRoute,
    private jwtService: JwtService
  ) {
    this.appraisalCycleUploadForm = this.formBuilder.group({
      uploadInput: [""],
    });
  }

  ngOnInit(): void {
    this._route.queryParams.subscribe((param) => {
      const id: number = param.id;
      if (id) this.getAppraisalCycle(id);
    });
    this.getAppraisalCycles();
    this.cardFormTitle = "Add Performance Cycle";
    this.createYears(2000, 2050);
    this.jwtService.getHrmUserDetails().then((user) => {
      this.offices$ = this.commonService.getCompanies(user.staffId);
    });
    // this.getStaffDepartments();
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
      revieweeWeight: [""],
      reviewerOneWeight: [""],
      reviewerTwoWeight: [""],
      reviewerThreeWeight: [""],
      status: [""],
      department: [""],
      calenderRange: [""],
      allowMultipleCycle: [false],
    });
  }
  getAppraisalCycle(id: number) {
    this.loadingService.show();
    return this.performanceManagementService.getAppraisalCycle(id).subscribe(
      (res) => {
        this.loadingService.hide();
        this.appraisalCycleForm.patchValue({
          appraisalCycleId: res.appraisalCycleId,
          reviewYear: res.reviewYear,
          startPeriod: new Date(res.startPeriod).toLocaleDateString("en-CA"),
          endPeriod: new Date(res.endPeriod).toLocaleDateString("en-CA"),
          dueDate: new Date(res.dueDate).toLocaleDateString("en-CA"),
          reviewerOneWeight: res.reviewerOneWeight,
          reviewerTwoWeight: res.reviewerTwoWeight,
          reviewerThreeWeight: res.reviewerThreeWeight,
          status: res.status,
          department: res.department,
          revieweeWeight: res.revieweeWeight,
          calenderRange: res.calenderRange,
          allowMultipleCycle: res.allowMultipleCycle,
        });
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  submitAppraisalCycleForm(form: FormGroup) {
    const payload: IAppraisalCycle = form.value;
    payload.department = +payload.department;
    payload.status = +payload.status;
    payload.reviewYear = +payload.reviewYear;
    payload.startPeriod = new Date(payload.startPeriod).toLocaleDateString(
      "en-CA"
    );
    payload.endPeriod = new Date(payload.endPeriod).toLocaleDateString("en-CA");
    payload.dueDate = new Date(payload.dueDate).toLocaleDateString("en-CA");
    const sum =
      payload.revieweeWeight +
      payload.reviewerOneWeight +
      payload.reviewerTwoWeight +
      payload.reviewerThreeWeight;
    if (sum !== 100) {
      return this.utilitiesService.showError(
        `All assigned weight must be 100%, assigned weight is ${sum}`
      );
    }
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
