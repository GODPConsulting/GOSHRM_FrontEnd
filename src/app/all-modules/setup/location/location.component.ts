import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SetupService } from "src/app/services/setup.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";
import { LoadingService } from "../../../services/loading.service";
import { Subject } from "rxjs";
import { CommonService } from "../../../services/common.service";
import { ISearchColumn } from "../../../interface/interfaces";

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
  public spinner: boolean = false;
  public locationForm: FormGroup;
  locationUploadForm: FormGroup;
  public countries: any[] = [];
  public countryId: number;
  public states: any[] = [];
  selectLocation: any[];
  cols: ISearchColumn[];
  constructor(
    private formBuilder: FormBuilder,
    private setupService: SetupService,
    private utilitiesService: UtilitiesService,
    private loadingService: LoadingService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.cols = [
      {
        header: "location",
        field: "location",
      },
      {
        header: "address",
        field: "address",
      },
      {
        header: "city",
        field: "city",
      },
      {
        header: "stateName",
        field: "stateName",
      },
      {
        header: "countryName",
        field: "countryName",
      },
    ];
    this.getLocation();
    this.getCountry();
    this.initializeForm();
  }

  downloadFile() {
    // this.loadingService.show();
    this.setupService.downloadLocation().subscribe(
      (resp) => {
        // this.loadingService.hide();
        this.utilitiesService.byteToFile(resp, "Location.xlsx", {
          type: "application/vnd.ms-excel",
        });
      },
      (err) => {
        // this.loadingService.hide();
      }
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
    this.formTitle = "Add Location";

    this.locationForm = this.formBuilder.group({
      id: [0],
      location: ["", Validators.required],
      address: ["", Validators.required],
      city: ["", Validators.required],
      stateId: ["", Validators.required],
      countryId: ["", Validators.required],
      additionalInformation: [""],
    });
    // initialize upload form
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
    // this.loadingService.show();
    return this.setupService.getLocation().subscribe(
      (data) => {
        // this.loadingService.hide();
        this.locations = data.setuplist;
      },
      (err) => {
        // this.loadingService.hide();
      }
    );
  }

  // Add Location Modal Api Call
  addLocation(form: FormGroup) {
    if (!form.valid) {
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    const payload = form.value;

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
    if (this.selectLocation.length === 0) {
      return swal.fire("Error", "Select items to delete", "error");
    }
    this.selectLocation.map((item) => {
      this.selectedId.push(item.id);
    });
    payload = {
      itemIds: this.selectedId,
    };
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
          // this.loadingService.show();
          return this.setupService.deleteLocation(payload).subscribe(
            (res) => {
              // this.loadingService.hide();
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
              // this.loadingService.hide();
              this.utilitiesService.showMessage(err, "error");
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
    // this.loadingService.show();
    return this.commonService.getCountries().subscribe(
      (data) => {
        // this.loadingService.hide();
        this.countries = data.commonLookups;
      },
      (err) => {
        // this.loadingService.hide();
      }
    );
  }

  getStatesByCountryId(id) {
    // this.loadingService.show();
    return this.commonService.getStatesByCountryId(id).subscribe(
      (data) => {
        // this.loadingService.hide();
        this.states = data.commonLookups;
      },
      (err) => {
        // this.loadingService.hide();
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
    this.utilitiesService.uploadFileValidator(event, form, "hr");
  }
}
