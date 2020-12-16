import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SetupService } from "src/app/services/setup.service";
import swal from "sweetalert2";

declare const $: any;
@Component({
  selector: "app-gym-workout",
  templateUrl: "./gym-workout.component.html",
  styleUrls: ["./gym-workout.component.css","../setup.component.css"]
})
export class GymWorkoutComponent implements OnInit {
  public gymWorkouts: any[] = [];
  public rows = [];
  public srch = [];
  pageLoading: boolean;
  public formTitle = "Add Gym/Workout";
  public gymWorkoutForm: FormGroup;
  selectedId: any[] = [];

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
    this.getGymWorkout();
    this.initializeForm();
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
