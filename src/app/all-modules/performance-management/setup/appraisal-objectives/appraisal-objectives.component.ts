import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { DataService } from "src/app/services/data.service";
import { PerformanceManagementService } from "src/app/services/performance-management.service";
import { LoadingService } from "../../../../services/loading.service";
import { ISearchColumn, KpiCategory } from "../../../../interface/interfaces";
import { UtilitiesService } from "../../../../services/utilities.service";
import { JwtService } from "../../../../services/jwt.service";
import { forkJoin, Observable, zip } from "rxjs";
import { map } from "rxjs/operators";

declare const $: any;

@Component({
  selector: "app-appraisal-objectives",
  templateUrl: "./appraisal-objectives.component.html",
  styleUrls: ["./appraisal-objectives.component.css"],
})
export class AppraisalObjectivesComponent implements OnInit {
  appraisalObjectives: FormGroup;
  objectives: any[] = [];
  selectedId: number[] = [];
  staffId: any;
  user: any;
  targetDate: any[] = [];
  kpiWeight: any;
  title: string;
  empPermittedList: any[] = [];
  appraisalObjectivesForm: FormGroup;
  kpiCategories: any[] = [];
  cols: ISearchColumn[] = [];
  selectedObjectives: any[] = [];
  addAbleOjectives: any[] = [];
  nonAddAbleOjectives: any[] = [];
  kpiCategoryId: number;
  jobGradeId: number;
  employeeObjectives: any[] = [];
  deptId: number;
  _appraisalCycleId: number;
  _employeePerformId: number;
  _appraisalStatus: number;
  @Input() set appraisalCyleId(value: number) {
    // console.log(value);
    this._appraisalCycleId = value;
  }
  get appraisalCyleId(): number {
    return this._appraisalCycleId;
  }
  @Input() set employeePerformId(value: number) {
    this._employeePerformId = value;
  }
  get employeePerformId(): number {
    return this._employeePerformId;
  }
  @Input() set appraisalStatus(value: number) {
    this._appraisalStatus = value;
  }
  get appraisalStatus(): number {
    return this._appraisalStatus;
  }
  _hasLineManagerApproved: boolean;
  @Input() set hasLineManagerApproved(value) {
    this._hasLineManagerApproved = value;
  }
  get hasLineManagerApproved(): boolean {
    return this._hasLineManagerApproved;
  }
  isEditing: boolean = false;
  kpi: any;
  @Input() objectiveId: number;
  @Input() fromLineManager: boolean = false;
  @Input() employeeId: number;
  @Output() sendData: EventEmitter<any> = new EventEmitter<any>();
  totalWeight: number;
  showOthers: boolean;
  others: string = "";
  KpiIndicatorName: string = "";
  otherSelected: boolean = false;
  constructor(
    private formbuilder: FormBuilder,
    private performanceManagementService: PerformanceManagementService,
    private router: Router,
    private dataService: DataService,
    private loadingService: LoadingService,
    private utilitiesService: UtilitiesService,
    private jwtService: JwtService,
    private route: ActivatedRoute
  ) {
    this.dataService.sendData.subscribe((data) => {
      if (data) {
        return this.sendToLineManager();
      }
    });
  }

