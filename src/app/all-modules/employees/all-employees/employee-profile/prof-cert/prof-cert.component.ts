import { Component, OnInit, ViewChild, ElementRef, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { EmployeeService } from "src/app/services/employee.service";
import { SetupService } from "src/app/services/setup.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";
declare const $: any;

@Component({
  selector: "app-prof-cert",
  templateUrl: "./prof-cert.component.html",
  styleUrls: ["./prof-cert.component.css"],
})
export class ProfCertComponent implements OnInit {
  cardFormTitle: string;
  pageLoading: boolean = false; // controls the visibility of the page loader
  spinner: boolean = false;
  public selectedId: number[] = [];
  profCertForm: FormGroup;
  @ViewChild("fileInput")
  fileInput: ElementRef;

  @Input() staffId: number;

  // To hold data for card
  employeeProfCert: any[] = [];
  allCertificates$: Observable<any> = this.setupService.getProfCerts();
  allJobGrades$: Observable<any> = this.setupService.getJobGrades();
  public dtOptions: DataTables.Settings = {};

  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private utilitiesService: UtilitiesService,
    private setupService: SetupService
  ) {}

  ngOnInit(): void {
    this.initProfCertForm();
    this.getEmployeeProfCert(this.staffId);
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
      const idFileToDownload = this.employeeProfCert.filter(
        (empId) => empId.id === this.selectedId[0]
      );

      // Gets the file name and extension of the file
      const fileName = idFileToDownload[0].CertificateName;
      const extension = idFileToDownload[0].Attachment.split(".")[1];

      this.employeeService.downloadProfCert(this.selectedId[0]).subscribe(
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

  initProfCertForm() {
    this.cardFormTitle = "Add Professional Certification";
    this.profCertForm = this.formBuilder.group({
      id: [0],
      certificationId: ["", Validators.required],
      institution: ["", Validators.required],
      dateGranted: ["", Validators.required],
      expiryDate: ["", Validators.required],
      approvalStatus: ["", Validators.required],
      staffId: this.staffId,
      gradeId: ["", Validators.required],
      profCertificationFile: ["", Validators.required],
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
      staffId: this.staffId,
      gradeId: row.gradeId,
      profCertificationFile: row.profCertificationFile,
    });
    this.fileInput.nativeElement.value = "";
    $("#prof_cert_modal").modal("show");
  }

  submitProfCertForm(form: FormGroup) {
    if (!form.valid) {
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }

    const formData = new FormData();
    form
      .get("dateGranted")
      .setValue(
        new Date(form.get("dateGranted").value).toLocaleDateString("en-CA")
      );

    form
      .get("expiryDate")
      .setValue(
        new Date(form.get("expiryDate").value).toLocaleDateString("en-CA")
      );
    for (const key in form.value) {
      formData.append(key, this.profCertForm.get(key).value);
    }

    this.spinner = true;
    return this.employeeService.postProfCert(formData).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          $("#prof_cert_modal").modal("hide");
        }
        this.getEmployeeProfCert(this.staffId);
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  getEmployeeProfCert(id: number) {
    this.pageLoading = true;
    this.employeeService.getProfCertByStaffId(id).subscribe(
      (data) => {
        this.pageLoading = false;
        this.employeeProfCert = data.employeeList;
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  onSelectedFile(event: Event, form: FormGroup) {
    this.utilitiesService.uploadFileValidator(event, form, this.staffId);
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
          return this.employeeService.deleteProfCert(payload).subscribe(
            (res) => {
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOSHRM", message, "success").then(() => {
                  this.getEmployeeProfCert(this.staffId);
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
}
