import { Component, OnInit } from "@angular/core";
import { LoadingService } from "../../../../services/loading.service";
import { PerformanceManagementService } from "../../../../services/performance-management.service";
import { JwtService } from "../../../../services/jwt.service";
import {
  Appraisal,
  AppraisalCycle,
  CoachingSchedule,
  IAppraisalCycle,
} from "../../../../interface/interfaces";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { UtilitiesService } from "../../../../services/utilities.service";
import { FormBuilder, FormGroup } from "@angular/forms";
declare const $: any;
@Component({
  selector: "app-appraisal-objective-view",
  templateUrl: "./appraisal-objective-view.component.html",
  styleUrls: ["./appraisal-objective-view.component.css"],
})
export class AppraisalObjectiveViewComponent implements OnInit {
  employeeId: number;
  deptId: number;
  jobGradeId: number;
  employeeAppraisalCycle: IAppraisalCycle[] = [];
  reviewYears$: Observable<any> = this.performanceManagementService.getReviewYears();
  activeIndex: number;
  scheduleForm: FormGroup;
  reviewers$: Observable<any>;
  scheduleTime: string;
  revieweeId: number;
  objectives: any[] = [];
  departmentId: number;
  companyId: number;
  showPortal = false;
  reviewPeriods: any[];
  reviewYear: string = "";
  period: string = "";
  openPeriod: any;
  periods$: Observable<AppraisalCycle[]>;
  appraisalcycleId: string = "";
  constructor(
    private loadingService: LoadingService,
    private performanceManagementService: PerformanceManagementService,
    private jwtService: JwtService,
    private router: Router,
    private utilitiesService: UtilitiesService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    // this.jwtService.getData().subscribe((data) => {
    //   console.log(data);
    // });
    this.jwtService.getHrmUserDetails().then((employee) => {
      this.employeeId = employee.employeeId;
      this.jobGradeId = employee.jobGrade;
      this.deptId = employee.companyId;
      this.getEmployeeAppraisalCycle();
      this.reviewers$ = this.performanceManagementService.getReviewers(
        this.employeeId
      );
      this.periods$ = this.performanceManagementService.getEmployeeCycles(
        this.deptId,
        this.employeeId
      );
      this.getOpenPeriods(this.deptId);
    });
    this.initialiseScheduleForm();
  }
  async getObjectives(id: number, emplooyeePerformId) {
    await this.performanceManagementService
      .getObjectives(id, emplooyeePerformId)
      .subscribe((data) => {
        this.objectives = data.map((item) => {
          return {
            label: item.objectiveName,
            id: item.objectiveId,
          };
        });
      });
  }
  getAppraisalPeriods(value: any) {
    // this.reviewPeriods$ =
    this.performanceManagementService
      .getAppraisalPeriods(value)
      .subscribe((res) => {
        this.reviewPeriods = res;
      });
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
  /* getEmployeeCycles(companyId: number, employeeId: number) {
    this.performanceManagementService
      .getEmployeeCycles(companyId, employeeId)
      .subscribe((data) => {
        this.periods = data;
      });
  }*/

  getOpenPeriods(companyId: number) {
    this.performanceManagementService
      .getOpenCycle(companyId)
      .subscribe((periods) => {
        this.openPeriod = periods;
      });
  }
  getEmployeeAppraisalCycle() {
    // this.loadingService.show();
    return this.performanceManagementService
      .getEmployeeAppraisalCycle(this.employeeId, this.deptId, this.jobGradeId)
      .subscribe(
        (data) => {
          // this.loadingService.hide();
          this.employeeAppraisalCycle = data;
        },
        (err) => {
          // this.loadingService.hide();
        }
      );
  }

  viewCycle(item: any) {
    this.router.navigate(["/performance/appraisal-objective-form"], {
      queryParams: {
        appraisalCycleId: item.appraisalCycleId,
        employeePerformId: item.employeePerformId,
        objectiveId: item.id,
        jobgradeId: item.jobGradeId,
        status: item.status,
        start: true,
        // pageStatus: 1,
      },
    });
  }
  filter(value: any) {
    if (value != 1) {
      return this.performanceManagementService
        .filterObjectves(value, this.employeeId, this.deptId)
        .subscribe((data) => {
          this.employeeAppraisalCycle = data;
        });
    } else {
      return this.getEmployeeAppraisalCycle();
    }
  }

  addObjective() {
    const payload: Appraisal = {
      id: 0,
      employee: this.employeeId,
      appraisalCycleId: 0,
      department: this.deptId,
      jobGradeId: this.jobGradeId,
    };
    return this.performanceManagementService.startAppraisal(payload).subscribe(
      (res) => {
        if (res.status.isSuccessful) {
          this.getEmployeeAppraisalCycle();
        } else {
          return this.utilitiesService.showMessage(res, "error");
        }
      },
      (err) => {
        return this.utilitiesService.showMessage(err, "error");
      }
    );
  }
  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
  }
  tabChange(event: any) {
    this.activeIndex = event.index;
    console.log(this.activeIndex);
  }
  addNewObjective(type: string) {
    switch (type) {
      case "new":
    }
  }
  viewObjective(item) {
    const payload: Appraisal = {
      id: item.employeePerformId,
      employee: item.employeeId,
      appraisalCycleId: item.appraisalCycleId,
      department: item.departmentId,
      jobGradeId: item.jobGradeId,
    };
    return this.performanceManagementService.startAppraisal(payload).subscribe(
      (res) => {
        if (res.status.isSuccessful) {
          this.router.navigate(["/performance/appraisal-objective-form"], {
            queryParams: {
              employeePerformId: item.employeePerformId,
              appraisalCycleId: item.appraisalCycleId,
              objectiveId: item.id,
            },
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

  viewFeedback(item) {
    this.router.navigate(["/performance/appraisal-feedback-page"], {
      queryParams: {
        id: item.employeeId,
        appraisalCycleId: item.appraisalCycleId,
        employeePerformId: item.employeePerformId,
      },
    });
  }
  closeScheduleModal() {
    this.initialiseScheduleForm();
    $("#schedlule_modal").modal("hide");
  }

  showScheduleForm(employeePerformId) {
    this.getObjectives(this.employeeId, employeePerformId).then(() => {
      $("#schedlule_modal").modal("show");
    });
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
    payload.revieweeId = +this.employeeId;
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
  viewSchedule() {
    this.router.navigate(["/performance/coaching-schedules"], {
      queryParams: {
        revieweeId: this.employeeId,
        companyId: this.deptId,
      },
    });
  }

  openPortal() {
    $("#copy_modal").modal("show");
  }

  closePortal() {
    $("#copy_modal").modal("hide");
  }

  copyObjectives() {
    if (!this.appraisalcycleId) {
      return this.utilitiesService.showError("Select a period");
    }
    const payload = {
      appraisalcycleId: +this.appraisalcycleId,
      employeeid: +this.employeeId,
    };
    this.performanceManagementService.copyNewObjectives(payload).subscribe(
      (res) => {
        if (res.status.isSuccessful) {
          this.utilitiesService.showMessage(res, "success").then(() => {
            this.appraisalcycleId = "";
            this.closePortal();
            this.getEmployeeAppraisalCycle();
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
}