  ngOnInit(): void {
    // const user = JSON.parse(localStorage.getItem("userDetails"));
    this.route.queryParams.subscribe((param) => {
      // this.appraisalCyleId = param.appraisalCycleId;
      this.objectiveId = param.objectiveId;
      console.log(this.fromLineManager);
      if (this.fromLineManager) {
        this.staffId = param.employeeId;
        this.jobGradeId = param.jobGradeId;
        this.deptId = param.departmentId;
        this.appraisalCyleId = param.appraisalCycleId;
        this.employeePerformId = param.employeePerformId;
        this.getAddableObjectives(param.jobGradeId);
        this.getEmployeeObjectiveDetails(this.staffId);
      } else {
        this.jwtService.getHrmUserDetails().then((user) => {
          if (user) {
            this.staffId = user.employeeId;
            this.deptId = user.departmentId;
            this.jobGradeId = user.jobGrade;
            this.getAddableObjectives(user.jobGrade);
            this.getEmployeeObjectiveDetails(this.staffId);
          }
        });
      }
    });
    this.jwtService.getHrmUserDetails().then((employee) => {
      if (employee) {
        // this.getEmployeeObjectiveDetails();
        // this.getCannotAddObjectives(employee.jobGrade);
        // this.getData();
      }
    });
    this.initializeForm();
    // this.getAppraisalObjectives(this.staffId);
    // this.getTargetDate();
    // this.getEmployeeObjectives();
    // this.getKPICategories();
    // this.dtOptions = {
    //   drawCallback(setting) {
    //     console.log("setting is  ", setting);
    //     const api = this.api();
    //     const rows = api.rows({ page: "current" }).nodes();
    //     console.log("rows is ", rows);
    //     let last = null;
    //     const columIndex = 0;
    //     api
    //       .column(columIndex, { page: "current" })
    //       .data()
    //       .each(function (group, i) {
    //         if (last !== group) {
    //           $(rows)
    //             .eq(i)
    //             .before(
    //               '<tr style="color: crimson !important;background-color: blanchedalmond;" class="groupColumns"><td style="display: none;"></td><td>' +
    //                 "        " +
    //                 group +
    //                 "</td><td></td></tr>"
    //             );
    //           last = group;
    //         }
    //       });
    //   },
    // };
  }
  initializeForm() {
    this.appraisalObjectivesForm = this.formbuilder.group({
      employeeObjectiveIdicatorId: [0],
      kpiCategoryId: [""],
      successMeasure: [""],
      objective: [""],
      keyActions: [""],
      targetDate: [""],
      weightmodel: [0],
      kpi: [0],
      employeePerformId: [0],
      KpiIndicatorName: [""],
    });
  }

  getAppraisalObjectives(id) {
    // this.loadingService.show();
    return this.performanceManagementService
      .getAppraisalObjectives(id)
      .subscribe(
        (data) => {
          // this.loadingService.hide();
          // this.title = data.empNotPermitedList[0].kpiCategoryName;
          // this.objectives = data.empNotPermitedList[0].kpIsNameList;
          // this.kpiWeight = data.empNotPermitedList[0].weight;
        },
        (err) => {
          // this.loadingService.hide();
        }
      );
  }
  getTargetDate() {
    return this.performanceManagementService
      .getAppraisalCycleByStatus()
      .subscribe(
        (data) => {
          this.targetDate = data.setupList[0].endDate;
        },
        (err) => {}
      );
  }

  closeAppraisalObjectivesModal() {
    $("#appraisal_Objectives_modal").modal("hide");
    this.kpi = "";
    this.KpiIndicatorName = "";
    this.isEditing = false;
    this.otherSelected = false;
    this.initializeForm();
  }

  addItemId($event: Event, id: any) {}

  getKPICategories() {
    this.performanceManagementService.getKpiCategory().subscribe(
      (data) => {
        this.kpiCategories = data["setupList"];
      },
      (err) => {
        return err;
      }
    );
  }

