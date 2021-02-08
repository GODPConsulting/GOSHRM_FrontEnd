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

  @Input() staffId: number;

  // To hold data for each card
  employeeHmo: any[] = [];
  public dtOptions: DataTables.Settings = {};

  // Observable to subscribe to in the template
  allHmos$: Observable<any> = this.setupService.getHmo();

  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private utilitiesService: UtilitiesService,
    private setupService: SetupService
  ) {}

  ngOnInit(): void {
    this.initHmoForm();
    this.initHmoChangeForm();
    this.getEmployeeHmo(this.staffId);
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

  initHmoForm() {
    this.cardFormTitle = "Add HMO";
    this.employeeHmoForm = this.formBuilder.group({
      id: [0],
      hmoId: ["", Validators.required],
      hmo_rating: ["", Validators.required],
      contactPhoneNo: ["", Validators.required],
      startDate: ["", Validators.required],
      end_Date: ["", Validators.required],
      approvalStatus: ["", Validators.required],
      staffId: this.staffId,
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
      staffId: this.staffId,
      approvalStatus: ["", Validators.required],
    });
    // Resets the upload input of the add form
    if (this.fileInput) {
      this.fileInput.nativeElement.value = "";
    }
  }

  submitHmoForm(form: FormGroup) {
    if (!form.valid) {
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

    this.spinner = true;
    return this.employeeService.postHmo(payload).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          $("#hmo_modal").modal("hide");
        }
        this.getEmployeeHmo(this.staffId);
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  submitHmoChangeReqForm(form: FormGroup) {
    form.get("dateOfRequest").enable();
    if (!form.valid) {
      form.get("dateOfRequest").disable();
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
          return this.employeeService.deleteHmo(payload).subscribe(
            (res) => {
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOSHRM", message, "success").then(() => {
                  this.getEmployeeHmo(this.staffId);
                });
              } else {
                swal.fire("GOSHRM", message, "error");
              }
            },
            (err) => {
              this.spinner = false;
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
    this.utilitiesService.patchFile(event, form);
  }

  // Fixes the misleading error message "Cannot find a differ supporting object '[object Object]'"
  hack(val: any[]) {
    return Array.from(val);
  }

  resetCheckbox(form: FormGroup, formControlName: string) {
    form.get(formControlName).setValue("");
  }
}
