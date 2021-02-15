import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SetupService } from "src/app/services/setup.service";
import { UtilitiesService } from "src/app/services/utilities.service";
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
      columns: [{ orderable: false }, null, null, null, null, null, null],
      order: [[1, "asc"]],
    };
    this.getHmo();
    this.initializeForm();
  }

  downloadFile() {
    this.setupService.downloadHmo().subscribe(
      (resp) => {
        const data = resp;
        this.utilitiesService.byteToFile(data, "HMO.xlsx");
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
    return this.setupService.uploadHmo(formData).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          this.initializeForm();
          $("#upload_hmo").modal("hide");
        } else {
          swal.fire("GOSHRM", message, "error");
        }
        this.getHmo();
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  openUploadModal() {
    // Resets the upload form
    this.fileInput.nativeElement.value = "";
    $("#upload_hmo").modal("show");
  }

  initializeForm() {
    this.formTitle = "Add HMO";
    this.hmoForm = this.formBuilder.group({
      id: [0],
      hmo_name: ["", Validators.required],
      hmo_code: ["", Validators.required],
      contact_phone_number: ["", Validators.required],
      contact_email: ["", Validators.required],
      address: ["", Validators.required],
      reg_date: ["", Validators.required],
      other_comments: [""],
    });
    this.hmoUploadForm = this.formBuilder.group({
      uploadInput: [""],
    });
  }

  getHmo() {
    this.pageLoading = true;
    return this.setupService.getHmo().subscribe(
      (data) => {
        this.pageLoading = false;

        this.hmos = data.setuplist;
      },
      (err) => {
        this.pageLoading = false;
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

    this.spinner = true;
    return this.setupService.addHmo(payload).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;

        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          this.initializeForm();
          $("#add_hmo").modal("hide");
        } else {
          swal.fire("GOSHRM", message, "error");
        }
        this.getHmo();
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
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
          return this.setupService.deleteHmo(payload).subscribe(
            (res) => {
              this.pageLoading = false;
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOSHRM", message, "success").then(() => {
                  this.getHmo();
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

  checkAll(event: Event) {
    this.selectedId = this.utilitiesService.checkAllBoxes(event, this.hmos);
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