  saveKPIObjective(appraisalObjectivesForm: FormGroup) {
    // debugger;
    const payload = appraisalObjectivesForm.value;
    payload.kpiCategoryId = +this.kpiCategoryId;
    payload.weightmodel = +payload.weightmodel;
    payload.employee = +this.staffId;
    payload.KpiIndicatorName = this.KpiIndicatorName;
    payload.appraisalCycleId = +this.appraisalCyleId;
    payload.department = +this.deptId;
    payload.jobGrade = +this.jobGradeId;
    payload.employeePerformId = +this.employeePerformId;
    payload.otherSelected = this.otherSelected;
    if (this.otherSelected) {
      console.log(this.others);
      payload.KpiIndicatorName = this.others;
    }
    // console.log(payload);
    // return;
    // this.loadingService.show();
    return this.performanceManagementService.addEmployeeKPI(payload).subscribe(
      (res) => {
        // this.loadingService.hide();
        this.utilitiesService.showMessage(res, "success").then(() => {
          this.getEmployeeObjectiveDetails(this.staffId);
          this.getAddableObjectives(this.jobGradeId);
          this.closeAppraisalObjectivesModal();
          this.isEditing = false;
        });
      },
      (err) => {
        // this.loadingService.hide();
        return this.utilitiesService.showMessage(err, "error");
      }
    );
  }
  getObjectiveNames(arr) {
    return arr.forEach((item) => {
      return `<div>Total Weight: ${item.name}: ${item.totalWeight}</div>`;
    });
  }
  getAddableObjectives(id) {
    // this.loadingService.show();
    return this.performanceManagementService
      .getAddableObjectives(id, this.staffId, this.employeePerformId)
      .subscribe(
        (data) => {
          // this.loadingService.hide();
          this.addAbleOjectives = data;
          // console.log(this.getObjectiveNames(this.addAbleOjectives));
          // this.employeeObjectives$ = data;
        },
        (err) => {
          // this.loadingService.hide();
        }
      );
  }
  getCannotAddObjectives(jobGradeId: number) {
    // this.loadingService.show();
    return this.performanceManagementService
      .getCannotAddObjectives(jobGradeId)
      .subscribe(
        (data) => {
          // this.loadingService.hide();
          this.nonAddAbleOjectives = data;
          // this.nonEmployeeObjectives$ = data;
        },
        (err) => {
          // this.loadingService.hide();
        }
      );
  }

  addObjective(item: any) {
    if (this.appraisalStatus != 1) {
      return;
    } else if (this.hasLineManagerApproved) {
      return;
    } else {
      this.kpiCategories = item.kpiIndicators;
      this.kpiCategoryId = item.id;
      this.totalWeight = item.totalWeight;
      $("#appraisal_Objectives_modal").modal("show");
    }
  }

  getEmployeeObjectives() {
    return this.performanceManagementService
      .getEmployeeObjectives(this.staffId)
      .subscribe((data) => {
        this.employeeObjectives = data;
        // const names = this.addAbleOjectives.map((item) => {
        //   return item.name;
        // });
        // console.log(names);
        // this.employeeObjectives.map((objective) => {
        //   return objective.name === this.addAbleOjectives;
        // });
      });
  }
  getEmployeeObjectiveDetails(staffId: number) {
    // this.loadingService.show();
    return this.performanceManagementService
      .getEmployeeObjectiveDetails(
        this.jobGradeId,
        staffId,
        this.deptId,
        this.appraisalCyleId,
        this.employeePerformId
      )
      .subscribe(
        (data) => {
          // this.loadingService.hide();
          this.objectives = data;
        },
        (err) => {
          // this.loadingService.hide();
        }
      );
  }
  editItem(table: any, row) {
    this.isEditing = true;
    if (!table.canEmplyeeAddObjective) {
      return;
    } else if (this.appraisalStatus != 1) {
      return;
    } else if (this.hasLineManagerApproved) {
      return;
    } else {
      const objectives = this.addAbleOjectives.filter((item) => {
        return item.id === table.kpiCategoryId;
      });
      objectives.map((item) => {
        this.kpiCategories = item.kpiIndicators;
      });
      // console.log(this.kpiCategories);
      // console.log({ table }, { row, kpi: row.kpi });
      // this.appraisalObjectivesForm.get("kpi").disable();
      this.kpiCategoryId = table.kpiCategoryId;
      // this.appraisalObjectivesForm.get("kpi").disable();
      this.appraisalObjectivesForm.patchValue({
        employeeObjectiveIdicatorId: row.employeeObjectiveIdicatorId,
        kpiCategoryId: table.kpiCategoryId,
        successMeasure: row.successMeasure,
        objective: row.objective,
        keyActions: row.keyActions,
        targetDate: new Date(row.targetDate).toLocaleDateString("en-CA"),
        weightmodel: row.weightmodel,
        kpi: row.kpi,
        employeePerformId: row.employeePerformId,
      });
      this.KpiIndicatorName = row.kpiName;
      if (row.otherSelected) {
        this.otherSelected = row.otherSelected;
        this.KpiIndicatorName = "0";
        this.others = row.kpiName;
      }
      // this.kpi = row.kpi;
      // this.appraisalObjectivesForm.get("kpi").setValue(row.kpi);
      // this.appraisalObjectivesForm
      //   .get("kpi")
      //   .setValue(row.kpi, { disable: true });
      // this.kpiCategories = table.employeeObjectiveIdicators;
      $("#appraisal_Objectives_modal").modal("show");
    }
  }

