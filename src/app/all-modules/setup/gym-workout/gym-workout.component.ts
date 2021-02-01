import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SetupService } from "src/app/services/setup.service";
import swal from "sweetalert2";

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
  public pageLoading: boolean;
  public spinner: boolean = false;
  public formTitle: string = "Add Gym/Workout";
  public gymWorkoutForm: FormGroup;
  public selectedId: any[] = [];
  public gymWorkoutUploadForm: FormGroup;
  public file: File;

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
      columns: [{ orderable: false }, null, null, null, null, null],
      order: [[1, "asc"]],
    };
    this.getGymWorkout();
    this.initializeForm();
  }

  // Prevents the edit modal from popping up when checkbox is clicked
  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
  }

  // Appends a selected file to "uploadInput"
  onSelectedFile(event) {
    this.file = event.target.files[0];
    this.gymWorkoutUploadForm.patchValue({
      uploadInput: this.file,
    });
  }

  downloadFile() {
    this.setupService
      .exportExcelFile("/hrmsetup/download/gymworkouts")
      .subscribe(
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
              const file = new File([bb], "gym/workout.xlsx", {
                type: "application/vnd.ms-excel",
              });

              saveAs(file);
            } catch (err) {
              const textFileAsBlob = new Blob([bb], {
                type: "application/vnd.ms-excel",
              });
              window.navigator.msSaveBlob(
                textFileAsBlob,
                "Deposit Category.xlsx"
              );
            }
          } else {
            return swal.fire(`GOS HRM`, "Unable to download data", "error");
          }
        },
        (err) => {}
      );
  }

  uploadGymWorkout() {
    if (!this.file) {
      return swal.fire("Error", "Select a file", "error");
    }
    const formData = new FormData();
    formData.append(
      "uploadInput",
      this.gymWorkoutUploadForm.get("uploadInput").value
    );
    this.spinner = true;
    return this.setupService
      .updateData("/hrmsetup/upload/gymworkout", formData)
      .subscribe(
        (res) => {
          this.spinner = false;
          const message = res.status.message.friendlyMessage;
          if (res.status.isSuccessful) {
            swal.fire("GOSHRM", message, "success");
            this.initializeForm();
            $("#upload_gym_workout").modal("hide");
          } else {
            swal.fire("Error", message, "error");
          }
          this.getGymWorkout();
        },
        (err) => {
          this.spinner = false;
          const message = err.status.message.friendlyMessage;
          swal.fire("Error", message, "error");
        }
      );
  }

  openUploadModal() {
    this.fileInput.nativeElement.value = "";
    $("#upload_gym_workout").modal("show");
  }

  initializeForm() {
    this.gymWorkoutForm = this.formBuilder.group({
      id: [0],
      gym: ["", Validators.required],
      contact_phone_number: ["", Validators.required],
      email: ["", Validators.required],
      address: ["", Validators.required],
      ratings: ["", Validators.required],
      other_comments: ["", Validators.required],
    });
    this.gymWorkoutUploadForm = this.formBuilder.group({
      uploadInput: [""],
    });
  }

  getGymWorkout() {
    this.pageLoading = true;
    return this.setupService.getData("/hrmsetup/get/all/gymworkouts").subscribe(
      (data) => {
        this.pageLoading = false;

        this.gymWorkouts = data.setuplist;
      },
      (err) => {
        this.pageLoading = false;

      }
    );
  }

  openModal() {
    $("#add_gym_workout").modal("show");
  }

  closeModal() {
    $("#add_gym_workout").modal("hide");
    this.initializeForm();
  }

  // Add Gym/workout  Modal Api Call
  addGymWorkout(form: FormGroup) {
    if (!form.valid) {
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    const payload = form.value;

    this.spinner = true;
    return this.setupService
      .updateData("/hrmsetup/add/update/gymworkout", payload)
      .subscribe(
        (res) => {
          this.spinner = false;
          const message = res.status.message.friendlyMessage;

          if (res.status.isSuccessful) {
            swal.fire("GOSHRM", message, "success");
            this.initializeForm();
            $("#add_gym_workout").modal("hide");
          } else {
            swal.fire("Error", message, "error");
          }
          this.getGymWorkout();
        },
        (err) => {
          this.spinner = false;
          const message = err.status.message.friendlyMessage;
          swal.fire("Error", message, "error");
        }
      );
  }

  // To Get The employee Edit Id And Set Values To Edit Modal Form
  editgymWorkout(row) {
    this.formTitle = "Edit Gym/Workout";
    this.gymWorkoutForm.patchValue({
      id: row.id,
      gym: row.gym,
      contact_phone_number: row.contact_phone_number,
      address: row.address,
      ratings: row.ratings,
      other_comments: row.other_comments,
    });
    $("#add_gym_workout").modal("show");
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
            .deleteData("/hrmsetup/delete/gymworkout", payload)
            .subscribe(
              (res) => {
                const message = res.status.message.friendlyMessage;
                if (res.status.isSuccessful) {
                  swal.fire("GOSHRM", message, "success").then(() => {
                    this.getGymWorkout();
                  });
                } else {
                  swal.fire("Error", message, "error");
                }
              },
              (err) => {

              }
            );
        }
      });
    this.selectedId = [];
  }

  checkAll(event: Event) {
    if ((<HTMLInputElement>event.target).checked) {
      this.selectedId = this.gymWorkouts.map((item) => {
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
