import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { PerformanceManagementService } from "src/app/services/performance-management.service";
import { SetupService } from "src/app/services/setup.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";
declare const $: any;

@Component({
  selector: "app-kpi-to-jobgrade",
  templateUrl: "./kpi-to-jobgrade.component.html",
  styleUrls: ["./kpi-to-jobgrade.component.css"],
})
export class KpiToJobgradeComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  public kpiToJobGrades: any[] = [];
  public pageLoading: boolean;
  public spinner: boolean = false;
  public formTitle = "Add KPI To Job Grade";
  public kpiToJobGradeForm: FormGroup;
  public selectedId: number[] = [];
  public jobGrades$: Observable<any> = this.setupService.getJobGrades();
  public kpiCategories$: Observable<any> = this.performanceService.getKpiCategory();
  public source = [];
  public confirmed = [];
  things: any;

  constructor(
    private setupService: SetupService,
    private performanceService: PerformanceManagementService,
    private formBuilder: FormBuilder,
    private utilitiesService: UtilitiesService
  ) {}

  ngOnInit(): void {
    this.dtOptions = {
      dom:
        "<'row'<'col-sm-8 col-md-5'f><'col-sm-4 col-md-6 align-self-end'l>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Start typing to search by any field",
      },
      columns: [{ orderable: false }, null, null, null, null, null],
      order: [[1, "asc"]],
    };
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

  // Set Values To Edit Modal Form
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
    console.log(this.source, row);

    /* this.confirmed = row.kpIs.filter(id=>{
      id === source.id
    }) */
    this.confirmed = this.source.filter((source) => {
      row.kpIs.include(source.id);
    });
  }

  submitKpiToJobGrades(form: FormGroup) {
    const kpiIds = this.confirmed.map((kpi) => kpi.id);
    form.get("kpIs").setValue(kpiIds);
    const payload = form.value;
    payload.jobGradeId = +payload.jobGradeId;
    payload.kpiCategoryId = +payload.kpiCategoryId;
    console.log(payload);
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
        console.log(res);
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  /* DO NOT TAMPER WITH THIS UNNECESARILY!! */
  /* IF YOU MUST, BETTER MAKE A COPY */
  getKpiToJobGrades() {
    this.pageLoading = true;
    this.performanceService.getKpiToJobGrades().subscribe(
      (data) => {
        this.pageLoading = false;
        this.kpiToJobGrades = data.setupList;
        console.log(this.kpiToJobGrades);
        const jgId = this.kpiToJobGrades.map((j) => ({
          jobGrade: j.jobGradeId,
          kpiCat: j.kpiCategoryId,
        }));
        //const jgIdSet = new Set(jgId)

        console.log(jgId /* jgIdSet */);
        /* const this.things = jgId.filter(
          (thing, index, self) =>
            index ===
            self.findIndex(
              (t) => t.jobGrade === thing.jobGrade && t.kpiCat === thing.kpiCat
            )
        );
        console.log(this.things); */
        this.things = this.kpiToJobGrades.filter(
          (thing, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.jobGradeId === thing.jobGradeId &&
                t.kpiCategoryId === thing.kpiCategoryId
            )
        );
        console.log(this.things);

        for (const e of this.things) {
          let k = [];
          for (const kpiJg of this.kpiToJobGrades) {
            if (
              kpiJg.jobGradeId === e.jobGradeId &&
              kpiJg.kpiCategoryId === e.kpiCategoryId
            ) {
              k.push(kpiJg.kpIsName);
            }
          }
          e.allKpis = k;
        }
        console.log(this.things);
      },
      (err) => {
        this.pageLoading = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }
  /* BEWARE!!! */

  getKpiByKpiCategoryId(id: number) {
    this.performanceService.getKpiByKpiCategoryId(id).subscribe(
      (data) => {
        this.source = data.setupList;
        console.log(this.source);
      },
      (err) => {}
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
          this.pageLoading = true;
          return this.performanceService.deleteKpiToJobGrade(payload).subscribe(
            (res) => {
              this.pageLoading = false;
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOSHRM", message, "success").then(() => {
                  this.getKpiToJobGrades();
                });
              } else {
                swal.fire("GOSHRM", message, "error");
              }
            },
            (err) => {}
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

  // Prevents the edit modal from popping up when checkbox is clicked
  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
  }
}
