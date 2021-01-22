import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { data } from "jquery";
import { ToastrService } from "ngx-toastr";
import { EmployeeService } from "src/app/services/employee.service";
import swal from "sweetalert2";
declare const $: any;

@Component({
  selector: "app-employee-profile",
  templateUrl: "./employee-profile.component.html",
  styleUrls: ["./employee-profile.component.css"],
})
export class EmployeeProfileComponent implements OnInit {
  employeeDetails: any = {};
  employeeIdentification: any = {};
  identificationForm: FormGroup;
  pageLoading: boolean = false; // controls the visibility of the page loader
  emmergencyContactForm: FormGroup;
  approvalStatus: any = {};
  countries: any[] = [];
  emmergencyContacts: any;

  employeeId: number;
  cardFormTitle: string;

  @ViewChild("fileInput")
  fileInput: ElementRef;
  //public addEmployeeForm: FormGroup;
  spinner: boolean = false;
  //value: any;
  staffId: number;

  constructor(
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute

  ) { }

  ngOnInit() {
    this.emmergencyContactForm = this.formBuilder.group({
      id: [0],
      fullName: [''],
      contact_phone_number: [''],
      email: ["",],
      relationship: [''],
      address: [''],
      countryId: [0],
      countryName: [''],
      approval_status: [],
      approval_status_name: [''],
      staffId: [''],
    })
    this.getCountry();
       /*  this.route.paramMap.subscribe((params) => {
      console.log(+params.get("id"));
      this.staffId = +params.get('id') */

     
    this.route.paramMap.subscribe((params) => {
      this.employeeId = +params.get("id");
      console.log(this.employeeId);
    });
 //this.getSingleEmployee(+params.get("id"));
      this.getSavedEmergencyContact(this.employeeId);
    this.getSingleEmployee(this.employeeId);
    this.getEmployeeIdentification(this.employeeId);
    this.initIdentificationForm();
  }

  onSubmit() {
    this.toastr.success("Bank & statutory added", "Success");
    this.fileInput.nativeElement.value = "";
  }

  /* Employee profile */

  getSingleEmployee(id: number) {
    this.pageLoading = true;
    this.employeeService.getEmployeeById(id).subscribe(
      (data) => {
        //console.log(this.employeeDetails);
        this.employeeDetails = data.staff[0];
        this.pageLoading = false;
        console.log(this.employeeDetails);
      },
      (err) => {
        this.pageLoading = false;
        console.log(err);
      }
    );
  }

  /* Employee profile */

  /* Identification */
  initIdentificationForm() {
    this.cardFormTitle = "Add Identification";
    this.identificationForm = this.formBuilder.group({
      id: [0],
      identification: ["", Validators.required],
      identification_number: ["", Validators.required],
      idIssues: ["", Validators.required],
      idExpiry_date: ["", Validators.required],
      approval_status: ["", Validators.required],
      staffId: [this.employeeId],
      identicationFile: ["", Validators.required],
    });
    if (this.employeeIdentification !== undefined) {
      this.cardFormTitle = "Edit Identification";
      this.identificationForm.patchValue({
        id: [0],
        identification: this.employeeIdentification.identification,
        identification_number: this.employeeIdentification
          .identification_number,
        idIssues: this.employeeIdentification.idIssues,
        idExpiry_date: this.employeeIdentification.idExpiry_date,
        approval_status: this.employeeIdentification.approval_status,
        staffId: [this.employeeId],
        identicationFile: this.employeeIdentification.identicationFile,
      });
    }
  }

  submitIdentificationForm(form: FormGroup) {
    if (!form.valid) {
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    const payload = form.value;
    payload.approval_status = +payload.approval_status;
    console.log(payload);
    this.spinner = true;
    return this.employeeService.postIdentification(payload).subscribe(
      (res) => {
        console.log(res);
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          $("#identification_modal").modal("hide");
        }
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("Error", message, "error");
      }
    );
  }

  getEmployeeIdentification(id: number) {
    this.employeeService.getIdentificationByStaffId(id).subscribe((data) => {
      this.employeeIdentification = data.employeeList[0];
      //console.log(this.employeeIdentification);
    });
  }

  // Appends a selected file to "identicationFile"
  onSelectedFile(event: Event) {
    const file = (<HTMLInputElement>event.target).files[0];
    this.identificationForm.patchValue({
      identicationFile: file,
    });
    //console.log(this.identificationForm.get("identicationFile").value);
  }

  /* Identification */

  /* Emergency Contact */
  addEmmergencyContact(emmergencyContactForm) {
    const payload = emmergencyContactForm.value
    payload.staffId = this.staffId;
    payload.approval_status = +payload.approval_status;
    payload.countryId = +payload.countryId;


    this.pageLoading = true;
    this.employeeService.addEmmergencyContact(payload)
      .subscribe(
        (data) => {
          this.pageLoading = false;
          const message = data.status.message.friendlyMessage;
          if (data.status.isSuccessful) {
            swal.fire("Success", message, "success");
            this.getSavedEmergencyContact(this.staffId);
            $("#emergency_contact_modal").modal("hide");
          } else {
            swal.fire("Error", message, "error");
          }
        },
        (err) => {
          this.pageLoading = false;
          const message = err.status.message.friendlyMessage;
          swal.fire("Error", message, "error");
        }

      )
  }

  getCountry() {
    return this.employeeService.getCountry().subscribe(
      (data) => {
        this.countries = data.commonLookups;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  /* Emergency Contact */
  getSavedEmergencyContact(id) {
    return this.employeeService.getSavedEmergencyContact(id).subscribe(
      (data) => {
        this.emmergencyContacts = data.employeeList[0]
      },
      (err) => {
        console.log(err);
      }


    )
  }
}


/*  uploadReferee() {
  const formData = new FormData();
  formData.append(
    "uploadInput",
    this.employee_profileUploadForm.get("uploadInput").value
  );
  if (!this.file) {
    return swal.fire("Error", "Select a file", "error");
  }
  //console.log(formData, this.languageForm.get("uploadInput").value);
  this.spinner = true;

  return this.setupService
    .updateData("/hrmsetup/upload/language", formData)
    .subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;

        if (res.status.isSuccessful) {
          swal.fire("Success", message, "success");
          this.initializeForm();
          this.fileInput.nativeElement.value = "";
        } else {
          swal.fire("Error", message, "error");
        }
        this.getEmployee_Profile();
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("Error", message, "error");
      }
    );
}
*/

