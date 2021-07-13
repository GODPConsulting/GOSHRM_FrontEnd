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
  selector: "app-academic-qualification",
  templateUrl: "./academic-qualification.component.html",
  styleUrls: [
    "./academic-qualification.component.css",
    "../setup.component.css",
  ],
})
export class AcademicQualificationComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  @ViewChild("fileInput") fileInput: ElementRef;
  public qualifications: any[] = [];
  public spinner: boolean = false;
  public formTitle: string = "Add Academic Qualification";
  public academicQualificationForm: FormGroup;
  public selectedId: number[] = [];
  public academicQualificationUploadForm: FormGroup;
  public file: File;
  selectQualifications: any[];
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
        header: "qualification",
        field: "qualification",
      },
    ];
    this.getAcademicQualifications();
    this.initializeForm();
  }

  downloadFile() {
    // this.loadingService.show();
    this.setupService.downloadAcademicQualification().subscribe(
      (resp) => {
        // this.loadingService.hide();
        this.utilitiesService.byteToFile(resp, "AcademicQualification.xlsx");
      },
      (err) => {
        // this.loadingService.hide();
      }
    );
  }

  uploadAcademicQualification() {
    if (!this.academicQualificationUploadForm.get("uploadInput").value) {
      return swal.fire("error", "select a file", "error");
    }
    const formData = new FormData();
    formData.append(
      "uploadInput",
      this.academicQualificationUploadForm.get("uploadInput").value
    );
    this.spinner = true;
    return this.setupService.uploadAcademicQualification(formData).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;

        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          this.initializeForm();
          this.fileInput.nativeElement.value = "";
          $("#upload_academic_qualification").modal("hide");
        } else {
          swal.fire("GOSHRM", message, "error");
        }
        this.getAcademicQualifications();
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  initializeForm() {
    this.formTitle = "Add Academic Qualification";

    this.academicQualificationForm = this.formBuilder.group({
      id: [0],
      qualification: ["", Validators.required],
      description: [""],
      rank: ["", Validators.required],
    });
    this.academicQualificationUploadForm = this.formBuilder.group({
      uploadInput: [""],
    });
  }

  getAcademicQualifications() {
    // this.loadingService.show();
    return this.setupService.getAcademicQualification().subscribe(
      (data) => {
        // this.loadingService.hide();
        this.qualifications = data.setuplist;
      },
      (err) => {
        // this.loadingService.hide();
      }
    );
  }

  // Add Academic Qualification
  addAcademicQualification(form: FormGroup) {
    if (!form.valid) {
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    const payload: object = form.value;
    this.spinner = true;
    return this.setupService.addAcademicQualification(payload).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          this.initializeForm();
          $("#add_academic_qualification").modal("hide");
        } else {
          swal.fire("GOSHRM", message, "error");
        }
        this.getAcademicQualifications();
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
    if (this.selectQualifications.length === 0) {
      return swal.fire("Error", "Select items to delete", "error");
    }
    this.selectQualifications.map((item) => {
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
          // this.loadingService.show();
          return this.setupService
            .deleteAcademicQualification(payload)
            .subscribe(
              (res) => {
                // this.loadingService.hide();
                const message = res.status.message.friendlyMessage;
                if (res.status.isSuccessful) {
                  swal.fire("GOSHRM", message, "success").then(() => {
                    this.getAcademicQualifications();
                  });
                } else {
                  swal.fire("GOSHRM", message, "error");
                }
              },
              (err) => {
                // this.loadingService.hide();
                this.utilitiesService.showMessage(err, "error");
              }
            );
        }
      });
    this.selectedId = [];
  }

  // To Get The employee Edit Id And Set Values To Edit Modal Form
  editAcademicQualification(row) {
    this.formTitle = "Edit Academic Qualification";
    this.academicQualificationForm.patchValue({
      id: row.id,
      qualification: row.qualification,
      description: row.description,
      rank: row.rank,
    });
    $("#add_academic_qualification").modal("show");
  }

  openUploadModal() {
    $("#upload_academic_qualification").modal("show");
    this.fileInput.nativeElement.value = "";
  }

  openModal() {
    this.initializeForm();
    $("#add_academic_qualification").modal("show");
  }

  closeModal() {
    $("#add_academic_qualification").modal("hide");
  }

  checkAll(event: Event) {
    this.selectedId = this.utilitiesService.checkAllBoxes(
      event,
      this.qualifications
    );
  }

  addItemId(event: Event, id: number) {
    this.utilitiesService.deleteArray(event, id, this.selectedId);
  }

  // Prevents the edit modal from popping up when checkbox is clicked
  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
  }

  // Appends a selected file to "uploadInput"
  onSelectedFile(event: Event, form: FormGroup) {
    this.utilitiesService.uploadFileValidator(event, form, "hr");
  }
}
