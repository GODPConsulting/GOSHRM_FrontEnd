import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable, Subject } from "rxjs";
import { PerformanceManagementService } from "src/app/services/performance-management.service";
import { SetupService } from "src/app/services/setup.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";
import { LoadingService } from "../../../../services/loading.service";
import { ISearchColumn } from "../../../../interface/interfaces";

declare const $: any;

@Component({
  selector: "app-kpi-to-jobgrade",
  templateUrl: "./kpi-to-jobgrade.component.html",
  styleUrls: ["./kpi-to-jobgrade.component.css"],
})
export class KpiToJobgradeComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  public dtWeightOptions: DataTables.Settings = {};
  public kpiToJobGrades: any[] = [];
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
      kpIs: [[], Validators.required],
    });
    this.source = [];
    this.confirmed = [];
  }
  edit(row) {
    this.getKpiByKpiCategoryId(row.kpiCategoryId);
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

  submitKpiToJobGrades(form: FormGroup) {
    const kpiIds = this.confirmed.map((kpi) => kpi.id);
    form.get("kpIs").setValue(kpiIds);
    const payload = form.value;
    payload.jobGradeId = +payload.jobGradeId;
    payload.kpiCategoryId = +payload.kpiCategoryId;
    if (!form.valid) {
      swal.fire("GOSHRM", "Please fill all mandatory fields", "error");
      return;
    }
    this.spinner = true;
    this.performanceService.postKpiToJobGrade(payload).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");

          $("#add_kpi_to_job_grade").modal("hide");
        } else {
          swal.fire("GOSHRM", message, "error");
        }
        this.getKpiToJobGrades();
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  getKpiToJobGrades() {
    this.loadingService.show();
    this.performanceService.getKpiToJobGrades().subscribe(
      (data) => {
        this.loadingService.hide();
        this.getWeightSummary();
        this.kpiToJobGrades = data.setupList;
        this.dtTrigger.next();
      },
      (err) => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  getKpiByKpiCategoryId(id: number) {
    this.confirmed = [];
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
        this.weightSummary = data.setupList;
        this.dtWeightTrigger.next();
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
}
