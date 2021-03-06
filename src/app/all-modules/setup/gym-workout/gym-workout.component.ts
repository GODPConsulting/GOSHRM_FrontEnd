import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SetupService } from "src/app/services/setup.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";
import { LoadingService } from "../../../services/loading.service";
import { Subject } from "rxjs";
import { ISearchColumn } from "../../../interface/interfaces";

declare const $: any;
@Component({
  selector: "app-gym-workout",
  templateUrl: "./gym-workout.component.html",
  styleUrls: ["./gym-workout.component.css", "../setup.component.css"],
})
export class GymWorkoutComponent implements OnInit {
  @ViewChild("fileInput") fileInput: ElementRef;
  public dtOptions: DataTables.Settings = {};
  public gymWorkouts: any[] = [];
  public spinner: boolean = false;
  public formTitle: string = "Add Gym/Workout";
  public gymWorkoutForm: FormGroup;
  public selectedId: any[] = [];
  public gymWorkoutUploadForm: FormGroup;
  public file: File;
  selectGymworkouts: any[];
  cols: ISearchColumn[];
  constructor(
    private formBuilder: FormBuilder,
    private setupService: SetupService,
    private utilitiesService: UtilitiesService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.cols = [
      {
        header: "gym",
        field: "gym",
      },
      {
        header: "contact_phone_number",
        field: "contact_phone_number",
      },
      {
        header: "email",
        field: "email",
      },
    ];
    this.getGymWorkout();
    this.initializeForm();
  }

  downloadFile() {
    // this.loadingService.show();
    this.setupService
      .exportExcelFile("/hrmsetup/download/gymworkouts")
      .subscribe(
        (resp) => {
          // this.loadingService.hide();
          this.utilitiesService.byteToFile(resp, "Gym/Workout.xlsx", {
            type: "application/vnd.ms-excel",
          });
        },
        (err) => {
          // this.loadingService.hide();
        }
      );
  }

  uploadGymWorkout() {
    if (!this.gymWorkoutUploadForm.get("uploadInput").value) {
      return swal.fire("Error", "Select a file", "error");
    }
    const formData = new FormData();
    formData.append(
      "uploadInput",
      this.gymWorkoutUploadForm.get("uploadInput").value
    );
    this.spinner = true;
    return this.setupService.uploadGymWorkout(formData).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          this.initializeForm();
          $("#upload_gym_workout").modal("hide");
        } else {
          swal.fire("GOSHRM", message, "error");
        }
        this.getGymWorkout();
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
    $("#upload_gym_workout").modal("show");
  }

  initializeForm() {
    this.formTitle = "Add Gym/Workout";
    this.gymWorkoutForm = this.formBuilder.group({
      id: [0],
      gym: ["", Validators.required],
      contact_phone_number: ["", Validators.required],
      email: ["", Validators.required],
      address: ["", Validators.required],
      other_comments: [""],
    });
    this.gymWorkoutUploadForm = this.formBuilder.group({
      uploadInput: [""],
    });
  }

  getGymWorkout() {
    // this.loadingService.show();
    return this.setupService.getGymWorkout().subscribe(
      (data) => {
        // this.loadingService.hide();
        this.gymWorkouts = data.setuplist;
      },
      (err) => {
        // this.loadingService.hide();
      }
    );
  }

  openModal() {
    this.initializeForm();
    $("#add_gym_workout").modal("show");
  }

  closeModal() {
    $("#add_gym_workout").modal("hide");
  }

  // Add Gym/workout  Modal Api Call
  addGymWorkout(form: FormGroup) {
    if (!form.valid) {
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    const payload = form.value;
    if (!this.utilitiesService.validateEmail(payload.email)) {
      return swal.fire("Error", "Email not valid", "error");
    }
    this.spinner = true;
    return this.setupService.addGymWorkout(payload).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;

        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          this.initializeForm();
          $("#add_gym_workout").modal("hide");
        } else {
          swal.fire("GOSHRM", message, "error");
        }
        this.getGymWorkout();
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  // To Get The employee Edit Id And Set Values To Edit Modal Form
  editgymWorkout(row) {
    this.formTitle = "Edit Gym/Workout";
    this.gymWorkoutForm.patchValue({
      id: row.id,
      gym: row.gym,
      email: row.email,
      contact_phone_number: row.contact_phone_number,
      address: row.address,
      other_comments: row.other_comments,
    });
    $("#add_gym_workout").modal("show");
  }

  delete() {
    let payload: object;
    if (this.selectGymworkouts.length === 0) {
      return swal.fire("Error", "Select items to delete", "error");
    }
    this.selectGymworkouts.map((item) => {
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
          return this.setupService.deleteGymWorkout(payload).subscribe(
            (res) => {
              // this.loadingService.hide();
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOSHRM", message, "success").then(() => {
                  this.getGymWorkout();
                });
              } else {
                swal.fire("GOSHRM", message, "error");
              }
            },
            (err) => {
              // this.loadingService.hide();
              const message = err.status.message.friendlyMessage;
              swal.fire("GOSHRM", message, "error");
            }
          );
        }
      });
    this.selectedId = [];
  }

  addItemId(event: Event, id: number) {
    this.utilitiesService.deleteArray(event, id, this.selectedId);
  }

  checkAll(event: Event) {
    this.selectedId = this.utilitiesService.checkAllBoxes(
      event,
      this.gymWorkouts
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
