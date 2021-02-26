import { Component, OnInit, ViewChild, ElementRef, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { EmployeeService } from "src/app/services/employee.service";
import { SetupService } from "src/app/services/setup.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";
declare const $: any;

@Component({
  selector: "app-employee-hmo",
  templateUrl: "./employee-hmo.component.html",
  styleUrls: ["./employee-hmo.component.css"],
})
export class EmployeeHmoComponent implements OnInit {
  cardFormTitle: string;
  pageLoading: boolean = false; // controls the visibility of the page loader
  spinner: boolean = false;
  public selectedId: number[] = [];
  employeeHmoForm: FormGroup;
  hmoChangeReqForm: FormGroup;
  @ViewChild("fileInput")
  fileInput: ElementRef;
  minDate: Date;
  @Input() dataFromParent: any;

  // To hold data for each card
  employeeHmo: any[] = [];
  public dtOptions: DataTables.Settings = {};

  // Observable to subscribe to in the template
  allHmos$: Observable<any> = this.setupService.getHmo();
  maxDate: any;

  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private utilitiesService: UtilitiesService,
    private setupService: SetupService
  ) {}

  ngOnInit(): void {
    this.initHmoForm();
    this.initHmoChangeForm();
    this.getEmployeeHmo(this.dataFromParent.user.staffId);
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

  initHmoForm() {
    this.cardFormTitle = "Add HMO";
    this.employeeHmoForm = this.formBuilder.group({
      id: [0],
      hmoId: ["", Validators.required],
      hmo_rating: ["", Validators.required],
      contactPhoneNo: ["", Validators.required],
      startDate: ["", Validators.required],
      end_Date: ["", Validators.required],
      approvalStatus: [
        { value: "2", disabled: !this.dataFromParent.isHr },
        Validators.required,
      ],
      staffId: this.dataFromParent.user.staffId,
      setCurrentDate: [""],
    });
  }

  initHmoChangeForm() {
    this.cardFormTitle = "HMO Change Request";
    this.hmoChangeReqForm = this.formBuilder.group({
      id: [0],
      hmoId: ["", Validators.required],
      suggestedHmo: ["", Validators.required],
      dateOfRequest: [
        { value: new Date().toLocaleDateString("en-CA"), disabled: true },
        Validators.required,
      ],
      expectedDateOfChange: ["", Validators.required],
      hmoFile: ["", Validators.required],
      staffId: this.dataFromParent.user.staffId,
      approvalStatus: [
        { value: "2", disabled: !this.dataFromParent.isHr },
        Validators.required,
      ],
    });
    // Set dateOfRequest to be min date for expectedDateOfChange to
    this.minDate = new Date(this.hmoChangeReqForm.get("dateOfRequest").value);

    // Resets the upload input of the add form
    if (this.fileInput) {
      this.fileInput.nativeElement.value = "";
    }
  }

  submitHmoForm(form: FormGroup) {
    form.get("approvalStatus").enable();
    // Send mail to HR
    if (!this.dataFromParent.isHr) {
      this.utilitiesService
        .sendToHr(
          "Add HMO",
          this.dataFromParent.user.firstName,
          this.dataFromParent.user.lastName,
          this.dataFromParent.user.email,
          this.dataFromParent.user.userId
        )
        .subscribe();
      if (form.get("approvalStatus").value !== 2) {
        form.get("approvalStatus").setValue(2);
      }
    }
    if (!form.valid) {
      form.get("approvalStatus").disable();
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    const payload = form.value;
    payload.approvalStatus = +payload.approvalStatus;
    payload.hmoId = +payload.hmoId;
    /* const formData = new FormData();
    for (const key in form.value) {
      
      formData.append(key, this.employeeHmoForm.get(key).value);
    } */
    form.get("approvalStatus").disable();
    this.spinner = true;
    return this.employeeService.postHmo(payload).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          $("#hmo_modal").modal("hide");
        }
        this.getEmployeeHmo(this.dataFromParent.user.staffId);
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  submitHmoChangeReqForm(form: FormGroup) {
    form.get("approvalStatus").enable();
    form.get("dateOfRequest").enable();
    // Send mail to HR
    if (!this.dataFromParent.isHr) {
      this.utilitiesService
        .sendToHr(
          "Add Identification",
          this.dataFromParent.user.firstName,
          this.dataFromParent.user.lastName,
          this.dataFromParent.user.email,
          this.dataFromParent.user.userId
        )
        .subscribe();
      if (form.get("approvalStatus").value !== 2) {
        form.get("approvalStatus").setValue(2);
      }
    }
    if (!form.valid) {
      form.get("dateOfRequest").disable();
      form.get("approvalStatus").disable();
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    /* const payload = form.value;
    payload.suggestedHmo = +payload.suggestedHmo;
    payload.hmoId = +payload.hmoId; */
    const formData = new FormData();
    //let newDate=

    form
      .get("expectedDateOfChange")
      .setValue(
        new Date(form.get("expectedDateOfChange").value).toLocaleDateString(
          "en-CA"
        )
      );
    for (const key in form.value) {
      formData.append(key, this.hmoChangeReqForm.get(key)?.value);
    }
    form.get("dateOfRequest").disable();
    form.get("approvalStatus").disable();
    this.spinner = true;
    return this.employeeService.postHmoChangeRequest(formData).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          $("#hmo_req_change_modal").modal("hide");
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

  getEmployeeHmo(id: number) {
    this.pageLoading = true;
    this.employeeService.getHmoByStaffId(id).subscribe(
      (data) => {
        this.pageLoading = false;
        this.employeeHmo = data.employeeList;
      },
      (err) => {
        this.spinner = false;
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
          return this.employeeService.deleteHmo(payload).subscribe(
            (res) => {
              this.pageLoading = false;
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOSHRM", message, "success").then(() => {
                  this.getEmployeeHmo(this.dataFromParent.user.staffId);
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
      this.employeeHmo
    );
  }

  setDateToPresent(event: Event, form: FormGroup, formControlName: string) {
    this.utilitiesService.setDateToPresent(event, form, formControlName);
  }

  onSelectedFile(event: Event, form: FormGroup) {
    this.utilitiesService.uploadFileValidator(
      event,
      form,
      this.dataFromParent.user.staffId
    );
  }

  // Fixes the misleading error message "Cannot find a differ supporting object '[object Object]'"
  hack(val: any[]) {
    return Array.from(val);
  }

  resetCheckbox(form: FormGroup, formControlName: string) {
    form.get(formControlName).setValue("");
  }

  /*  validateDate(
    form: FormGroup,
    startDate: string,
    endDate: string,
    startDateName: string,
    endDateName: string
  ) {
    this.utilitiesService.validateDate(
      form,
      startDate,
      endDate,
      startDateName,
      endDateName
    );
  } */
}
