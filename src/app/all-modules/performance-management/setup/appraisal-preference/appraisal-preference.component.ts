import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PerformanceManagementService } from "src/app/services/performance-management.service";
import swal from "sweetalert2";

import { Observable, Subject } from "rxjs";
import { LoadingService } from "../../../../services/loading.service";
import { CommonService } from "../../../../services/common.service";
import { JwtService } from "../../../../services/jwt.service";
import { AppraisalPreference } from "../../../../interface/interfaces";

@Component({
  selector: "app-appraisal-preference",
  templateUrl: "./appraisal-preference.component.html",
  styleUrls: ["./appraisal-preference.component.css"],
})
export class AppraisalPreferenceComponent implements OnInit {
  appraisalPreferenceForm: FormGroup;
  loading: boolean;
  companies: any[] = [];
  cycles: any[] = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  spinner: boolean;
  jobGradeId: number;
  staffId: number;
  deptId: number;
  offices$: Observable<any>;
  preferences$: Observable<AppraisalPreference[]>;
  constructor(
    private formBuilder: FormBuilder,
    private performanceManagementService: PerformanceManagementService,
    private loadingService: LoadingService,
    private commonService: CommonService,
    private jwtService: JwtService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getCompanies();
    this.getAppraisalPreferences();
    this.jwtService.getHrmUserDetails().then((user) => {
      this.staffId = user.staffId;
      this.jobGradeId = user.jobGrade;
      this.deptId = user.departmentId.toString();
      this.jwtService.getHrmUserDetails().then((user) => {
        this.offices$ = this.commonService.getCompanies(user.staffId);
      });
      // this.getAppraisalCycleByCompanyId();
      // console.log(this.appraisalPreferenceForm.value);
      this.appraisalPreferenceForm.patchValue({
        company: this.deptId,
      });
      this.getAppraisalCycleByCompanyId(this.deptId);
    });
  }

  initializeForm() {
    this.appraisalPreferenceForm = this.formBuilder.group({
      id: [0],
      company: [0],
      appraisalCircle: [0, Validators.required],
      reviewerOneCommentVisibility: [0],
      reviewerTwoCommentVisibility: [0],
      reviewerThreeCommentVisibility: [0],
      status: [0],
      coachPerformanceVisibility: [0],
    });
  }

  addAppraisalPreference(appraisalPreferenceForm) {
    const payload = appraisalPreferenceForm.value;
    payload.company = +payload.company;
    payload.appraisalCircle = +payload.appraisalCircle;
    payload.reviewerOneCommentVisibility = +payload.reviewerOneCommentVisibility;
    payload.reviewerTwoCommentVisibility = +payload.reviewerTwoCommentVisibility;
    payload.reviewerThreeCommentVisibility = +payload.reviewerThreeCommentVisibility;
    payload.status = +payload.status;
    payload.coachPerformanceVisibility = +payload.coachPerformanceVisibility;

    this.loading = true;
    this.performanceManagementService.addAppraisalPreference(payload).subscribe(
      (data) => {
        this.loading = false;
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("Success", message, "success").then(() => {
            this.getAppraisalPreferences();
          });
          // this.initializeForm();
        } else {
          swal.fire("GOSHRM", message, "error");
        }
      },
      (err) => {
        this.loading = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }
  getAppraisalPreferences() {
    this.preferences$ = this.performanceManagementService.getAppraisalPreferences();
  }
  getCompanies() {
    // this.loadingService.show();
    return this.commonService.getCompanyStructures().subscribe(
      (data) => {
        // this.loadingService.hide();
        this.companies = data.companyStructures;
      },
      (err) => {
        // this.loadingService.hide();
      }
    );
  }
  getAppraisalCycleByCompanyId(id) {
    // this.loadingService.show();
    return this.performanceManagementService
      .getAppraisalCycleByCompanyId(id)
      .subscribe(
        (data) => {
          // this.loadingService.hide();
          this.cycles = data;
        },
        (err) => {
          // this.loadingService.hide();
        }
      );
  }
  getAppraisalPreference(id: number) {
    // this.loadingService.show();
    return this.performanceManagementService
      .getAppraisalPreference(id)
      .subscribe(
        (data) => {
          // this.loadingService.hide();
          if (data) {
            this.appraisalPreferenceForm.patchValue({
              id: data.id,
              appraisalCircle: data.appraisalCircle,
              company: data.company,
              reviewerOneCommentVisibility: data.reviewerOneCommentVisibility,
              reviewerTwoCommentVisibility: data.reviewerTwoCommentVisibility,
              reviewerThreeCommentVisibility:
                data.reviewerThreeCommentVisibility,
              status: data.status,
              coachPerformanceVisibility: data.coachPerformanceVisibility,
            });
          }
        },
        (error) => {
          // this.loadingService.hide();
        }
      );
  }
}
