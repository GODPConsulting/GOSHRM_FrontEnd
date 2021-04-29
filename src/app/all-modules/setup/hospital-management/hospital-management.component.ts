import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SetupService } from "src/app/services/setup.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";
import { LoadingService } from "../../../services/loading.service";
import { Subject } from "rxjs";

declare const $: any;
@Component({
  selector: "app-hospital-management",
  templateUrl: "./hospital-management.component.html",
  styleUrls: ["./hospital-management.component.css", "../setup.component.css"],
})
export class HospitalManagementComponent implements OnInit {
  public formTitle: string = "Hospital Management";
  public dtOptions: DataTables.Settings = {};
  @ViewChild("fileInput") fileInput: ElementRef;
  public hospitalManagementForm: FormGroup;
  public hospitalManagements: any[] = [];
  public selectedId: number[] = [];

  public spinner: boolean = false;
  public hospitalManagementUploadForm: FormGroup;
  public hmos: any[] = [];
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
      columns: [{ orderable: false }, null, null, null, null, null, null],
      order: [[1, "asc"]],
    };
    this.getHospitalManagement();
    this.initializeForm();
    this.getHmos();
  }

  downloadFile() {
    this.loadingService.show();
    this.setupService
      .exportExcelFile("/hrmsetup/download/hospital-management")
      .subscribe(
        (resp) => {
          this.loadingService.hide();
          this.utilitiesService.byteToFile(resp, "Hospital Management.xlsx", {
            type: "application/vnd.ms-excel",
          });
        },
        (err) => {
          this.loadingService.hide();
        }
      );
  }

  uploadHospitalManagement() {
    if (!this.hospitalManagementUploadForm.get("uploadInput").value) {
      return swal.fire("Error", "Select a file", "error");
    }
    const formData = new FormData();
    formData.append(
      "uploadInput",
      this.hospitalManagementUploadForm.get("uploadInput").value
    );
    this.spinner = true;
    return this.setupService.uploadHospitalMgt(formData).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;

        if (res.status.isSuccessful) {
          swal.fire("Success", message, "success");
          this.initializeForm();
          this.fileInput.nativeElement.value = "";
          $("#uploadHospitalManagement").modal("hide");
        } else {
          swal.fire("GOSHRM", message, "error");
        }
        this.getHospitalManagement();
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  initializeForm() {
    this.formTitle = "Add Hospital";
    this.hospitalManagementForm = this.formBuilder.group({
      id: [0],
      hospital: ["", Validators.required],
      hmoId: ["", Validators.required],
      contactPhoneNo: ["", Validators.required],
      email: ["", Validators.required],
      address: ["", Validators.required],
      otherComments: [""],
    });
    //initialize upload form
    this.hospitalManagementUploadForm = this.formBuilder.group({
      uploadInput: [""],
    });
  }

  openUploadModal() {
    // Reset upload form
    this.fileInput.nativeElement.value = "";
    $("#uploadHospitalManagement").modal("show");
  }

  openModal() {
    this.initializeForm();
    $("#addHospitalManagement").modal("show");
  }

  closeModal() {
    $("#addHospitalManagement").modal("hide");
  }

  getHmos() {
    this.loadingService.show();
    return this.setupService.getHmo().subscribe(
      (data) => {
        this.loadingService.hide();
        this.hmos = data.setuplist;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  getHospitalManagement() {
    this.loadingService.show();
    return this.setupService.getHospitalMgt().subscribe(
      (data) => {
        this.loadingService.hide();
        this.hospitalManagements = data.setuplist;
        this.dtTrigger.next();
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  // Add Hospital Management Api Call
  addHospitalManagement(form: FormGroup) {
    if (!form.valid) {
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }

    const payload = form.value;
    if (!this.utilitiesService.validateEmail(payload.email)) {
      return swal.fire("Error", "Email not valid", "error");
    }
    payload.hmoId = +payload.hmoId;

    this.spinner = true;
    return this.setupService.addHospitalMgt(payload).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("Success", message, "success");
          this.initializeForm();
          $("#addHospitalManagement").modal("hide");
        } else {
          swal.fire("GOSHRM", message, "error");
        }
        this.getHospitalManagement();
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
          return this.setupService.deleteHospitalMgt(payload).subscribe(
            (res) => {
              this.loadingService.hide();
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("Success", message, "success").then(() => {
                  this.getHospitalManagement();
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
    this.formTitle = "Edit Hospital Mangement";
    this.hospitalManagementForm.patchValue({
      id: row.id,
      hospital: row.hospital,
      hmoId: row.hmoId,
      contactPhoneNo: row.contactPhoneNo,
      email: row.email,
      address: row.address,
      otherComments: row.otherComments,
    });
    $("#addHospitalManagement").modal("show");
  }

  addItemId(event: Event, id: number) {
    this.utilitiesService.deleteArray(event, id, this.selectedId);
  }

  checkAll(event: Event) {
    this.selectedId = this.utilitiesService.checkAllBoxes(
      event,
      this.hospitalManagements
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
