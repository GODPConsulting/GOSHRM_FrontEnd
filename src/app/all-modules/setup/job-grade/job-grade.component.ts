import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SetupService } from "src/app/services/setup.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";

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
  public pageLoading: boolean;
  public spinner: boolean = false;
  public jobGradeUploadForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private setupService: SetupService,
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
    this.getJobGrade();
    this.initializeForm();
  }

  downloadFile() {
    this.setupService.exportExcelFile("/hrmsetup/download/jobgrade").subscribe(
      (resp) => {
        const data = resp;
        this.utilitiesService.byteToFile(data, "Job Grade.xlsx", {
          type: "application/vnd.ms-excel",
        });
      },
      (err) => {}
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
    this.pageLoading = true;
    return this.setupService.getJobGrades().subscribe(
      (data) => {
        this.pageLoading = false;

        this.jobGrades = data.setuplist;
      },
      (err) => {
        this.pageLoading = false;
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
          return this.setupService.deleteJobGrade(payload).subscribe(
            (res) => {
              this.pageLoading = false;
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOSHRM", message, "success").then(() => {
                  this.getJobGrade();
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
