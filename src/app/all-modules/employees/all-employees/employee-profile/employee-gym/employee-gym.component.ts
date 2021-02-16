import { Component, OnInit, ViewChild, ElementRef, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { EmployeeService } from "src/app/services/employee.service";
import { SetupService } from "src/app/services/setup.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";
declare const $: any;

@Component({
  selector: "app-employee-gym",
  templateUrl: "./employee-gym.component.html",
  styleUrls: ["./employee-gym.component.css"],
})
export class EmployeeGymComponent implements OnInit {
  cardFormTitle: string;
  pageLoading: boolean = false; // controls the visibility of the page loader
  spinner: boolean = false;
  public selectedId: number[] = [];
  employeeGymForm: FormGroup;
  gymChangeReqForm: FormGroup;
  bookGymForm: FormGroup;
  @ViewChild("fileInput")
  fileInput: ElementRef;

  @Input() staffId: number;

  // To hold data for each card
  employeeGym: any[] = [];
  allGyms$: Observable<any>;
  public dtOptions: DataTables.Settings = {};

  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private utilitiesService: UtilitiesService,
    private setupService: SetupService
  ) {}

  ngOnInit(): void {
    this.initGymForm();
    this.initGymChangeForm();
    this.initBookGymForm();
    this.getEmployeeGym(this.staffId);
    // Observable to subscribe to in the template
    this.allGyms$ = this.setupService.getGymWorkout();
    this.dtOptions = {
      dom:
        "<'row'<'col-sm-8 col-md-5'f><'col-sm-4 col-md-6 align-self-end'l>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Start typing to search by any field",
      },

      columns: [{ orderable: false }, null, null, null, null, null, null, null],
      order: [[1, "asc"]],
    };
  }

  initGymForm() {
    this.cardFormTitle = "Add Gym";
    this.employeeGymForm = this.formBuilder.group({
      id: [0],
      gymId: ["", Validators.required],
      gymRating: ["", Validators.required],
      gymContactPhoneNo: ["", Validators.required],
      startDate: ["", Validators.required],
      end_Date: ["", Validators.required],
      approvalStatus: ["", Validators.required],
      staffId: this.staffId,
      setCurrentDate: [""],
    });
  }

  initGymChangeForm() {
    this.cardFormTitle = "Gym Change Request";
    this.gymChangeReqForm = this.formBuilder.group({
      id: [0],
      gymId: ["", Validators.required],
      suggestedGym: ["", Validators.required],
      dateOfRequest: [
        { value: new Date().toLocaleDateString("en-CA"), disabled: true },
        Validators.required,
      ],
      expectedDateOfChange: ["", Validators.required],
      gymFile: ["", Validators.required],
      staffId: this.staffId,
      approvalStatus: ["", Validators.required],
    });
  }

  initBookGymForm() {
    this.cardFormTitle = "Book Gym Meeting";
    this.bookGymForm = this.formBuilder.group({
      id: [0],
      gymId: ["", Validators.required],
      dateOfRequest: [
        { value: new Date().toLocaleDateString("en-CA"), disabled: true },
        Validators.required,
      ],
      proposedMeetingDate: ["", Validators.required],
      reasonsForMeeting: ["", Validators.required],
      gymMeetingFile: ["", Validators.required],
      staffId: this.staffId,
    });
  }

  submitGymForm(form: FormGroup) {
    console.log(form.value);

    if (!form.valid) {
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    const payload = form.value;
    payload.approvalStatus = +payload.approvalStatus;
    payload.gymId = +payload.gymId;
    this.spinner = true;
    return this.employeeService.postGym(payload).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          $("#gym_modal").modal("hide");
        }
        this.getEmployeeGym(this.staffId);
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  submitGymChangeReqForm(form: FormGroup) {
    form.get("dateOfRequest").enable();

    if (!form.valid) {
      form.get("dateOfRequest").disable();
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }

    const formData = new FormData();
    for (const key in form.value) {
      formData.append(key, this.gymChangeReqForm.get(key).value);
    }
    form.get("dateOfRequest").disable();
    this.spinner = true;
    return this.employeeService.postGymChangeRequest(formData).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          $("#hmo_req_change_modal").modal("hide");
        }
        this.getEmployeeGym(this.staffId);
      },
      (err) => {
        form.get("dateOfRequest").disable();
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  submitBookGymForm(form: FormGroup) {
    form.get("dateOfRequest").enable();

    if (!form.valid) {
      form.get("dateOfRequest").disable();
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }

    const formData = new FormData();

    form
      .get("proposedMeetingDate")
      .setValue(
        new Date(form.get("proposedMeetingDate").value).toLocaleDateString(
          "en-CA"
        )
      );
    for (const key in form.value) {
      formData.append(key, this.bookGymForm.get(key).value);
    }
    form.get("dateOfRequest").disable();
    this.spinner = true;
    return this.employeeService.postBookGymMeeting(formData).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          $("#gym_book_meeting_modal").modal("hide");
        }
      },
      (err) => {
        form.get("dateOfRequest").disable();
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  getEmployeeGym(id: number) {
    this.pageLoading = true;
    this.employeeService.getGymByStaffId(id).subscribe(
      (data) => {
        this.pageLoading = false;
        this.employeeGym = data.employeeList;
      },
      (err) => {
        this.pageLoading = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  // Prevents the edit modal from popping up when checkbox is clicked
  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
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
          return this.employeeService.deleteGym(payload).subscribe(
            (res) => {
              this.pageLoading = false;
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOSHRM", message, "success").then(() => {
                  this.pageLoading = false;
                  this.getEmployeeGym(this.staffId);
                });
              } else {
                swal.fire("GOSHRM", message, "error");
              }
            },
            (err) => {
              this.pageLoading = false;
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
      this.employeeGym
    );
  }

  setDateToPresent(event: Event, form: FormGroup, formControlName: string) {
    this.utilitiesService.setDateToPresent(event, form, formControlName);
  }

  resetCheckbox(form: FormGroup, formControlName: string) {
    form.get(formControlName).setValue("");
  }

  onSelectedFile(event: Event, form: FormGroup) {
    this.utilitiesService.uploadFileValidator(event, form, this.staffId);
  }

  // Fixes the misleading error message "Cannot find a differ supporting object '[object Object]'"
  hack(val: any[]) {
    return Array.from(val);
  }
}
