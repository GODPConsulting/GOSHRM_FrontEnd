import { Component, OnInit, ViewChild, ElementRef, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EmployeeService } from "src/app/services/employee.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";
import { LoadingService } from "../../../../../services/loading.service";
import { Subject } from "rxjs";
declare const $: any;

@Component({
  selector: "app-hobbies",
  templateUrl: "./hobbies.component.html",
  styleUrls: ["./hobbies.component.css"],
})
export class HobbiesComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  employeeDetails: any = {};
  cardFormTitle: string;
  spinner: boolean = false;
  public selectedId: number[] = [];

  @ViewChild("fileInput")
  fileInput: ElementRef;

  @Input() dataFromParent: any;
  @Input() employeeId: number;
  @Input() isHr: string;
  // Forms
  hobbyForm: FormGroup;

  // To hold data for each card
  employeeHobby: any = {};
  dtTrigger: Subject<any> = new Subject();
  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private utilitiesService: UtilitiesService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    // this.dtOptions = {
    //   dom:
    //     "<'row'<'col-sm-8 col-md-5'f><'col-sm-4 col-md-6 align-self-end'l>>" +
    //     "<'row'<'col-sm-12'tr>>" +
    //     "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
    //   language: {
    //     search: "_INPUT_",
    //     searchPlaceholder: "Start typing to search by any field",
    //   },
    //
    //   columns: [{ orderable: false }, null, null, null, null, null],
    //   order: [[1, "asc"]],
    // };
    this.getEmployeeHobby(this.employeeId);
    this.initHobbyForm();
  }

  initHobbyForm() {
    this.cardFormTitle = "Add Hobby";
    this.hobbyForm = this.formBuilder.group({
      id: [0],
      hobbyName: ["", Validators.required],
      rating: ["", Validators.required],
      description: ["", Validators.required],
      approvalStatus: [{ value: "2", disabled: this.isHr !== "true" }],
      staffId: this.employeeId,
    });
  }

  submitHobbyForm(form: FormGroup) {
    // form.get("approvalStatus").enable();
    // Send mail to HR

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
    // form.get("approvalStatus").disable();
    this.spinner = true;
    return this.employeeService.postHobby(payload).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success").then(() => {
            if (!this.dataFromParent.isHr) {
              this.utilitiesService
                .sendToHr(
                  "Add Hobbies",
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
            this.getEmployeeHobby(this.employeeId);
            $("#hobby_modal").modal("hide");
          });
        }
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  getEmployeeHobby(id: number) {
    this.employeeService.getHobbyByStaffId(id).subscribe((data) => {
      if (data.employeeList) {
        this.employeeHobby = data.employeeList;
        this.dtTrigger.next();
      }
    });
  }

  // Set Values To Edit Modal Form
  edit(row) {
    this.cardFormTitle = "Edit Hobby";
    this.hobbyForm.patchValue({
      id: row.id,
      hobbyName: row.hobbyName,
      rating: row.rating,
      description: row.description,
      approval_status_name: row.approval_status_name,
      staffId: this.employeeId,
      hobbyFile: row.hobbyFile,
    });
    $("#hobby_modal").modal("show");
  }

  // Fixes the misleading error message "Cannot find a differ supporting object '[object Object]'"
  hack(val: any[]) {
    return Array.from(val);
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
          return this.employeeService.deleteHobby(payload).subscribe(
            (res) => {
              this.loadingService.hide();
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOSHRM", message, "success").then(() => {
                  this.getEmployeeHobby(this.employeeId);
                });
              } else {
                swal.fire("GOSHRM", message, "error");
              }
            },
            (err) => {
              this.loadingService.hide();
              this.utilitiesService.showMessage(err, "error");
            }
          );
        }
      });
    this.selectedId = [];
  }

  addItemId(event, id: number) {
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

  checkAll(event) {
    if (event.target.checked) {
      this.selectedId = this.employeeHobby.map((item) => {
        return item.id;
      });
    } else {
      this.selectedId = [];
    }
  }

  downloadFile() {}
}
