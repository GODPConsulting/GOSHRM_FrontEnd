import { Component, OnInit, ViewChild, ElementRef, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable, Subject } from "rxjs";
import { EmployeeService } from "src/app/services/employee.service";
import { SetupService } from "src/app/services/setup.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";
import { LoadingService } from "../../../../../services/loading.service";
declare const $: any;

@Component({
  selector: "app-employee-gym",
  templateUrl: "./employee-gym.component.html",
  styleUrls: ["./employee-gym.component.css"],
})
export class EmployeeGymComponent implements OnInit {
  cardFormTitle: string;
  spinner: boolean = false;
  public selectedId: number[] = [];
  employeeGymForm: FormGroup;
  gymChangeReqForm: FormGroup;
  bookGymForm: FormGroup;
  @ViewChild("fileInput")
  fileInput: ElementRef;

  @Input() dataFromParent: any;
  @Input() employeeId: number;
  @Input() isHr: string;
  // To hold data for each card
  employeeGym: any[] = [];
  allGyms$: Observable<any>;
  public dtOptions: DataTables.Settings = {};
  minDate: Date;
  maxDate: any;
  dtTrigger: Subject<any> = new Subject();
  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private utilitiesService: UtilitiesService,
    private setupService: SetupService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.initGymForm();
    this.initGymChangeForm();
    this.initBookGymForm();
    this.getEmployeeGym(this.employeeId);
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

  setMinMaxDate(form: FormGroup, startDate: string, endDate: string) {
    const dateSetter = this.utilitiesService.setMinMaxDate(
      form,
      startDate,
      endDate
    );
    this.minDate = dateSetter.minDate;
    this.maxDate = dateSetter.maxDate;
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
      approvalStatus: [
        { value: "2", disabled: this.isHr !== "true" },
        Validators.required,
      ],
      staffId: this.employeeId,
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
      staffId: this.employeeId,
      approvalStatus: [
        { value: "2", disabled: this.isHr !== "true" },
        Validators.required,
      ],
    });
    // Set dateOfRequest to be min date for expectedDateOfChange to
    this.minDate = new Date(this.gymChangeReqForm.get("dateOfRequest").value);
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
      staffId: this.employeeId,
    });
    // Set dateOfRequest to be min date for expectedDateOfChange to
    this.minDate = new Date(this.bookGymForm.get("dateOfRequest").value);
  }

  submitGymForm(form: FormGroup) {
    // form.get("approvalStatus").enable();
    // Send mail to HR
    if (!this.dataFromParent.isHr) {
      this.utilitiesService
        .sendToHr(
          "Add Gym",
          this.dataFromParent.user.firstName,
          this.dataFromParent.user.lastName,
          this.dataFromParent.user.email,
          this.dataFromParent.user.userId
        )
        .subscribe();
      // if (form.get("approvalStatus").value !== 2) {
      //   form.get("approvalStatus").setValue(2);
      // }
    }
    if (!form.valid) {
      // form.get("approvalStatus").disable();
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    const payload = form.value;
    if (this.isHr !== "true") {
      payload.approvalStatus = 2;
    }
    payload.approvalStatus = +payload.approvalStatus;
    payload.gymId = +payload.gymId;
    // form.get("approvalStatus").disable();
    this.spinner = true;
    return this.employeeService.postGym(payload).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          $("#gym_modal").modal("hide");
        }
        this.getEmployeeGym(this.employeeId);
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
    // form.get("approvalStatus").enable();
    // Send mail to HR
    if (!this.dataFromParent.isHr) {
      this.utilitiesService
        .sendToHr(
          "Change Gym",
          this.dataFromParent.user.firstName,
          this.dataFromParent.user.lastName,
          this.dataFromParent.user.email,
          this.dataFromParent.user.userId
        )
        .subscribe();
      // if (form.get("approvalStatus").value !== 2) {
      //   form.get("approvalStatus").setValue(2);
      // }
    }

    if (!form.valid) {
      // form.get("approvalStatus").disable();
      form.get("dateOfRequest").disable();
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    form
      .get("expectedDateOfChange")
      .setValue(
        new Date(form.get("expectedDateOfChange").value).toLocaleDateString(
          "en-CA"
        )
      );
    const payload = form.value;
    if (this.isHr !== "true") {
      payload.approvalStatus = 2;
    }
    payload.approvalStatus = +payload.approvalStatus;
    const formData = new FormData();
    for (const key in payload) {
      formData.append(key, payload[key]);
    }
    form.get("dateOfRequest").disable();
    // form.get("approvalStatus").disable();
    this.spinner = true;
    return this.employeeService.postGymChangeRequest(formData).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          $("#hmo_req_change_modal").modal("hide");
        }
        this.getEmployeeGym(this.employeeId);
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
    this.loadingService.show();
    this.employeeService.getGymByStaffId(id).subscribe(
      (data) => {
        this.loadingService.hide();
        this.employeeGym = data.employeeList;
        this.dtTrigger.next();
      },
      (err) => {
        this.loadingService.hide();
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
          this.loadingService.show();
          return this.employeeService.deleteGym(payload).subscribe(
            (res) => {
              this.loadingService.hide();
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOSHRM", message, "success").then(() => {
                  this.loadingService.hide();
                  this.getEmployeeGym(this.employeeId);
                });
              } else {
                swal.fire("GOSHRM", message, "error");
              }
            },
            (err) => {
              this.loadingService.hide();
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
    this.utilitiesService.uploadFileValidator(event, form, this.employeeId);
  }

  // Fixes the misleading error message "Cannot find a differ supporting object '[object Object]'"

  hack(val: any[]) {
    return Array.from(val);
  }
}
