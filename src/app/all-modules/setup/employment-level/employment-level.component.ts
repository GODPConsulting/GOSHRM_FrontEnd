import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { SetupService } from "../../../services/setup.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import swal from "sweetalert2";
import { UtilitiesService } from "src/app/services/utilities.service";

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
      columns: [{ orderable: false }, null, null],
      order: [[1, "asc"]],
    };
    this.initializeForm();
    this.getEmploymentLevels();
  }

  downloadFile() {
    this.setupService
      .exportExcelFile("/hrmsetup/download/employmentlevels")
      .subscribe(
        (resp) => {
          const data = resp;
          this.utilitiesService.byteToFile(data, "Employment Level.xlsx", {
            type: "application/vnd.ms-excel",
          });
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
    return this.setupService.uploadEmploymentLevel(formData).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          this.initializeForm();
          this.fileInput.nativeElement.value = "";
          $("#upload_employment_level").modal("hide");
        } else {
          swal.fire("GOSHRM", message, "error");
        }
        this.getEmploymentLevels();
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  openUploadModal() {
    $("#upload_employment_level").modal("show");
  }

  initializeForm() {
    this.formTitle = "Add Employment Level";

    this.employmentLevelForm = this.formBuilder.group({
      id: [0],
      employment_level: ["", Validators.required],
      description: [""],
    });
    this.employmentLevelUploadForm = this.formBuilder.group({
      uploadInput: [""],
    });
  }

  getEmploymentLevels() {
    this.pageLoading = true;
    return this.setupService.getEmploymentLevel().subscribe(
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
    return this.setupService.addEmploymentLevel(payload).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          this.initializeForm();
          $("#add_employment_level").modal("hide");
        } else {
          swal.fire("GOSHRM", message, "error");
        }
        this.getEmploymentLevels();
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  openModal() {
    $("#add_employment_level").modal("show");
    this.initializeForm();
    // resets the input for upload form
    this.fileInput.nativeElement.value = "";
  }

  closeModal() {
    $("#add_employment_level").modal("hide");
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
          return this.setupService.deleteEmploymentLevel(payload).subscribe(
            (res) => {
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOSHRM", message, "success").then(() => {
                  this.getEmploymentLevels();
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

  addItemId(event: Event, id: number) {
    this.utilitiesService.deleteArray(event, id, this.selectedId);
  }

  checkAll(event: Event) {
    this.selectedId = this.utilitiesService.checkAllBoxes(event, this.levels);
  }

  // Prevents the edit modal from popping up when checkbox is clicked
  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
  }

  // Appends a selected file to "uploadInput"

  onSelectedFile(event: Event, form: FormGroup) {
    this.utilitiesService.patchFile(event, form);
  }
}
