import { Component, OnInit, ViewChild, ElementRef, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { EmployeeService } from "src/app/services/employee.service";
import { SetupService } from "src/app/services/setup.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";
declare const $: any;

@Component({
  selector: "app-hospital",
  templateUrl: "./hospital.component.html",
  styleUrls: ["./hospital.component.css"],
})
export class HospitalComponent implements OnInit {
  cardFormTitle: string;
  pageLoading: boolean = false; // controls the visibility of the page loader
  spinner: boolean = false;
  public selectedId: number[] = [];
  hospitalForm: FormGroup;
  hospitalChangeReqForm: FormGroup;
  bookHospitalForm: FormGroup;
  @ViewChild("fileInput")
  fileInput: ElementRef;

  @Input() staffId: number;

  // To hold data for each card
  employeeHospital: any[] = [];
  allHospitals$: Observable<any>;

  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private utilitiesService: UtilitiesService,
    private setupService: SetupService
  ) {}

  ngOnInit(): void {
    this.initHospitalForm();
    this.initHospitalChangeForm();
    this.initBookHospitalForm();
    this.getEmployeeHospital(this.staffId);
    // Observable to subscribe to in the template
    this.allHospitals$ = this.setupService.getHospitalMgt();
  }

  initHospitalForm() {
    this.cardFormTitle = "Add Hospital";
    this.hospitalForm = this.formBuilder.group({
      id: [0],
      hospitalId: ["", Validators.required],
      hospitalRating: ["", Validators.required],
      contactPhoneNo: ["", Validators.required],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      approvalStatus: ["", Validators.required],
      staffId: this.staffId,
      setCurrentDate: [""],
    });
  }

  initHospitalChangeForm() {
    this.cardFormTitle = "Hospital Change Request";
    this.hospitalChangeReqForm = this.formBuilder.group({
      id: [0],
      hospitalId: ["", Validators.required],
      suggestedHospital: ["", Validators.required],
      dateOfRequest: [
        { value: new Date().toLocaleDateString("en-CA"), disabled: true },
        Validators.required,
      ],
      expectedDateOfChange: ["", Validators.required],
      hospitalFile: ["", Validators.required],
      staffId: this.staffId,
    });
  }

  initBookHospitalForm() {
    this.cardFormTitle = "Book Hospital Meeting";
    this.bookHospitalForm = this.formBuilder.group({
      id: [0],
      hospitalId: ["", Validators.required],
      dateOfRequest: [
        { value: new Date().toLocaleDateString("en-CA"), disabled: true },
        Validators.required,
      ],
      proposedMeetingDate: ["", Validators.required],
      reasonsForMeeting: ["", Validators.required],
      hospitalMeetingFile: ["", Validators.required],
      staffId: this.staffId,
    });
  }

  submitHospitalForm(form: FormGroup) {
    if (!form.valid) {
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    const payload = form.value;
    payload.approvalStatus = +payload.approvalStatus;
    payload.hospitalId = +payload.hospitalId;
    /*  const formData = new FormData();
    for (const key in form.value) {
      formData.append(key, this.hospitalForm.get(key).value);
    }
 */
    this.spinner = true;
    return this.employeeService.postHospital(payload).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          $("#hospital_modal").modal("hide");
        }
        this.getEmployeeHospital(this.staffId);
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("Error", message, "error");
      }
    );
  }

  submitHospitalChangeReqForm(form: FormGroup) {
    form.get("dateOfRequest").enable();

    if (!form.valid) {
      form.get("dateOfRequest").disable();
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    const payload = form.value;
    payload.suggestedHospital = +payload.suggestedHospital;
    payload.hospitalId = +payload.hospitalId;
    const formData = new FormData();
    for (const key in form.value) {
      //console.log(key, this.identificationForm.get(key).value);
      formData.append(key, this.hospitalChangeReqForm.get(key).value);
    }
    form.get("dateOfRequest").disable();
    this.spinner = true;
    return this.employeeService.postHospitalChangeRequest(formData).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          $("#hmo_req_change_modal").modal("hide");
        }
        this.getEmployeeHospital(this.staffId);
      },
      (err) => {
        form.get("dateOfRequest").disable();
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("Error", message, "error");
      }
    );
  }

  submitBookHospitalForm(form: FormGroup) {
    form.get("dateOfRequest").enable();

    if (!form.valid) {
      form.get("dateOfRequest").disable();
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }

    const formData = new FormData();
    for (const key in form.value) {
      //console.log(key, this.identificationForm.get(key).value);
      formData.append(key, this.bookHospitalForm.get(key).value);
    }
    form.get("dateOfRequest").disable();
    this.spinner = true;
    return this.employeeService.postBookHospitalMeeting(formData).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          $("#hospital_book_meeting_modal").modal("hide");
        }
      },
      (err) => {
        form.get("dateOfRequest").disable();
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("Error", message, "error");
      }
    );
  }

  getEmployeeHospital(id: number) {
    this.pageLoading = true;
    this.employeeService.getHospitalByStaffId(id).subscribe(
      (data) => {
        this.pageLoading = false;
        this.employeeHospital = data.employeeList;
      },
      (err) => {
        this.pageLoading = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("Error", message, "error");
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
          return this.employeeService.deleteHospital(payload).subscribe(
            (res) => {
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOSHRM", message, "success").then(() => {
                  this.getEmployeeHospital(this.staffId);
                });
              } else {
                swal.fire("Error", message, "error");
              }
            },
            (err) => {
              this.spinner = false;
              const message = err.status.message.friendlyMessage;
              swal.fire("Error", message, "error");
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
      this.employeeHospital
    );
  }

  setDateToPresent(event: Event, form: FormGroup, formControlName: string) {
    this.utilitiesService.setDateToPresent(event, form, formControlName);
  }

  onSelectedFile(event: Event, form: FormGroup) {
    this.utilitiesService.patchFile(event, form);
  }

  // Fixes the misleading error message "Cannot find a differ supporting object '[object Object]'"
  hack(val: any[]) {
    return Array.from(val);
  }
}
