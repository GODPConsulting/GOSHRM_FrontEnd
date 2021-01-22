import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SetupService } from "src/app/services/setup.service";
import swal from "sweetalert2";

declare const $: any;
@Component({
  selector: 'app-hospital-management',
  templateUrl: './hospital-management.component.html',
  styleUrls: ['./hospital-management.component.css', "../setup.component.css"]
})
export class HospitalManagementComponent implements OnInit {
  public formTitle: string = "Hospital Management";
  public dtOptions: DataTables.Settings = {};
  @ViewChild("fileInput") fileInput: ElementRef;
  public hospitalManagementForm: FormGroup;
  public hospitalManagements: any[] = [];
  public selectedId: number[] = [];
  public pageLoading: boolean;
  public spinner: boolean = false;
  public hospitalManagementUploadForm: FormGroup;
  public hmos: any[] = [];

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
      columns: [{ orderable: false }, null, null, null, null, null, null],
      order: [[1, "asc"]],
    };
    this.getHospitalManagement();
    this.initializeForm();
    this.getHmos();
  }

  // Prevents the edit modal from popping up when checkbox is clicked
  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
  }

  downloadFile() {
    this.setupService.exportExcelFile("/hrmsetup/download/hospital-management").subscribe(
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
            const file = new File([bb], "Hospital Management.xlsx", {
              type: "application/vnd.ms-excel",
            });
            console.log(file, bb);
            saveAs(file);
          } catch (err) {
            const textFileAsBlob = new Blob([bb], {
              type: "application/vnd.ms-excel",
            });
            window.navigator.msSaveBlob(textFileAsBlob, "Hospital Management.xlsx");
          }
        } else {
          return swal.fire(`GOS HRM`, "Unable to download data", "error");
        }
      },
      (err) => {}
    );
  }

  // Appends a selected file to "uploadInput"
  onSelectedFile(event) {
    const file = event.target.files[0];
    this.hospitalManagementUploadForm.patchValue({
      uploadInput: file,
    });
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
    return this.setupService
      .updateData("/hrmsetup/upload/hospital-management", formData)
      .subscribe(
        (res) => {
          this.spinner = false;
          const message = res.status.message.friendlyMessage;

          if (res.status.isSuccessful) {
            swal.fire("Success", message, "success");
            this.initializeForm();
            this.fileInput.nativeElement.value = "";
            $("#uploadHospitalManagement").modal("hide");
          } else {
            swal.fire("Error", message, "error");
          }
          this.getHospitalManagement();
        },
        (err) => {
          this.spinner = false;
          const message = err.status.message.friendlyMessage;
          swal.fire("Error", message, "error");
        }
      );
  }

  initializeForm() {
    this.hospitalManagementForm = this.formBuilder.group({
      id: [0],
      hospital: ["", Validators.required],
      hmoId: ["", Validators.required],
      contactPhoneNo: ["", Validators.required],
      email: ["", Validators.required],
      address: ["", Validators.required],
      rating: ["", Validators.required],
      otherComments: ["", Validators.required],
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
    this.pageLoading = true;
   return this.setupService.getData("/hrmsetup/get/all/hmos").subscribe(
     (data) => {
       this.pageLoading = false;
       this.hmos = data.setuplist;
     },
     (err) => {
       this.pageLoading = false;
       console.log(err);
     }
   );
 }

  getHospitalManagement() {
    this.pageLoading = true;
    return this.setupService.getData("/hrmsetup/get/all/hospital-managements").subscribe(
      (data) => {
        this.pageLoading = false;
        this.hospitalManagements = data.setuplist;
      },
      (err) => {
        this.pageLoading = false;
        console.log(err);
      }
    );
  }

  // Add Hospital Management Api Call
  addHospitalManagement(form: FormGroup) {
    console.log(form.value);
    if (!form.valid) {
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    const payload = form.value;
    payload.hmoId = +payload.hmoId;
    console.log(payload);
    this.spinner = true;
    return this.setupService
      .updateData("/hrmsetup/add/update/hospital-management", payload)
      .subscribe(
        (res) => {
          this.spinner = false;
          const message = res.status.message.friendlyMessage;
          if (res.status.isSuccessful) {
            swal.fire("Success", message, "success");
            this.initializeForm();
            $("#addHospitalManagement").modal("hide");
          } else {
            swal.fire("Error", message, "error");
          }
          this.getHospitalManagement();
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
            .deleteData("/hrmsetup/delete/hospital-management", payload)
            .subscribe(
              (res) => {
                const message = res.status.message.friendlyMessage;
                if (res.status.isSuccessful) {
                  swal.fire("Success", message, "success").then(() => {
                    this.getHospitalManagement();
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
      rating: row.rating,
      otherComments: row.otherComments
    });
    $("#addHospitalManagement").modal("show");
  }

  checkAll(event: Event) {
    if ((<HTMLInputElement>event.target).checked) {
      this.selectedId = this.hospitalManagements.map((item) => {
        return item.id;
      });
    } else {
      this.selectedId = [];
    }
  }

  addItemId(event: Event, id: number) {
    if ((<HTMLInputElement>event.target).checked) {
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
