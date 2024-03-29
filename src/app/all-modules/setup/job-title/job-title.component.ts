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
  selector: "app-job-title",
  templateUrl: "./job-title.component.html",
  styleUrls: ["./job-title.component.css", "../setup.component.css"],
})
export class JobTitleComponent implements OnInit {
  public dtOptions: any = {};
  @ViewChild("fileInput")
  fileInput: ElementRef;
  public jobTitles = [];
  public spinner: boolean = false;
  public formTitle = "Add Job Title";
  public jobTitleForm: FormGroup;
  public selectedId: number[] = [];
  public jobTitleUploadForm: FormGroup;
  selectJobTitle: any[];
  cols: ISearchColumn[];
  constructor(
    private formBuilder: FormBuilder,
    private setupService: SetupService,
    private utilitiesService: UtilitiesService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.cols = [
      {
        header: "job_title",
        field: "job_title",
      },
      {
        header: "totalSkillWeight",
        field: "totalSkillWeight",
      },
    ];
    this.getJobTitle();
    this.initializeForm();
  }

  downloadFile() {
    this.loadingService.show();
    this.setupService.exportExcelFile("/hrmsetup/download/jobtitle").subscribe(
      (resp) => {
        this.loadingService.hide();
        this.utilitiesService.byteToFile(resp, "Job Title.xlsx", {
          type: "application/vnd.ms-excel",
        });
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  uploadJobTitle() {
    if (!this.jobTitleUploadForm.get("uploadInput").value) {
      return swal.fire("Error", "Select a file", "error");
    }
    const formData = new FormData();
    formData.append(
      "uploadInput",
      this.jobTitleUploadForm.get("uploadInput").value
    );
    this.spinner = true;
    return this.setupService.uploadJobTitle(formData).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          this.initializeForm();
          $("#upload_job_title").modal("hide");
        } else {
          swal.fire("GOSHRM", message, "error");
        }
        this.getJobTitle();
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  openUploadModal() {
    this.fileInput.nativeElement.value = "";
    $("#upload_job_title").modal("show");
  }

  initializeForm() {
    this.jobTitleForm = this.formBuilder.group({
      id: [0],
      job_title: ["", Validators.required],
      job_description: [""],
    });
    this.jobTitleUploadForm = this.formBuilder.group({
      uploadInput: [""],
    });
  }

  getJobTitle() {
    this.loadingService.show();
    return this.setupService.getJobTitle().subscribe(
      (data) => {
        this.loadingService.hide();
        this.jobTitles = data.setuplist;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  /*  closeModal() {
    $("#add_job_title").modal("hide");
    this.initializeForm();
  } */

  // Add Job Title  Modal Api Call
  addJobTitle(form: FormGroup) {
    if (!form.valid) {
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    const payload = form.value;

    return this.setupService.addJobTitle(payload).subscribe(
      (res) => {
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          this.initializeForm();
          $("#add_job_title").modal("hide");
        } else {
          swal.fire("GOSHRM", message, "error");
        }
        this.getJobTitle();
      },
      (err) => {
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  // Set Values To Edit Modal Form
  editJobTitle(row) {
    this.formTitle = "Edit Job Title";
    this.jobTitleForm.patchValue({
      id: row.id,
      job_title: row.job_title,
      job_description: row.job_description,
    });
    $("#add_job_title").modal("show");
  }

  delete() {
    let payload: object;
    if (this.selectJobTitle.length === 0) {
      return swal.fire("Error", "Select items to delete", "error");
    }
    this.selectJobTitle.map((item) => {
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
          return this.setupService.deleteJobTitle(payload).subscribe(
            (res) => {
              this.loadingService.hide();
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOSHRM", message, "success").then(() => {
                  this.getJobTitle();
                });
              } else {
                swal.fire("GOSHRM", message, "error");
              }
            },
            (err) => {
              this.loadingService.hide();
              const message = err.status.message.friendlyMessage;
              swal.fire("GOSHRM", message, "error");
            }
          );
        }
      });
    this.selectedId = [];
  }

  addItemId(event: Event, id: number) {
    this.utilitiesService.deleteArray(event, id, this.selectedId);
  }

  checkAll(event: Event) {
    this.selectedId = this.utilitiesService.checkAllBoxes(
      event,
      this.jobTitles
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

  closeModal() {
    $("#upload_job_title").modal("hide");
  }
}
