import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SetupService } from 'src/app/services/setup.service';
import swal from "sweetalert2";

declare const $: any;

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {
  public formTitle: string = "Add Location";
  public dtOptions: DataTables.Settings = {};
  @ViewChild("fileInput") fileInput: ElementRef;
  public locations: any[] = [];
  public selectedId: number[] = [];
  public pageLoading: boolean;
  public spinner: boolean = false;
  public locationForm: FormGroup;
  locationUploadForm: FormGroup;

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
    this.getLocation();
    this.initializeForm();
  }

  // Prevents the edit modal from popping up when checkbox is clicked
  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
  }

  downloadFile() {
    this.setupService.exportExcelFile("/hrmsetup/download/location").subscribe(
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
            const file = new File([bb], "Location.xlsx", {
              type: "application/vnd.ms-excel",
            });
            console.log(file, bb);
            saveAs(file);
          } catch (err) {
            const textFileAsBlob = new Blob([bb], {
              type: "application/vnd.ms-excel",
            });
            window.navigator.msSaveBlob(textFileAsBlob, "Location.xlsx");
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
    this.locationUploadForm.patchValue({
      uploadInput: file,
    });
  }

  uploadLocation() {
    if (!this.locationUploadForm.get("uploadInput").value) {
      return swal.fire("Error", "Select a file", "error");
    }
    const formData = new FormData();
    formData.append(
      "uploadInput",
      this.locationUploadForm.get("uploadInput").value
    );
    this.spinner = true;
    return this.setupService
      .updateData("/hrmsetup/upload/location", formData)
      .subscribe(
        (res) => {
          this.spinner = false;
          const message = res.status.message.friendlyMessage;

          if (res.status.isSuccessful) {
            swal.fire("Success", message, "success");
            this.initializeForm();
            this.fileInput.nativeElement.value = "";
            $("#upload_location").modal("hide");
          } else {
            swal.fire("Error", message, "error");
          }
          this.getLocation();
        },
        (err) => {
          this.spinner = false;
          const message = err.status.message.friendlyMessage;
          swal.fire("Error", message, "error");
        }
      );
  }

  initializeForm() {
    this.locationForm = this.formBuilder.group({
      id: [0],
      location: ["", Validators.required],
      address: ["", Validators.required],
      city: ["", Validators.required],
      stateId: ["", Validators.required],
      countryId: ["", Validators.required],
      description: ["", Validators.required],
    });
    //initialize upload form
    this.locationUploadForm = this.formBuilder.group({
      uploadInput: [""],
    });
  }

  openUploadModal() {
    // Reset upload form
    this.fileInput.nativeElement.value = "";
    $("#upload_location").modal("show");
  }

  openModal() {
    this.initializeForm();
    $("#add_location").modal("show");
    /* if (this.jobGrades.length === 0) {
      this.jobGradeForm.get("job_grade_reporting_to").disable();
    } else {
      this.jobGradeForm.get("job_grade_reporting_to").enable(); 
    }*/
  }

  closeModal() {
    $("#add_location").modal("hide");
  }

  getLocation() {
    this.pageLoading = true;
    return this.setupService.getData("/hrmsetup/get/all/location").subscribe(
      (data) => {
        this.pageLoading = false;
        //console.log(data);
        this.locations = data.setuplist;
      },
      (err) => {
        this.pageLoading = false;
        console.log(err);
      }
    );
  }

  // Add Location Modal Api Call
  addLocation(form: FormGroup) {
    console.log(form.value);
    if (!form.valid) {
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    const payload = form.value;
    console.log(payload);
    this.spinner = true;
    return this.setupService
      .updateData("/hrmsetup/add/update/location", payload)
      .subscribe(
        (res) => {
          this.spinner = false;
          const message = res.status.message.friendlyMessage;
          if (res.status.isSuccessful) {
            swal.fire("Success", message, "success");
            this.initializeForm();
            $("#add_location").modal("hide");
          } else {
            swal.fire("Error", message, "error");
          }
          this.getLocation();
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
    if (this.selectedId) {
      if (this.selectedId.length === 0) {
        return swal.fire("Error", "Select items to delete", "error");
      }
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
            .deleteData("/hrmsetup/delete/location", payload)
            .subscribe(
              (res) => {
                const message = res.status.message.friendlyMessage;
                if (res.status.isSuccessful) {
                  swal.fire("Success", message, "success").then(() => {
                    this.getLocation();
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
    this.formTitle = "Edit Location";
    this.locationForm.patchValue({
      id: row.id,
      location: row.location,
      address: row.address,
      city: row.city,
      stateId: row.state,
      countryId: row.country,
      // additional_information: row.additional_information,
    });
    $("#add_location").modal("show");
  }

  checkAll(event: Event) {
    if ((<HTMLInputElement>event.target).checked) {
      this.selectedId = this.locations.map((item) => {
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
