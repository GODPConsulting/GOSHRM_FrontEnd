import { Component, OnInit, ViewChild, ElementRef, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EmployeeService } from "src/app/services/employee.service";
import { SetupService } from "src/app/services/setup.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";
import { LoadingService } from "../../../../../services/loading.service";
declare const $: any;

@Component({
  selector: "app-identification",
  templateUrl: "./identification.component.html",
  styleUrls: ["./identification.component.css"],
})
export class IdentificationComponent implements OnInit {
  cardFormTitle: string;
  spinner: boolean = false;
  public selectedId: number[] = [];
  public identifications: any[] = [];
  identificationForm: FormGroup;
  @ViewChild("fileInput")
  fileInput: ElementRef;

  @Input() dataFromParent: any;

  // To hold data for each card
  employeeIdentification: any[] = [];
  public dtOptions: DataTables.Settings = {};
  statusArray: string[] = [];
  dtTrigger: any;
  constructor(
    private formBuilder: FormBuilder,
    private setupService: SetupService,
    private employeeService: EmployeeService,
    private utilitiesService: UtilitiesService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.getIdentification();
    this.initIdentificationForm();
    this.getEmployeeIdentification(this.dataFromParent.user.staffId);
    this.dtOptions = {
      dom:
        "<'row'<'col-sm-8 col-md-5'f><'col-sm-4 col-md-6 align-self-end'l>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Start typing to search by any field",
      },

      columns: [{ orderable: false }, null, null, null, null, null, null],
      order: [[1, "asc"]],
    };
  }

  downloadFile() {
    if (this.selectedId.length === 0) {
      return swal.fire(`GOS HRM`, "Please select item to download", "error");
    } else if (this.selectedId.length === 1) {
      // Filters out the data of selected file to download
      const idFileToDownload = this.employeeIdentification.filter(
        (empId) => empId.id === this.selectedId[0]
      );

      // Gets the file name and extension of the file
      const fileName = idFileToDownload[0].identification;
      const extension = idFileToDownload[0].identificationFilePath.split(
        "."
      )[1];

      this.employeeService.downloadIdentification(this.selectedId[0]).subscribe(
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

  initIdentificationForm() {
    this.cardFormTitle = "Add Identification";
    this.identificationForm = this.formBuilder.group({
      id: [0],
      identificationId: ["", Validators.required],
      identification_number: ["", Validators.required],
      idIssues: ["", Validators.required],
      idExpiry_date: ["", Validators.required],
      approval_status: [
        { value: "2", disabled: !this.dataFromParent.isHr },
        Validators.required,
      ],
      staffId: this.dataFromParent.user.staffId,
      identicationFile: ["", Validators.required],
    });
    // Resets the upload input of the add form
    if (this.fileInput) {
      this.fileInput.nativeElement.value = "";
    }
  }

  // Set Values To Edit Modal Form
  editForm(row) {
    this.cardFormTitle = "Edit Identification";
    this.identificationForm.patchValue({
      id: row.id,
      identificationId: row.identificationId,
      identification_number: row.identification_number,
      idIssues: row.idIssues,
      idExpiry_date: new Date(row.idExpiry_date).toLocaleDateString("en-CA"),
      approval_status: row.approval_status,
      staffId: this.dataFromParent.user.staffId,
      identicationFile: row.identicationFile,
    });
    this.fileInput.nativeElement.value = "";
    $("#identification_modal").modal("show");
  }

  submitIdentificationForm(form: FormGroup) {
    form.get("approval_status").enable();
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
      if (form.get("approval_status").value !== 2) {
        form.get("approval_status").setValue(2);
      }
    }

    if (!form.valid) {
      form.get("approval_status").disable();
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    const formData = new FormData();
    form
      .get("idExpiry_date")
      .setValue(
        new Date(form.get("idExpiry_date").value).toLocaleDateString("en-CA")
      );
    for (const key in form.value) {
      formData.append(key, this.identificationForm.get(key).value);
    }
    form.get("approval_status").disable();

    this.spinner = true;
    return this.employeeService.postIdentificationId(formData).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          $("#identification_modal").modal("hide");
        }
        this.getEmployeeIdentification(this.dataFromParent.user.staffId);
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  getEmployeeIdentification(id: number) {
    this.loadingService.show();
    this.employeeService.getIdentificationByStaffId(id).subscribe(
      (data) => {
        this.loadingService.hide();
        this.employeeIdentification = data.employeeList;
      },
      (err) => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  getIdentification() {
    this.loadingService.show();
    return this.setupService.getData("/common/identifications").subscribe(
      (data) => {
        this.loadingService.hide();
        this.identifications = data.commonLookups;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  onSelectedFile(event: Event, form: FormGroup) {
    this.utilitiesService.uploadFileValidator(
      event,
      form,
      this.dataFromParent.user.staffId
    );
  }

  // Prevents the edit modal from popping up when checkbox is clicked
  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
  }

  delete() {
    let payload: object;
    if (this.selectedId.length === 0) {
      return swal.fire("GOSHRM", "Select items to delete", "error");
    } else {
      if (this.statusArray.every((status) => status === "pending")) {
        payload = {
          itemIds: this.selectedId,
        };
      } else {
        return swal.fire(
          "GOSHRM",
          "Select only items with pending status to delete",
          "error"
        );
      }
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
          return this.employeeService.deleteIdentification(payload).subscribe(
            (res) => {
              this.loadingService.hide();
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOSHRM", message, "success").then(() => {
                  this.getEmployeeIdentification(
                    this.dataFromParent.user.staffId
                  );
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

  addItemId(event: Event, id: number, status: string) {
    this.statusArray.push(status);
    this.utilitiesService.deleteArray(event, id, this.selectedId);
  }

  checkAll(event: Event) {
    this.selectedId = this.utilitiesService.checkAllBoxes(
      event,
      this.employeeIdentification
    );
  }

  // Fixes the misleading error message "Cannot find a differ supporting object '[object Object]'"

  hack(val: any[]) {
    return Array.from(val);
  }
}
