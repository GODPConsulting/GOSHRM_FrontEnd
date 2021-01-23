import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { data } from "jquery";
import { EmployeeService } from "src/app/services/employee.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";
declare const $: any;

@Component({
  selector: "app-employee-profile",
  templateUrl: "./employee-profile.component.html",
  styleUrls: ["./employee-profile.component.css"],
})
export class EmployeeProfileComponent implements OnInit {
  employeeDetails: any = {};
  employeeId: number;
  cardFormTitle: string;
  pageLoading: boolean = false; // controls the visibility of the page loader
  spinner: boolean = false;

  // Forms
  identificationForm: FormGroup;
  emmergencyContactForm: FormGroup;

  // To hold data for each card
  employeeIdentification: any = {};
  emmergencyContacts: any;

  approvalStatus: any = {};
  countries: any[] = [];

  @ViewChild("fileInput")
  fileInput: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private utilitiesService: UtilitiesService
  ) {}

  ngOnInit() {
    this.emmergencyContactForm = this.formBuilder.group({
      id: [0],
      fullName: [""],
      contact_phone_number: [""],
      email: [""],
      relationship: [""],
      address: [""],
      countryId: [0],
      countryName: [""],
      approval_status: [],
      approval_status_name: [""],
      staffId: [""],
    });
    this.getCountry();

    this.route.paramMap.subscribe((params) => {
      this.employeeId = +params.get("id");
      console.log(this.employeeId);
    });

    this.getSingleEmployee(this.employeeId);
    this.getEmployeeIdentification(this.employeeId);
    this.initIdentificationForm();
    this.getSavedEmergencyContact(this.employeeId);
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
    if (Object.keys(this.employeeIdentification).length === 0) {
      console.log(this.employeeIdentification);
      this.cardFormTitle = "Add Identification";
      this.identificationForm = this.formBuilder.group({
        id: [0],
        identification: ["", Validators.required],
        identification_number: ["", Validators.required],
        idIssues: ["", Validators.required],
        idExpiry_date: ["", Validators.required],
        approval_status: ["", Validators.required],
        staffId: this.employeeId,
        identicationFile: ["", Validators.required],
      });
    } else {
      console.log(this.employeeIdentification);

      this.cardFormTitle = "Edit Identification";
      this.identificationForm.patchValue({
        id: [0],
        identification: this.employeeIdentification.identification,
        identification_number: this.employeeIdentification
          .identification_number,
        idIssues: this.employeeIdentification.idIssues,
        idExpiry_date: this.employeeIdentification.idExpiry_date,
        approval_status: this.employeeIdentification.approval_status,
        staffId: this.employeeId,
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
    const formData = new FormData();
    for (const key in form.value) {
      //console.log(key, this.identificationForm.get(key).value);
      formData.append(key, this.identificationForm.get(key).value);
    }

    this.spinner = true;
    return this.employeeService.postIdentification(formData).subscribe(
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
      this.initIdentificationForm();
    });
  }

  onSelectedFile(event: Event, form: FormGroup) {
    this.utilitiesService.patchFile(event, form);
  }

  /* Identification */

  /* Emergency Contact */
  addEmmergencyContact(emmergencyContactForm) {
    const payload = emmergencyContactForm.value;
    payload.staffId = this.employeeId;
    payload.approval_status = +payload.approval_status;
    payload.countryId = +payload.countryId;

    this.pageLoading = true;
    this.employeeService.addEmmergencyContact(payload).subscribe(
      (data) => {
        this.pageLoading = false;
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("Success", message, "success");
          this.getSavedEmergencyContact(this.employeeId);
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
    );
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
        this.emmergencyContacts = data.employeeList[0];
      },
      (err) => {
        console.log(err);
      }
    );
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