  saveObjectives() {
    this.dataService.setPageStatus.emit(1);

    // this.loadingService.show();
    // this.dataService.setPageStatus.emit(1);
  }

  deleteObjective() {
    if (this.selectedId.length === 0) {
      return this.utilitiesService.showError("Select an item to delete");
    }
    this.utilitiesService.confirmDelete().then((res) => {
      if (res.isConfirmed) {
        const payload = {
          itemIds: this.selectedId,
        };
        return this.performanceManagementService
          .deleteObjectives(payload)
          .subscribe(
            (res) => {
              if (res.status.isSuccessful) {
                return this.utilitiesService
                  .showMessage(res, "success")
                  .then(() => {
                    this.selectedId = [];
                    this.getAddableObjectives(this.jobGradeId);
                    this.getEmployeeObjectiveDetails(this.staffId);
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
    });
  }
  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
  }

  sendToLineManager() {
    const { weight, name } = this.checkWeightValue(this.addAbleOjectives);
    if (weight !== 100) {
      return this.utilitiesService.showError(`${name} weight must be 100`);
    } else {
      return this.performanceManagementService
        .saveObjectives(+this.employeePerformId)
        .subscribe(
          (res) => {
            // this.loadingService.hide();
            const message = res.status.message.friendlyMessage;
            this.dataService.setPageStatus.emit(1);
            if (res.status.isSuccessful) {
              return this.utilitiesService.showMessage(res, "success");
            } else {
              this.utilitiesService.showMessage(res, "error");
            }
          },
          (err) => {
            // this.loadingService.hide();
            return this.utilitiesService.showMessage(err, "error");
          }
        );
    }
  }

  checkValue(value: any) {
    if (+value === 0) {
      this.otherSelected = true;
    } else {
      // const item = this.kpiCategories.find((item) => item.id === +value);
      // console.log(item);
      this.otherSelected = false;
    }
  }

  checkAll(event) {
    let ids;
    if (event.target.checked) {
      ids = this.objectives.map((item) => {
        return item.employeeObjectiveIdicators.map((val) => {
          return val.employeeObjectiveIdicatorId;
        });
      });
      this.selectedId = ids.flat();
      // this.selectedId = flattenedArr;
    } else {
      event.target.checked = false;
      this.selectedId = [];
    }
  }

  checkItem(event, employeeObjectiveIdicatorId: number) {
    if (event.target.checked) {
      if (!this.selectedId.includes(employeeObjectiveIdicatorId)) {
        this.selectedId.push(employeeObjectiveIdicatorId);
      }
    } else {
      this.selectedId = this.selectedId.filter((_id) => {
        return _id !== employeeObjectiveIdicatorId;
      });
    }
  }

  checkWeightValue(arr: any) {
    for (let i = 0; i < arr.length; i++) {
      return { name: arr[i].name, weight: arr[i].totalWeightFromAppriasal };
    }
  }
  // sendDataOutput() {
  //   console.log("clicked");
  //   this.sendData.emit(this.checkWeightValue(this.addAbleOjectives));
  // }
}
