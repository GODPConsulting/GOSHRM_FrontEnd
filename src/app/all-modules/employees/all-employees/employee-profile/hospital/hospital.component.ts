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
  selector: "app-hospital",
  templateUrl: "./hospital.component.html",
  styleUrls: ["./hospital.component.css"],
})
export class HospitalComponent implements OnInit {
  cardFormTitle: string;
  spinner: boolean = false;
  public selectedId: number[] = [];
  hospitalForm: FormGroup;
  hospitalChangeReqForm: FormGroup;
  bookHospitalForm: FormGroup;
  @ViewChild("fileInput")
  fileInput: ElementRef;

  @Input() dataFromParent: any;
  @Input() isHr: string;
  // To hold data for each card
  employeeHospital: any[] = [];
  allHospitals$: Observable<any>;
  public dtOptions: DataTables.Settings = {};
  minDate: Date;
  maxDate: Date;
  dtTrigger: Subject<any> = new Subject();
  @Input() employeeId: number;
  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private utilitiesService: UtilitiesService,
    private setupService: SetupService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.initHospitalForm();
    this.initHospitalChangeForm();
    this.initBookHospitalForm();
    this.getEmployeeHospital(this.employeeId);
    // Observable to subscribe to in the template
    this.allHospitals$ = this.setupService.getHospitalMgt();
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

  initHospitalForm() {
    this.cardFormTitle = "Add Hospital";
    this.hospitalForm = this.formBuilder.group({
      id: [0],
      hospitalId: ["", Validators.required],
      hospitalRating: ["", Validators.required],
      contactPhoneNo: ["", Validators.required],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      approvalStatus: [
        { value: "2", disabled: this.isHr !== "true" },
        Validators.required,
      ],
      staffId: this.employeeId,
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
      staffId: this.employeeId,
      approvalStatus: [
        { value: "2", disabled: this.isHr !== "true" },
        Validators.required,
      ],
    });
    // Set dateOfRequest to be min date for expectedDateOfChange to
    this.minDate = new Date(
      this.hospitalChangeReqForm.get("dateOfRequest").value
    );
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
      staffId: this.employeeId,
    });
    this.minDate = new Date(this.bookHospitalForm.get("dateOfRequest").value);
  }

  submitHospitalForm(form: FormGroup) {
    // form.get("approvalStatus").enable();
    // Send mail to HR
    // if (!this.dataFromParent.isHr) {
    //   this.utilitiesService
    //     .sendToHr(
    //       "Add Hospital",
    //       this.dataFromParent.user.firstName,
    //       this.dataFromParent.user.lastName,
    //       this.dataFromParent.user.email,
    //       this.dataFromParent.user.userId
    //     )
    //     .subscribe();
    //   if (form.get("approvalStatus").value !== 2) {
    //     form.get("approvalStatus").setValue(2);
    //   }
    // }
    if (!form.valid) {
      form.get("approvalStatus").disable();
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    const payload = form.value;
    if (this.isHr !== "true") {
      payload.approvalStatus = 2;
    }
    payload.hospitalId = +payload.hospitalId;
    payload.approvalStatus = +payload.approvalStatus;
    /*  const formData = new FormData();
    for (const key in form.value) {
      formData.append(key, this.hospitalForm.get(key).value);
    }
 */
    // form.get("approvalStatus").disable();
    this.spinner = true;
    return this.employeeService.postHospital(payload).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          $("#hospital_modal").modal("hide");
        }
        this.getEmployeeHospital(this.employeeId);
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  submitHospitalChangeReqForm(form: FormGroup) {
    // form.get("approvalStatus").enable();
    form.get("dateOfRequest").enable();
    // Send mail to HR
    // if (!this.dataFromParent.isHr) {
    //   this.utilitiesService
    //     .sendToHr(
    //       "Add Identification",
    //       this.dataFromParent.user.firstName,
    //       this.dataFromParent.user.lastName,
    //       this.dataFromParent.user.email,
    //       this.dataFromParent.user.userId
    //     )
    //     .subscribe();
    //   if (form.get("approvalStatus").value !== 2) {
    //     form.get("approvalStatus").setValue(2);
    //   }
    // }
    if (!form.valid) {
      // form.get("approvalStatus").disable();
      form.get("dateOfRequest").disable();
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    const payload = form.value;
    if (this.isHr !== "true") {
      payload.approvalStatus = 2;
    }
    payload.approvalStatus = +payload.approvalStatus;
    payload.expectedDateOfChange = new Date(
      payload.expectedDateOfChange
    ).toLocaleDateString("en-CA");
    payload.suggestedHospital = +payload.suggestedHospital;
    payload.hospitalId = +payload.hospitalId;
    console.log(payload);
    // return;
    const formData = new FormData();
    Object.keys(payload).forEach((key) => formData.append(key, payload[key]));
    for (const key in form.value) {
      formData.append(key, this.hospitalChangeReqForm.get(key).value);
    }
    // form.get("approvalStatus").disable();
    form.get("dateOfRequest").disable();
    this.spinner = true;
    return this.employeeService.postHospitalChangeRequest(formData).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success").then(() => {
            $("#hmo_req_change_modal").modal("hide");
            this.getEmployeeHospital(this.employeeId);
          });
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

  submitBookHospitalForm(form: FormGroup) {
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
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  getEmployeeHospital(id: number) {
    this.loadingService.show();
    this.employeeService.getHospitalByStaffId(id).subscribe(
      (data) => {
        this.loadingService.hide();
        this.employeeHospital = data.employeeList;
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
          return this.employeeService.deleteHospital(payload).subscribe(
            (res) => {
              this.loadingService.hide();
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOSHRM", message, "success").then(() => {
                  this.getEmployeeHospital(this.employeeId);
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
      this.employeeHospital
    );
  }

  setDateToPresent(event: Event, form: FormGroup, formControlName: string) {
    this.utilitiesService.setDateToPresent(event, form, formControlName);
  }

  onSelectedFile(event: Event, form: FormGroup) {
    this.utilitiesService.uploadFileValidator(event, form, this.employeeId);
  }

  // Fixes the misleading error message "Cannot find a differ supporting object '[object Object]'"

  hack(val: any[]) {
    return Array.from(val);
  }
}
