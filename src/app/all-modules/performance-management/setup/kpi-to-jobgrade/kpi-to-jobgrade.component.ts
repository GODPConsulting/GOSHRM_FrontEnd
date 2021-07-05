import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable, Subject } from "rxjs";
import { PerformanceManagementService } from "src/app/services/performance-management.service";
import { SetupService } from "src/app/services/setup.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";
import { LoadingService } from "../../../../services/loading.service";
import { ISearchColumn } from "../../../../interface/interfaces";
import { totalmem } from "os";

declare const $: any;
interface Indicator {
  kpi: number;
  categoryId?: number;
  weight?: number;
}
@Component({
  selector: "app-kpi-to-jobgrade",
  templateUrl: "./kpi-to-jobgrade.component.html",
  styleUrls: ["./kpi-to-jobgrade.component.css"],
})
export class KpiToJobgradeComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  public dtWeightOptions: DataTables.Settings = {};
  public kpiToJobGrades: any;
  public spinner: boolean = false;
  public formTitle = "Add KPI To Job Grade";
  public kpiToJobGradeForm: FormGroup;
  public selectedId: number[] = [];
  public jobGrades$: Observable<any> = this.setupService.getJobGrades();
  public kpiCategories$: Observable<any> = this.performanceService.getKpiCategory();
  public source = [];
  public confirmed = [];
  weightSummary: any = [];
  dtTrigger: Subject<any> = new Subject();
  dtWeightTrigger: Subject<any> = new Subject();
  cols: ISearchColumn[] = [];
  selectedValues: any[] = [];
  weightSummaryCols: ISearchColumn[] = [];
  indicators: Indicator[] = [];
  payload: any[] = [];
  tempArr: any[] = [];
  totalWeight: number = 100;
  constructor(
    private setupService: SetupService,
    private performanceService: PerformanceManagementService,
    private formBuilder: FormBuilder,
    private utilitiesService: UtilitiesService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.cols = [
      {
        header: "jobGradeName",
        field: "jobGradeName",
      },
      {
        header: "kpiCategoryName",
        field: "kpiCategoryName",
      },
      {
        header: "weight",
        field: "weight",
      },
      {
        header: "kpIsNameList",
        field: "kpIsNameList",
      },
    ];
    this.weightSummaryCols = [
      {
        header: "jobGradeName",
        field: "jobGradeName",
      },
      {
        header: "weight",
        field: "weight",
      },
    ];
    this.initializeForm();
    this.getKpiToJobGrades();
  }

  initializeForm() {
    this.formTitle = "Add KPI To Job Grade";
    this.kpiToJobGradeForm = this.formBuilder.group({
      id: [0],
      jobGradeId: ["", Validators.required],
      kpiCategoryId: ["", Validators.required],
      weight: ["", Validators.required],
      kpIs: [[]],
    });
    this.source = [];
    this.confirmed = [];
  }
  edit(row) {
    console.log(row);
    this.getKpiByKpiCategoryId(row.kpiCategoryId, "edit");
    this.formTitle = "Edit KPI To Job Grade";
    this.kpiToJobGradeForm.patchValue({
      id: row.id,
      jobGradeId: row.jobGradeId,
      kpiCategoryId: row.kpiCategoryId,
      weight: row.weight,
      //kpIs: row.kpIs
    });
    $("#add_kpi_to_job_grade").modal("show");
    /* this.confirmed = row.kpIs.filter(id=>{
      id === source.id
    }) */
    this.confirmed = this.source.filter((source) => {
      row.kpIs.includes(source.id);
    });
  }
  calculateSum(arr): number {
    return arr.reduce((total, item) => item.weight + total, 0);
  }
  submitKpiToJobGrades(form: FormGroup) {
    // const kpiIds = this.confirmed.map((kpi) => kpi.id);
    // form.get("kpIs").setValue(kpiIds);
    const payload = form.value;
    payload.jobGradeId = +payload.jobGradeId;
    payload.kpiCategoryId = +payload.kpiCategoryId;
    const data = {
      jobGradeId: +payload.jobGradeId,
      payload: this.payload,
    };
    // const sum = this.payload.reduce((total, item) => item.weight + total, 0);
    // if (sum > 100)
    //   return this.utilitiesService.showError(
    //     "Total weight is greater than 100"
    //   );
    if (!form.valid) {
      swal.fire("GOSHRM", "Please fill all mandatory fields", "error");
      return;
    }
    this.spinner = true;
    this.performanceService.postKpiToJobGrade(data).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        this.payload = [];
        this.tempArr = [];
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success").then(() => {
            $("#add_kpi_to_job_grade").modal("hide");
            this.initializeForm();
          });
        } else {
          swal.fire("GOSHRM", message, "error");
        }
        this.getKpiToJobGrades();
      },
      (err) => {
        this.spinner = false;
        this.payload = [];
        this.tempArr = [];
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }
  getKpiNames(arr: Array<any>): string {
    return arr
      .map((item) => {
        console.log(item.kpiName);
        return item.kpiName;
      })
      .toString();
  }
  getScores(arr: any) {
    arr.map((item) => {
      return item.weight;
    });
  }
  getKpiToJobGrades() {
    this.loadingService.show();
    this.performanceService.getKpiToJobGrades().subscribe(
      (data) => {
        this.loadingService.hide();
        this.getWeightSummary();
        // console.log(data);
        this.kpiToJobGrades = data;
        // this.getKpiNames(this.kpiToJobGrades.payloads[0].kpis);
      },
      (err) => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  getKpiByKpiCategoryId(id: number, source: string) {
    // this.confirmed = [];
    console.log(source);
    this.kpiToJobGradeForm.patchValue({
      weight: "",
    });
    this.performanceService.getKpiByKpiCategoryId(id).subscribe(
      (data) => {
        this.source = data.setupList;
      },
      (err) => {}
    );
  }

  getWeightSummary() {
    this.loadingService.show();
    this.performanceService.getKpiToJobGradesWeightSumary().subscribe(
      (data) => {
        this.loadingService.hide();
        console.log(data);
        this.weightSummary = data;
      },
      (err) => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  delete() {
    let payload: object;
    if (this.selectedValues.length === 0) {
      return swal.fire("Error", "Select items to delete", "error");
    } else {
      this.selectedValues.map((item) => {
        this.selectedId.push(item.id);
      });
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
          return this.performanceService.deleteKpiToJobGrade(payload).subscribe(
            (res) => {
              this.loadingService.hide();
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOSHRM", message, "success").then(() => {
                  this.getKpiToJobGrades();
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

  checkAll(event: Event) {
    this.selectedId = this.utilitiesService.checkAllBoxes(
      event,
      this.kpiToJobGrades
    );
  }

  addItemId(event: Event, id: number) {
    this.utilitiesService.deleteArray(event, id, this.selectedId);
  }

  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
  }

  closeModal() {
    this.initializeForm();
    $("#add_kpi_to_job_grade").modal("hide");
  }

  saveItem(form) {
    // console.log(this.confirmed);
    // return;
    const data = form.value;
    if (!data.jobGradeId) {
      return this.utilitiesService.showError("Select Job grade");
    }
    if (!data.kpiCategoryId) {
      return this.utilitiesService.showError("Select KPI category");
    }
    if (!data.weight) {
      return this.utilitiesService.showError("Weight is required");
    }
    let kpiIds: any[] = [];
    // console.log(this.confirmed);
    this.confirmed.forEach((kpi) => {
      kpiIds.push({
        kpiId: kpi.id,
      });
    });
    if (kpiIds.length === 0) {
      return this.utilitiesService.showError("Select KPIs");
    }
    // kpiIds.weight = +data.weight;
    // kpiIds.categoryId = +data.kpiCategoryId;
    // const kpiIds = this.confirmed.map((kpi) => kpi.id);
    const payload = {
      kpis: kpiIds,
      weight: +data.weight,
      kpiCategoryId: +data.kpiCategoryId,
    };
    console.log(payload);
    this.tempArr.push(payload);
    const sum = this.calculateSum(this.tempArr);
    // if (sum < 100) {
    //   this.totalWeight -= sum;
    // }
    if (sum > 100) {
      return this.utilitiesService
        .showError(`Total weight is greater than 100`)
        .then(() => {
          this.tempArr.pop();
        });
    } else {
      this.payload.push(payload);
      this.confirmed = [];
      this.source = [];
    }
  }

  getConfirmed() {
    return this.confirmed;
  }
}
