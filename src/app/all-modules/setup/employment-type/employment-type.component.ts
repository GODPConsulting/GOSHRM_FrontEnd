import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SetupService } from "src/app/services/setup.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";
import { LoadingService } from "../../../services/loading.service";
import { Subject } from "rxjs";

declare const $: any;
@Component({
  selector: "app-employment-type",
  templateUrl: "./employment-type.component.html",
  styleUrls: ["./employment-type.component.css", "../setup.component.css"],
})
export class EmploymentTypeComponent implements OnInit {
  public formTitle: string;
  public dtOptions: DataTables.Settings = {};
  @ViewChild("fileInput") fileInput: ElementRef;
  public employmentTypeForm: FormGroup;
  public employmentTypes: any[] = [];
  public spinner: boolean = false; // Controls the visibilty of the spinner
  public selectedId: number[] = [];
  public employmentTypeUploadForm: FormGroup;
  public file: File;
  dtTrigger: Subject<any> = new Subject();
  constructor(
    private formBuilder: FormBuilder,
    private setupService: SetupService,
    private utilitiesService: UtilitiesService,
    private loadingService: LoadingService
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
    this.getEmploymentType();
  }

  downloadFile() {
    this.loadingService.show();
    this.setupService
      .exportExcelFile("/hrmsetup/download/employmenttypes")
      .subscribe(
        (resp) => {
          this.loadingService.hide();
          console.log(resp);
          return this.utilitiesService.byteToFile(
            resp,
            "Employment Type.xlsx",
            {
              type: "application/vnd.ms-excel",
            }
          );
        },
        (err) => {
          this.loadingService.hide();
        }
      );
  }

  uploadEmploymentType() {
    if (!this.employmentTypeUploadForm.get("uploadInput").value) {
      return swal.fire("Error", "Select a file", "error");
    }
    const formData = new FormData();
    formData.append(
      "uploadInput",
      this.employmentTypeUploadForm.get("uploadInput").value
    );
    this.spinner = true;
    return this.setupService.uploadEmploymentType(formData).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          this.initializeForm();
          this.fileInput.nativeElement.value = "";
          $("#upload_employment_type").modal("hide");
        } else {
          swal.fire("GOSHRM", message, "error");
        }
        this.getEmploymentType();
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
    $("#upload_employment_type").modal("show");
  }

  initializeForm() {
    this.formTitle = "Add Employment Type";
    this.employmentTypeForm = this.formBuilder.group({
      id: [0],
      employment_type: ["", Validators.required],
      description: [""],
    });
    this.employmentTypeUploadForm = this.formBuilder.group({
      uploadInput: [""],
    });
  }

  openModal() {
    this.initializeForm();

    $("#add_employment_type").modal("show");
  }

  closeModal() {
    $("#add_employment_type").modal("hide");
  }

  getEmploymentType() {
    this.loadingService.show();
    return this.setupService.getEmploymentType().subscribe(
      (data) => {
        this.loadingService.hide();
        this.employmentTypes = data.setuplist;
        this.dtTrigger.next();
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  // Add employment via reactive form Modal Api Call
  addEmploymentType(form: FormGroup) {
    if (!form.valid) {
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    const payload: object = form.value;

    this.spinner = true;
    return this.setupService.addEmploymentType(payload).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;

        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          this.initializeForm();
          $("#add_employment_type").modal("hide");
        } else {
          swal.fire("GOSHRM", message, "error");
        }
        this.getEmploymentType();
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
          this.loadingService.show();
          return this.setupService.deleteEmploymentType(payload).subscribe(
            (res) => {
              this.loadingService.hide();
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOSHRM", message, "success").then(() => {
                  this.getEmploymentType();
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

  // To Get The employee Edit Id And Set Values To Edit Modal Form
  edit(row) {
    this.formTitle = "Edit Employment Type";
    this.employmentTypeForm.patchValue({
      id: row.id,
      employment_type: row.employment_type,
      description: row.description,
    });
    $("#add_employment_type").modal("show");
  }

  addItemId(event: Event, id: number) {
    this.utilitiesService.deleteArray(event, id, this.selectedId);
  }

  checkAll(event: Event) {
    this.selectedId = this.utilitiesService.checkAllBoxes(
      event,
      this.employmentTypes
    );
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
