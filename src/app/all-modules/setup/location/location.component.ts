import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SetupService } from "src/app/services/setup.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";

declare const $: any;

@Component({
  selector: "app-location",
  templateUrl: "./location.component.html",
  styleUrls: ["./location.component.css", "../setup.component.css"],
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
  public countries: any[] = [];
  public countryId: number;
  public states: any[] = [];

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
    this.getLocation();
    this.getCountry();
    this.initializeForm();
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
    return this.setupService.uploadLocation(formData).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;

        if (res.status.isSuccessful) {
          swal.fire("Success", message, "success");
          this.initializeForm();
          this.fileInput.nativeElement.value = "";
          $("#upload_location").modal("hide");
        } else {
          swal.fire("GOSHRM", message, "error");
        }
        this.getLocation();
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
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
      additionalInformation: [""],
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
  }

  closeModal() {
    $("#add_location").modal("hide");
  }

  getLocation() {
    this.pageLoading = true;
    return this.setupService.getLocation().subscribe(
      (data) => {
        this.pageLoading = false;
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
    payload.stateId = +payload.stateId;
    payload.countryId = +payload.countryId;
    return this.setupService.addLocation(payload).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("Success", message, "success");
          this.initializeForm();
          $("#add_location").modal("hide");
        } else {
          swal.fire("GOSHRM", message, "error");
        }
        this.getLocation();
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
          return this.setupService.deleteLocation(payload).subscribe(
            (res) => {
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("Success", message, "success").then(() => {
                  this.getLocation();
                });
              } else {
                swal.fire("GOSHRM", message, "error");
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
    this.getStatesByCountryId(row.countryId);
    this.formTitle = "Edit Location";
    this.locationForm.patchValue({
      id: row.id,
      location: row.location,
      address: row.address,
      city: row.city,
      stateId: row.stateId,
      countryId: row.countryId,
      additionalInformation: row.additionalInformation,
    });
    $("#add_location").modal("show");
  }

  /* Put in utilities service */
  getCountry() {
    this.pageLoading = true;
    return this.setupService.getData("/common/countries").subscribe(
      (data) => {
        this.pageLoading = false;
        this.countries = data.commonLookups;
      },
      (err) => {
        this.pageLoading = false;
        console.log(err);
      }
    );
  }

  getStatesByCountryId(id) {
    this.pageLoading = true;
    return this.setupService
      .getData(`/common/get/states/countryId?CountryId=${id}`)
      .subscribe(
        (data) => {
          this.pageLoading = false;
          this.states = data.commonLookups;
        },
        (err) => {
          this.pageLoading = false;
          console.log(err);
        }
      );
  }

  /* Put in utilities service */

  addItemId(event: Event, id: number) {
    this.utilitiesService.deleteArray(event, id, this.selectedId);
  }

  checkAll(event: Event) {
    this.selectedId = this.utilitiesService.checkAllBoxes(
      event,
      this.locations
    );
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
