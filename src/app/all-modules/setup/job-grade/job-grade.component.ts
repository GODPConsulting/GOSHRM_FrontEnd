import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SetupService } from "src/app/services/setup.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";
import { LoadingService } from "../../../services/loading.service";
import { Subject } from "rxjs";
import { ISearchColumn } from "../../../interface/interfaces";

declare const $: any;
@Component({
  selector: "app-job-grade",
  templateUrl: "./job-grade.component.html",
  styleUrls: ["./job-grade.component.css", "../setup.component.css"],
})
export class JobGradeComponent implements OnInit {
  public formTitle: string = "Add Job Grade";
  public dtOptions: DataTables.Settings = {};
  @ViewChild("fileInput") fileInput: ElementRef;
  public jobGradeForm: FormGroup;
  public jobGrades: any[] = [];
  public selectedId: number[] = [];
  public spinner: boolean = false;
  public jobGradeUploadForm: FormGroup;
  dtTrigger: Subject<any> = new Subject();
  selectJobGrades: any[];
  cols: ISearchColumn[];
  constructor(
    private formBuilder: FormBuilder,
    private setupService: SetupService,
    private utilitiesService: UtilitiesService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.getJobGrade();
    this.initializeForm();
    this.cols = [
      {
        header: "job_grade",
        field: "job_grade",
      },
      {
        header: "job_grade_reporting_to",
        field: "job_grade_reporting_to",
      },
      {
        header: "rank",
        field: "rank",
      },
      {
        header: "probation_period_in_months",
        field: "probation_period_in_months",
      },
    ];
  }

  downloadFile() {
    this.loadingService.show();
    this.setupService.exportExcelFile("/hrmsetup/download/jobgrade").subscribe(
      (resp) => {
        this.loadingService.hide();
        this.utilitiesService.byteToFile(resp, "Job Grade.xlsx", {
          type: "application/vnd.ms-excel",
        });
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  uploadJobGrade() {
    if (!this.jobGradeUploadForm.get("uploadInput").value) {
      return swal.fire("Error", "Select a file", "error");
    }
    const formData = new FormData();
    formData.append(
      "uploadInput",
      this.jobGradeUploadForm.get("uploadInput").value
    );
    this.spinner = true;
    return this.setupService.uploadJobGrade(formData).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;

        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          this.initializeForm();
          this.fileInput.nativeElement.value = "";
          $("#upload_job_grade").modal("hide");
        } else {
          swal.fire("GOSHRM", message, "error");
        }
        this.getJobGrade();
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  initializeForm() {
    this.formTitle = "Add Job Grade";

    this.jobGradeForm = this.formBuilder.group({
      id: [0],
      job_grade: ["", Validators.required],
      job_grade_reporting_to: ["", Validators.required],
      rank: ["", Validators.required],
      probation_period_in_months: ["", Validators.required],
      description: [""],
    });
    //initialize upload form
    this.jobGradeUploadForm = this.formBuilder.group({
      uploadInput: [""],
    });
  }

  openUploadModal() {
    // Reset upload form
    this.fileInput.nativeElement.value = "";
    $("#upload_job_grade").modal("show");
  }

  openModal() {
    this.initializeForm();
    $("#add_job_grade").modal("show");
    /* if (this.jobGrades.length === 0) {
      this.jobGradeForm.get("job_grade_reporting_to").disable();
    } else {
      this.jobGradeForm.get("job_grade_reporting_to").enable();
    }*/
  }

  closeModal() {
    $("#add_job_grade").modal("hide");
  }

  getJobGrade() {
    this.loadingService.show();
    return this.setupService.getJobGrades().subscribe(
      (data) => {
        this.loadingService.hide();
        this.jobGrades = data.setuplist;
        this.dtTrigger.next();
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  // Add Job Grade Modal Api Call
  addJobGrade(form: FormGroup) {
    if (!form.valid) {
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    const payload = form.value;

    this.spinner = true;
    return this.setupService.addJobGrade(payload).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          this.initializeForm();
          $("#add_job_grade").modal("hide");
        } else {
          swal.fire("GOSHRM", message, "error");
        }
        this.getJobGrade();
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  delete() {
    let payload: object;
    if (this.selectJobGrades.length === 0) {
      return swal.fire("Error", "Select items to delete", "error");
    }
    this.selectJobGrades.map((item) => {
      this.selectedId.push(item.id);
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
          return this.setupService.deleteJobGrade(payload).subscribe(
            (res) => {
              this.loadingService.hide();
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOSHRM", message, "success").then(() => {
                  this.getJobGrade();
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

  // Set Values To Edit Modal Form
  edit(row) {
    this.formTitle = "Edit Job Grade";
    this.jobGradeForm.patchValue({
      id: row.id,
      job_grade: row.job_grade,
      job_grade_reporting_to: row.job_grade_reporting_to,
      rank: row.rank,
      probation_period_in_months: row.probation_period_in_months,
      description: row.description,
    });
    $("#add_job_grade").modal("show");
  }

  addItemId(event: Event, id: number) {
    this.utilitiesService.deleteArray(event, id, this.selectedId);
  }

  checkAll(event: Event) {
    this.selectedId = this.utilitiesService.checkAllBoxes(
      event,
      this.jobGrades
    );
  }

  // Appends a selected file to "uploadInput"
  onSelectedFile(event: Event, form: FormGroup) {
    this.utilitiesService.uploadFileValidator(event, form, "hr");
  }

  // Prevents the edit modal from popping up when checkbox is clicked
  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
  }
}
