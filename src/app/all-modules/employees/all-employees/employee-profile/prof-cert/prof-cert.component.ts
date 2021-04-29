import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable, Subject } from "rxjs";
import { EmployeeService } from "src/app/services/employee.service";
import { SetupService } from "src/app/services/setup.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";
import { LoadingService } from "../../../../../services/loading.service";

declare const $: any;

@Component({
  selector: "app-prof-cert",
  templateUrl: "./prof-cert.component.html",
  styleUrls: ["./prof-cert.component.css"],
})
export class ProfCertComponent implements OnInit {
  cardFormTitle: string;
  spinner: boolean = false;
  public selectedId: number[] = [];
  profCertForm: FormGroup;
  @ViewChild("fileInput")
  fileInput: ElementRef;

  @Input() dataFromParent: any;

  // To hold data for card
  employeeProfCert: any[] = [];
  allCertificates$: Observable<any> = this.setupService.getProfCerts();
  allJobGrades$: Observable<any> = this.setupService.getJobGrades();
  public dtOptions: DataTables.Settings = {};
  minDate: any;
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
    this.initProfCertForm();
    this.getEmployeeProfCert(this.dataFromParent.user.staffId);
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

  setMinMaxDate(form: FormGroup, startDate: string, endDate: string) {
    const dateSetter = this.utilitiesService.setMinMaxDate(
      form,
      startDate,
      endDate
    );
    this.minDate = dateSetter.minDate;
    this.maxDate = dateSetter.maxDate;
  }

  downloadFile() {
    if (this.selectedId.length === 0) {
      return swal.fire(`GOS HRM`, "Please select item to download", "error");
    } else if (this.selectedId.length === 1) {
      // Filters out the data of selected file to download
      const idFileToDownload = this.employeeProfCert.filter(
        (empId) => empId.id === this.selectedId[0]
      );

      // Gets the file name and extension of the file
      const fileName = idFileToDownload[0].CertificateName;
      const extension = idFileToDownload[0].Attachment.split(".")[1];
      this.loadingService.show();
      this.employeeService.downloadProfCert(this.selectedId[0]).subscribe(
        (resp) => {
          this.loadingService.hide();
          // Converts response to file and downloads it
          this.utilitiesService.byteToFile(resp, `${fileName}.${extension}`);
        },
        (err) => {
          this.loadingService.hide();
        }
      );
    } else {
      return swal.fire(`GOS HRM`, "Unable to download multiple files", "error");
    }
  }

  initProfCertForm() {
    this.cardFormTitle = "Add Professional Certification";
    this.profCertForm = this.formBuilder.group({
      id: [0],
      certificationId: ["", Validators.required],
      institution: ["", Validators.required],
      dateGranted: ["", Validators.required],
      expiryDate: ["", Validators.required],
      approvalStatus: [
        { value: "2", disabled: !this.dataFromParent.isHr },
        Validators.required,
      ],
      staffId: this.dataFromParent.user.staffId,
      gradeId: ["", Validators.required],
      profCertificationFile: ["", Validators.required],
      setCurrentDate: [""],
    });
    // Resets the upload input of the add form
    if (this.fileInput) {
      this.fileInput.nativeElement.value = "";
    }
  }

  // Set Values To Edit Modal Form
  editForm(row) {
    this.cardFormTitle = "Edit Professional Certification";
    this.profCertForm.patchValue({
      id: row.id,
      certificationId: row.certificationId,
      institution: row.institution,
      dateGranted: row.dateGranted,
      expiryDate: new Date(row.expiryDate).toLocaleDateString("en-CA"),
      approvalStatus: row.approvalStatus,
      staffId: this.dataFromParent.user.staffId,
      gradeId: row.gradeId,
      profCertificationFile: row.profCertificationFile,
    });
    this.fileInput.nativeElement.value = "";
    $("#prof_cert_modal").modal("show");
  }

  submitProfCertForm(form: FormGroup) {
    form.get("approvalStatus").enable();
    // Send mail to HR
    if (!this.dataFromParent.isHr) {
      this.utilitiesService
        .sendToHr(
          "Add Professional Certification",
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

    const formData = new FormData();
    form
      .get("dateGranted")
      .setValue(
        new Date(form.get("dateGranted").value).toLocaleDateString("en-CA")
      );

    for (const key in form.value) {
      formData.append(key, this.profCertForm.get(key).value);
    }
    form.get("approvalStatus").disable();

    this.spinner = true;
    return this.employeeService.postProfCert(formData).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          $("#prof_cert_modal").modal("hide");
        }
        this.getEmployeeProfCert(this.dataFromParent.user.staffId);
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  getEmployeeProfCert(id: number) {
    this.loadingService.show();
    this.employeeService.getProfCertByStaffId(id).subscribe(
      (data) => {
        this.loadingService.hide();
        this.employeeProfCert = data.employeeList;
        this.dtTrigger.next();
      },
      (err) => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
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
          return this.employeeService.deleteProfCert(payload).subscribe(
            (res) => {
              this.loadingService.hide();
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOSHRM", message, "success").then(() => {
                  this.getEmployeeProfCert(this.dataFromParent.user.staffId);
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
      this.employeeProfCert
    );
  }

  setDateToPresent(event: Event, form: FormGroup, formControlName: string) {
    this.utilitiesService.setDateToPresent(event, form, formControlName);
  }

  // Fixes the misleading error message "Cannot find a differ supporting object '[object Object]'"
  hack(val: any[]) {
    return Array.from(val);
  }

  resetCheckbox(form: FormGroup, formControlName: string) {
    form.get(formControlName).setValue("");
  }

  /* validateDate(
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
