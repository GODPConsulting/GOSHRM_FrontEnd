import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { SetupService } from "../../../services/setup.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import swal from "sweetalert2";

declare const $: any;
@Component({
  selector: "app-employment-level",
  templateUrl: "./employment-level.component.html",
  styleUrls: ["./employment-level.component.css", "../setup.component.css"],
})
export class EmploymentLevelComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  @ViewChild("fileInput")
  fileInput: ElementRef;
  public levels: any[] = [];
  public employmentLevelForm: FormGroup;
  public file: File;
  public formTitle: string = "Add Employment Level";
  public selectedId: number[] = [];
  public pageLoading: boolean;
  public spinner: boolean = false; // Controls the visibilty of the spinner
  public employmentLevelUploadForm: FormGroup;

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
      columns: [{ orderable: false }, null, null],
      order: [[1, "asc"]],
    };
    this.initializeForm();
    this.getEmploymentLevels();
  }

  // Prevents the edit modal from popping up when checkbox is clicked
  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
  }

  // Appends a selected file to "uploadInput"
  onSelectedFile(event) {
    this.file = event.target.files[0];
    this.employmentLevelUploadForm.patchValue({
      uploadInput: this.file,
    });
  }

  downloadFile() {
    this.setupService
      .exportExcelFile("/hrmsetup/download/employmentlevels")
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
              const file = new File([bb], "Employment Level.xlsx", {
                type: "application/vnd.ms-excel",
              });

              saveAs(file);
            } catch (err) {
              const textFileAsBlob = new Blob([bb], {
                type: "application/vnd.ms-excel",
              });
              window.navigator.msSaveBlob(
                textFileAsBlob,
                "Employment Level.xlsx"
              );
            }
          } else {
            return swal.fire(`GOS HRM`, "Unable to download data", "error");
          }
        },
        (err) => {}
      );
  }

  uploadEmploymentLevel() {
    if (!this.file) {
      return swal.fire("Error", "Select a file", "error");
    }
    const formData = new FormData();
    formData.append(
      "uploadInput",
      this.employmentLevelUploadForm.get("uploadInput").value
    );
    this.spinner = true;
    return this.setupService
      .updateData("/hrmsetup/upload/employmentlevel", formData)
      .subscribe(
        (res) => {
          this.spinner = false;
          const message = res.status.message.friendlyMessage;
          if (res.status.isSuccessful) {
            swal.fire("GOSHRM", message, "success");
            this.initializeForm();
            this.fileInput.nativeElement.value = "";
            $("#upload_employment_level").modal("hide");
          } else {
            swal.fire("Error", message, "error");
          }
          this.getEmploymentLevels();
        },
        (err) => {
          this.spinner = false;
          const message = err.status.message.friendlyMessage;
          swal.fire("Error", message, "error");
        }
      );
  }

  openUploadModal() {
    $("#upload_employment_level").modal("show");
  }

  initializeForm() {
    this.employmentLevelForm = this.formBuilder.group({
      id: [0],
      employment_level: ["", Validators.required],
      description: ["", Validators.required],
    });
    this.employmentLevelUploadForm = this.formBuilder.group({
      uploadInput: [""],
    });
  }

  getEmploymentLevels() {
    this.pageLoading = true;
    return this.setupService
      .getData("/hrmsetup/get/all/emplpymentlevels")
      .subscribe(
        (data) => {
          this.pageLoading = false;
          this.levels = data.setuplist;
        },
        (err) => {
          this.pageLoading = false;

        }
      );
  }

  // Add employment level Api Call
  addEmploymentLevel(form: FormGroup) {
    if (!form.valid) {
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    const payload = form.value;
    this.spinner = true;
    return this.setupService
      .updateData("/hrmsetup/add/update/employmentlevel", payload)
      .subscribe(
        (res) => {
          this.spinner = false;
          const message = res.status.message.friendlyMessage;
          if (res.status.isSuccessful) {
            swal.fire("GOSHRM", message, "success");
            this.initializeForm();
            $("#add_employment_level").modal("hide");
          } else {
            swal.fire("Error", message, "error");
          }
          this.getEmploymentLevels();
        },
        (err) => {
          this.spinner = false;
          const message = err.status.message.friendlyMessage;
          swal.fire("Error", message, "error");
        }
      );
  }

  openModal() {
    this.formTitle = "Add Employment Level";
    $("#add_employment_level").modal("show");

    // resets the input for upload form
    this.fileInput.nativeElement.value = "";
  }

  closeModal() {
    $("#add_employment_level").modal("hide");
    this.initializeForm();
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
          return this.setupService
            .deleteData("/hrmsetup/delete/employmentlevel", payload)
            .subscribe(
              (res) => {
                const message = res.status.message.friendlyMessage;
                if (res.status.isSuccessful) {
                  swal.fire("GOSHRM", message, "success").then(() => {
                    this.getEmploymentLevels();
                  });
                } else {
                  swal.fire("Error", message, "error");
                }
              },
              (err) => {

              }
            );
        }
      });
    this.selectedId = [];
  }

  // To Get The employee Edit Id And Set Values To Edit Modal Form
  edit(row) {
    this.formTitle = "Edit Employment Level";
    this.employmentLevelForm.patchValue({
      id: row.id,
      employment_level: row.employment_level,
      description: row.description,
    });
    $("#add_employment_level").modal("show");
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

  checkAll(event) {
    if (event.target.checked) {
      this.selectedId = this.levels.map((item) => {
        return item.id;
      });
    } else {
      this.selectedId = [];
    }
  }
}
