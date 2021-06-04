import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EmployeeService } from "src/app/services/employee.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";
import { LoadingService } from "../../../../../services/loading.service";
import { Subject } from "rxjs";

declare const $: any;
@Component({
  selector: "app-referee",
  templateUrl: "./referee.component.html",
  styleUrls: ["./referee.component.css"],
})
export class RefereeComponent implements OnInit {
  cardFormTitle: string;
  spinner: boolean = false;
  public selectedId: number[] = [];
  refereeForm: FormGroup;
  @ViewChild("fileInput")
  fileInput: ElementRef;

  @Input() dataFromParent: any;
  @Input() employeeId: number;
  // To hold data for each card
  employeeReferee: any = [];
  public dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private utilitiesService: UtilitiesService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.getEmployeeReferee(this.employeeId);
    this.initRefereeForm();
    this.dtOptions = {
      dom:
        "<'row'<'col-sm-8 col-md-5'f><'col-sm-4 col-md-6 align-self-end'l>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Start typing to search by any field",
      },

      columns: [
        { orderable: false },
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ],
      order: [[1, "asc"]],
    };
  }

  downloadFile() {
    if (this.selectedId.length === 0) {
      return swal.fire(`GOS HRM`, "Please select item to download", "error");
    } else if (this.selectedId.length === 1) {
      // Filters out the data of selected file to download
      const idFileToDownload = this.employeeReferee.filter(
        (empId) => empId.id === this.selectedId[0]
      );

      // Gets the file name and extension of the file
      const fileName = idFileToDownload[0].fullName;
      const extension = idFileToDownload[0].refereeFilePath.split(".")[1];

      this.employeeService.downloadReferee(this.selectedId[0]).subscribe(
        (resp) => {
          const data = resp;
          // Converts response to file and downloads it
          this.utilitiesService.byteToFile(data, `${fileName}.${extension}`);
        },
        (err) => {}
      );
    } else {
      return swal.fire(`GOS HRM`, "Unable to download multiple files", "error");
    }
  }

  initRefereeForm() {
    this.cardFormTitle = "Add Referee";
    this.refereeForm = this.formBuilder.group({
      id: [0],
      fullName: ["", Validators.required],
      phoneNumber: ["", Validators.required],
      email: ["", Validators.required],
      relationship: ["", Validators.required],
      numberOfYears: ["", Validators.required],
      organization: ["", Validators.required],
      address: ["", Validators.required],
      confirmationReceived: ["", Validators.required],
      confirmationDate: ["", Validators.required],
      approvalStatus: ["2"],
      staffId: this.employeeId,
      refereeFile: ["", Validators.required],
    });
    // Resets the upload input of the add form
    if (this.fileInput) {
      this.fileInput.nativeElement.value = "";
    }
  }

  // Set Values To Edit Modal Form
  editForm(row) {
    this.cardFormTitle = "Edit Referee";
    this.refereeForm.patchValue({
      id: [0],
      fullName: row.fullName,
      phoneNumber: row.phoneNumber,
      email: row.email,
      relationship: row.relationship,
      numberOfYears: row.numberOfYears,
      organization: row.organization,
      address: row.address,
      confirmationReceived: row.confirmationReceived,
      confirmationDate: row.confirmationDate,
      approvalStatus: row.approvalStatus,
      staffId: this.employeeId,
    });
    if (this.fileInput) {
      this.fileInput.nativeElement.value = "";
    }
    $("#referee_modal").modal("show");
  }

  submitRefereeForm(form: FormGroup) {
    // Send mail to HR
    const payload = form.value;
    payload.approvalStatus = +payload.approvalStatus;
    form
      .get("confirmationDate")
      .setValue(
        new Date(form.get("confirmationDate").value).toLocaleDateString("en-CA")
      );
    const formData = new FormData();
    for (const key in form.value) {
      formData.append(key, this.refereeForm.get(key).value);
    }
    form.get("approvalStatus").disable();
    this.loadingService.show();
    return this.employeeService.postReferee(formData).subscribe(
      (res) => {
        this.loadingService.hide();
        let message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success").then(() => {
            if (!this.dataFromParent.isHr) {
              this.utilitiesService
                .sendToHr(
                  "Add Referee",
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
            $("#referee_modal").modal("hide");
            this.getEmployeeReferee(this.employeeId);
          });
        }
      },
      (err) => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  getEmployeeReferee(id: number) {
    this.loadingService.show();
    this.employeeService.getRefereeByStaffId(id).subscribe(
      (data) => {
        this.loadingService.hide();
        if (data.employeeList) {
          this.employeeReferee = data.employeeList;
          this.dtTrigger.next();
        }
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  onSelectedFile(event: Event, form: FormGroup) {
    this.utilitiesService.uploadFileValidator(event, form, this.employeeId);
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
          return this.employeeService.deleteReferee(payload).subscribe(
            (res) => {
              this.loadingService.hide();
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOSHRM", message, "success").then(() => {
                  this.getEmployeeReferee(this.employeeId);
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
      this.employeeReferee
    );
  }

  // Fixes the misleading error message "Cannot find a differ supporting object '[object Object]'"

  hack(val: any[]) {
    return Array.from(val);
  }
}
