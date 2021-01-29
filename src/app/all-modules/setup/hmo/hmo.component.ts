import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SetupService } from "src/app/services/setup.service";
import swal from "sweetalert2";

declare const $: any;
@Component({
  selector: "app-hmo",
  templateUrl: "./hmo.component.html",
  styleUrls: ["./hmo.component.css", "../setup.component.css"],
})
export class HmoComponent implements OnInit {
  @ViewChild("fileInput") fileInput: ElementRef;
  public dtOptions: DataTables.Settings = {};
  public hmos: any[] = [];
  public pageLoading: boolean;

  public spinner: boolean = false;
  public formTitle = "Add HMO";
  public hmoForm: FormGroup;
  public selectedId: number[] = [];
  public hmoUploadForm: FormGroup;

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
    this.getHmo();
    this.initializeForm();
  }

  // Prevents the edit modal from popping up when checkbox is clicked
  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
  }

  // Appends a selected file to "uploadInput"
  onSelectedFile(event: Event) {
    const file = (<HTMLInputElement>event.target).files[0];
    this.hmoUploadForm.patchValue({
      uploadInput: file,
    });
  }

  downloadFile() {
    this.setupService.exportExcelFile("/hrmsetup/download/hmo").subscribe(
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
            const file = new File([bb], "HMO.xlsx", {
              type: "application/vnd.ms-excel",
            });
            console.log(file, bb);
            saveAs(file);
          } catch (err) {
            const textFileAsBlob = new Blob([bb], {
              type: "application/vnd.ms-excel",
            });
            window.navigator.msSaveBlob(textFileAsBlob, "HMO.xlsx");
          }
        } else {
          return swal.fire(`GOS HRM`, "Unable to download data", "error");
        }
      },
      (err) => {}
    );
  }

  uploadHmo() {
    if (!this.hmoUploadForm.get("uploadInput").value) {
      return swal.fire("Error", "Select a file", "error");
    }
    const formData = new FormData();
    formData.append("uploadInput", this.hmoUploadForm.get("uploadInput").value);
    this.spinner = true;
    return this.setupService
      .updateData("/hrmsetup/upload/hmo", formData)
      .subscribe(
        (res) => {
          this.spinner = false;
          const message = res.status.message.friendlyMessage;
          if (res.status.isSuccessful) {
            swal.fire("GOSHRM", message, "success");
            this.initializeForm();
            $("#upload_hmo").modal("hide");
          } else {
            swal.fire("Error", message, "error");
          }
          this.getHmo();
        },
        (err) => {
          this.spinner = false;
          const message = err.status.message.friendlyMessage;
          swal.fire("Error", message, "error");
        }
      );
  }

  openUploadModal() {
    // Resets the upload form
    this.fileInput.nativeElement.value = "";
    $("#upload_hmo").modal("show");
  }

  initializeForm() {
    this.hmoForm = this.formBuilder.group({
      id: [0],
      hmo_name: ["", Validators.required],
      hmo_code: ["", Validators.required],
      contact_phone_number: ["", Validators.required],
      contact_email: ["", Validators.required],
      address: ["", Validators.required],
      reg_date: ["", Validators.required],
      rating: ["", Validators.required],
      other_comments: ["", Validators.required],
    });
    this.hmoUploadForm = this.formBuilder.group({
      uploadInput: [""],
    });
  }

  getHmo() {
    this.pageLoading = true;
    return this.setupService.getAllHmos().subscribe(
      (data) => {
        this.pageLoading = false;
        //console.log(data);
        this.hmos = data.setuplist;
      },
      (err) => {
        this.pageLoading = false;
        console.log(err);
      }
    );
  }

  openModal() {
    this.initializeForm();
    $("#add_hmo").modal("show");
  }

  closeModal() {
    $("#add_hmo").modal("hide");
  }

  // Add HMO Modal Api Call
  addHmo(form: FormGroup) {
    if (!form.valid) {
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    const payload = form.value;
    console.log(payload);
    this.spinner = true;
    return this.setupService
      .updateData("/hrmsetup/add/update/hmo", payload)
      .subscribe(
        (res) => {
          this.spinner = false;
          const message = res.status.message.friendlyMessage;
          //console.log(message);
          if (res.status.isSuccessful) {
            swal.fire("GOSHRM", message, "success");
            this.initializeForm();
            $("#add_hmo").modal("hide");
          } else {
            swal.fire("Error", message, "error");
          }
          this.getHmo();
        },
        (err) => {
          this.spinner = false;
          const message = err.status.message.friendlyMessage;
          swal.fire("Error", message, "error");
        }
      );
  }

  // To Set Values To Edit Modal Form
  editHmo(row) {
    this.formTitle = "Edit HMO";
    this.hmoForm.patchValue({
      id: row.id,
      hmo_name: row.hmo_name,
      hmo_code: row.hmo_code,
      contact_phone_number: row.contact_phone_number,
      contact_email: row.contact_email,
      address: row.address,
      reg_date: row.reg_date,
      rating: row.rating,
      other_comments: row.other_comments,
    });
    $("#add_hmo").modal("show");
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
            .deleteData("/hrmsetup/delete/hmo", payload)
            .subscribe(
              (res) => {
                const message = res.status.message.friendlyMessage;
                if (res.status.isSuccessful) {
                  swal.fire("GOSHRM", message, "success").then(() => {
                    this.getHmo();
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

  checkAll(event: Event) {
    if ((<HTMLInputElement>event.target).checked) {
      this.selectedId = this.hmos.map((item) => {
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
