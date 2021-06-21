import { Component, Input, OnInit } from "@angular/core";
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
  dtOptions: any;
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
  appraisalCyleId: number;
  isEditing: boolean = false;
  kpi: any;
  @Input() objectiveId: number;
  @Input() fromLineManager: boolean = false;
  constructor(
    private formbuilder: FormBuilder,
    private performanceManagementService: PerformanceManagementService,
    private router: Router,
    private dataService: DataService,
    private loadingService: LoadingService,
    private utilitiesService: UtilitiesService,
    private jwtService: JwtService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem("userDetails"));
    if (user) {
      this.staffId = user.staffId;
      this.deptId = user.departmentId;
    }
    this.route.queryParams.subscribe((param) => {
      this.appraisalCyleId = param.appraisalCycleId;
      this.objectiveId = param.objectiveId;
      console.log(this.fromLineManager);
      if (this.fromLineManager) {
        this.staffId = param.employeeId;
        this.jobGradeId = param.jobGradeId;
        this.deptId = param.departmentId;
      }
    });
    this.jwtService.getHrmUserDetails().then((employee) => {
      if (employee) {
        this.jobGradeId = employee.jobGrade;
        this.getAddableObjectives(employee.jobGrade);
        this.getEmployeeObjectiveDetails();
        // this.getCannotAddObjectives(employee.jobGrade);
        // this.getData();
      }
    });
    this.initializeForm();
    this.getAppraisalObjectives(this.staffId);
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
      kpi: [""],
    });
  }

  getAppraisalObjectives(id) {
    this.loadingService.show();
    return this.performanceManagementService
      .getAppraisalObjectives(id)
      .subscribe(
        (data) => {
          this.loadingService.hide();
          // this.title = data.empNotPermitedList[0].kpiCategoryName;
          // this.objectives = data.empNotPermitedList[0].kpIsNameList;
          // this.kpiWeight = data.empNotPermitedList[0].weight;
        },
        (err) => {
          this.loadingService.hide();
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
    this.isEditing = false;
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
    payload.kpi = +this.kpi;
    payload.appraisalCycleId = +this.appraisalCyleId;
    payload.department = +this.deptId;
    payload.jobGrade = +this.jobGradeId;

    // console.log(payload);
    // return;
    this.loadingService.show();
    return this.performanceManagementService.addEmployeeKPI(payload).subscribe(
      (res) => {
        this.loadingService.hide();
        this.utilitiesService.showMessage(res, "success").then(() => {
          this.getEmployeeObjectiveDetails();
          this.closeAppraisalObjectivesModal();
          this.isEditing = false;
        });
      },
      (err) => {
        this.loadingService.hide();
        return this.utilitiesService.showMessage(err, "error");
      }
    );
  }

  getAddableObjectives(id) {
    this.loadingService.show();
    return this.performanceManagementService.getAddableObjectives(id).subscribe(
      (data) => {
        this.loadingService.hide();
        this.addAbleOjectives = data;
        // this.employeeObjectives$ = data;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  getCannotAddObjectives(jobGradeId: number) {
    this.loadingService.show();
    return this.performanceManagementService
      .getCannotAddObjectives(jobGradeId)
      .subscribe(
        (data) => {
          this.loadingService.hide();
          this.nonAddAbleOjectives = data;
          // this.nonEmployeeObjectives$ = data;
        },
        (err) => {
          this.loadingService.hide();
        }
      );
  }

  addObjective(kpiIndicators: any[], kpiCategoryId: number) {
    this.kpiCategories = kpiIndicators;
    this.kpiCategoryId = kpiCategoryId;
    $("#appraisal_Objectives_modal").modal("show");
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
  getEmployeeObjectiveDetails() {
    this.loadingService.show();
    return this.performanceManagementService
      .getEmployeeObjectiveDetails(
        this.jobGradeId,
        this.staffId,
        this.deptId,
        this.appraisalCyleId
      )
      .subscribe(
        (data) => {
          this.loadingService.hide();
          this.objectives = data;
        },
        (err) => {
          this.loadingService.hide();
        }
      );
  }
  editItem(table: any, row) {
    this.isEditing = true;
    if (!table.canEmplyeeAddObjective) {
      return;
    }
    const objectives = this.addAbleOjectives.filter((item) => {
      return item.id === table.kpiCategoryId;
    });
    objectives.map((item) => {
      this.kpiCategories = item.kpiIndicators;
    });
    console.log(this.kpiCategories);
    console.log({ table }, { row, kpi: row.kpi });
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
    });
    this.kpi = row.kpi;
    // this.appraisalObjectivesForm.get("kpi").setValue(row.kpi);
    // this.appraisalObjectivesForm
    //   .get("kpi")
    //   .setValue(row.kpi, { disable: true });
    // this.kpiCategories = table.employeeObjectiveIdicators;
    $("#appraisal_Objectives_modal").modal("show");
  }

  saveObjectives() {
    this.loadingService.show();
    return this.performanceManagementService
      .saveObjectives(+this.objectiveId)
      .subscribe(
        (res) => {
          this.loadingService.hide();
          const message = res.status.message.friendlyMessage;
          if (res.status.isSuccessful) {
            this.utilitiesService.showMessage(res, "success");
          } else {
            this.utilitiesService.showMessage(res, "error");
          }
        },
        (err) => {
          this.loadingService.hide();
          return this.utilitiesService.showMessage(err, "error");
        }
      );
  }
}
