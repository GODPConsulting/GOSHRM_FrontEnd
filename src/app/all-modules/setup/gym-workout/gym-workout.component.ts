import { DatePipe } from "@angular/common";
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
  public rows = [];
  public srch = [];
  pageLoading: boolean;

  spinner: boolean = false;
  public formTitle = "Add Gym/Workout";
  public pipe = new DatePipe("en-US");
  public gymWorkoutForm: FormGroup;
  selectedId: any[] = [];
  public gymWorkoutUploadForm: FormGroup;
  file: File;

  constructor(
    private formBuilder: FormBuilder,
    private setupService: SetupService
  ) {}

  ngOnInit(): void {
    $(".floating")
      .on("focus blur", function (e) {
        $(this)
          .parents(".form-focus")
          .toggleClass("focused", e.type === "focus" || this.value.length > 0);
      })
      .trigger("blur");
    this.dtOptions = {
      dom:
        "<'row'<'col-sm-8 col-md-5'f><'col-sm-4 col-md-6 align-self-end'l>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Start typing to search by any field",
      },
      columns: [{ orderable: false }, null, null, null, null],
      order: [[1, "asc"]],
    };
    this.getGymWorkout();
    this.initializeForm();
  }

  stopParentEvent(event) {
    event.stopPropagation();
  }

  onSelectedFile(event) {
    this.file = event.target.files[0];
    this.gymWorkoutUploadForm.patchValue({
      uploadInput: this.file,
    });
  }

  uploadGymWorkout() {
    const formData = new FormData();
    formData.append(
      "uploadInput",
      this.gymWorkoutUploadForm.get("uploadInput").value
    );
    if (!this.file) {
      return swal.fire("Error", "Select a file", "error");
    }
    //console.log(formData, this.jobGradeUploadForm.get("uploadInput").value);
    this.spinner = true;

    return this.setupService
      .updateData("/hrmsetup/upload/gymworkout", formData)
      .subscribe(
        (res) => {
          this.spinner = false;
          const message = res.status.message.friendlyMessage;
          if (res.status.isSuccessful) {
            swal.fire("Success", message, "success");
            this.initializeForm();
            this.fileInput.nativeElement.value = "";
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
    $("#upload_gym_workout").modal("show");
  }

  initializeForm() {
    this.gymWorkoutForm = this.formBuilder.group({
      id: [0],
      gym: ["", Validators.required],
      contact_phone_number: ["", Validators.required],
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
        //console.log(data);
        this.gymWorkouts = data.setuplist;
        this.rows = this.gymWorkouts;
        this.srch = [...this.rows];
      },
      (err) => {
        this.pageLoading = false;
        console.log(err);
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

  // Add employee  Modal Api Call
  addGymWorkout(Form: FormGroup) {
    if (!Form.valid) {
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    const payload = Form.value;
    console.log(payload);
    return this.setupService
      .updateData("/hrmsetup/add/update/gymworkout", payload)
      .subscribe(
        (res) => {
          const message = res.status.message.friendlyMessage;
          //console.log(message);
          if (res.status.isSuccessful) {
            swal.fire("Success", message, "success");
            this.initializeForm();
            $("#add_gym_workout").modal("hide");
          } else {
            swal.fire("Error", message, "error");
          }
          this.getGymWorkout();
        },
        (err) => {
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

  delete(id: any) {
    let payload;
    if (id) {
      const body = [id];
      //body.push(id);
      //console.log(body);
      payload = {
        itemIds: body,
      };
    } else if (this.selectedId) {
      if (this.selectedId.length === 0) {
        return swal.fire("Error", "Select items to delete", "error");
      }
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
        //console.log(result);

        if (result.value) {
          return this.setupService
            .deleteData("/hrmsetup/delete/gymworkout", payload)
            .subscribe(
              (res) => {
                const message = res.status.message.friendlyMessage;
                if (res.status.isSuccessful) {
                  swal.fire("Success", message, "success").then(() => {
                    this.getGymWorkout();
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

  checkAll(event) {
    if (event.target.checked) {
      this.selectedId = this.gymWorkouts.map((item) => {
        return item.id;
      });
    } else {
      this.selectedId = [];
    }
  }

  addItemId(event, id) {
    if (event.target.checked) {
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
