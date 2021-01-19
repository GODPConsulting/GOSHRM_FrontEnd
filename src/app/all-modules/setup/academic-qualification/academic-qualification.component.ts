import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SetupService } from "src/app/services/setup.service";

import swal from "sweetalert2";

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
  public pageLoading: boolean;
  public spinner: boolean = false;
  public formTitle: string = "Add Academic Qualification";
  public academicQualificationForm: FormGroup;
  public selectedId: number[] = [];
  public academicQualificationUploadForm: FormGroup;
  public file: File;

  constructor(
    private formBuilder: FormBuilder,
    private setupService: SetupService
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
      columns: [{ orderable: false }, null, null, null],
      order: [[1, "asc"]],
    };
    this.getAcademicQualifications();
    this.initializeForm();
  }

  // Prevents the edit modal from popping up when checkbox is clicked
  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
  }

  // Appends a selected file to "uploadInput"
  onSelectedFile(event) {
    this.file = event.target.files[0];
    this.academicQualificationUploadForm.patchValue({
      uploadInput: this.file,
    });
  }

  downloadFile() {
    this.setupService
      .exportExcelFile("/hrmsetup/download/academic/qualifications")
      .subscribe(
        (resp) => {
          const data = resp;
          if (data != undefined) {
            const byteString = atob(data);
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
            }
            const bb = new Blob([ab]);
            try {
              const file = new File([bb], "Academic Qualification.xlsx", {
                type: "application/vnd.ms-excel",
              });
              console.log(file, bb);
              saveAs(file);
            } catch (err) {
              const textFileAsBlob = new Blob([bb], {
                type: "application/vnd.ms-excel",
              });
              window.navigator.msSaveBlob(
                textFileAsBlob,
                "Deposit Category.xlsx"
              );
            }
          } else {
            return swal.fire(`GOS HRM`, "Unable to download data", "error");
          }
        },
        (err) => {}
      );
  }

  uploadAcademicQualification() {
    if (!this.file) {
      return swal.fire("error", "select a file", "error");
    }
    const formData = new FormData();
    formData.append(
      "uploadInput",
      this.academicQualificationUploadForm.get("uploadInput").value
    );
    this.spinner = true;
    return this.setupService
      .updateData("/hrmsetup/upload/academic/qualification", formData)
      .subscribe(
        (res) => {
          this.spinner = false;
          const message = res.status.message.friendlyMessage;

          if (res.status.isSuccessful) {
            swal.fire("Success", message, "success");
            this.initializeForm();
            this.fileInput.nativeElement.value = "";
            $("#upload_academic_qualification").modal("hide");
          } else {
            swal.fire("Error", message, "error");
          }
          this.getAcademicQualifications();
        },
        (err) => {
          this.spinner = false;
          const message = err.status.message.friendlyMessage;
          swal.fire("Error", message, "error");
        }
      );
  }

  initializeForm() {
    this.academicQualificationForm = this.formBuilder.group({
      id: [0],
      qualification: ["", Validators.required],
      description: ["", Validators.required],
      rank: ["", Validators.required],
    });
    this.academicQualificationUploadForm = this.formBuilder.group({
      uploadInput: [""],
    });
  }

  getAcademicQualifications() {
    this.pageLoading = true;
    return this.setupService
      .getData("/hrmsetup/get/all/academic/qualifications")
      .subscribe(
        (data) => {
          this.pageLoading = false;
          //console.log(data);
          this.qualifications = data.setuplist;
        },
        (err) => {
          this.pageLoading = false;
          console.log(err);
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
    return this.setupService
      .updateData("/hrmsetup/add/update/academic/qualification", payload)
      .subscribe(
        (res) => {
          this.spinner = false;
          const message = res.status.message.friendlyMessage;
          if (res.status.isSuccessful) {
            swal.fire("Success", message, "success");
            this.initializeForm();
            $("#add_academic_qualification").modal("hide");
          } else {
            swal.fire("Error", message, "error");
          }
          this.getAcademicQualifications();
        },
        (err) => {
          this.spinner = false;
          const message = err.status.message.friendlyMessage;
          swal.fire("Error", message, "error");
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
      //console.log(this.selectedId);
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
          return this.setupService
            .deleteData("/hrmsetup/delete/academic/qualification", payload)
            .subscribe(
              (res) => {
                const message = res.status.message.friendlyMessage;
                if (res.status.isSuccessful) {
                  swal.fire("Success", message, "success").then(() => {
                    this.getAcademicQualifications();
                  });
                } else {
                  swal.fire("Error", message, "error");
                }
              },
              (err) => {
                console.log(err);
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
    $("#add_academic_qualification").modal("show");
  }

  closeModal() {
    $("#add_academic_qualification").modal("hide");
    this.initializeForm();
  }

  checkAll(event) {
    if (event.target.checked) {
      this.selectedId = this.qualifications.map((item) => {
        return item.id;
      });
    } else {
      this.selectedId = [];
    }
  }

  addItemId(event, id: number) {
    if (event.target.checked) {
      if (!this.selectedId.includes(id)) {
        this.selectedId.push(id);
      }
    } else {
      this.selectedId = this.selectedId.filter((_id) => {
        return _id !== id;
      });
    }
  }
}
