import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { data } from "jquery";
import { EmployeeService } from "src/app/services/employee.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";
import { isEmpty } from "lodash";
import { AuthService } from "src/app/services/auth.service";
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
  currentUser: string[] = []; // contains the data of the current user
  currentUserId: number;

  // Forms
  identificationForm: FormGroup;
  emmergencyContactForm: FormGroup;
  refereeForm: FormGroup;
  languageForm: FormGroup;

  // To hold data for each card
  employeeIdentification: any = {};
  emmergencyContacts: any;
  employeeReferee: any = {};
  languagerating: any;
  approvalStatus: any = {};
  countries: any[] = [];
  languages: any[] = [];

  @ViewChild("fileInput")
  fileInput: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private utilitiesService: UtilitiesService,
    private authService: AuthService
  ) { }
  initializeForm() {
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
  }
  initLaguageForm() {
    this.languageForm = this.formBuilder.group({
      id: [0],
      languageId: [0],
      language: [""],
      reading_Rating: [0],
      writing_Rating: [0],
      speaking_Rating: [0],
      approval_status: [],
      approval_status_name: [""],
      staffId: [""],
    })
  }
  ngOnInit() {
    this.getUserData();
    this.initializeForm();
    this.getCountry();
    this.initLaguageForm();
    this.getLanguages();
    this.route.paramMap.subscribe((params) => {
      this.employeeId = +params.get("id");
      console.log(this.employeeId);
    });

    this.getSingleEmployee(this.employeeId);
    this.getEmployeeIdentification(this.employeeId);
    this.initIdentificationForm();
    this.getSavedEmergencyContact(this.employeeId);
    this.getEmployeeReferee(this.employeeId);
    this.initRefereeForm();
    this.getSavedLanguages(this.employeeId);
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
    if (isEmpty(this.employeeIdentification)) {
      console.log("empty", this.employeeIdentification);
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
      console.log(data.employeeList[0]);

      if (data.employeeList[0]) {
        this.employeeIdentification = data.employeeList[0];
      }
      //console.log(this.employeeIdentification);
      this.initIdentificationForm();
    });
  }

  /* Identification */
  /* Language */
  addLanguage(languageForm) {
    const payload = languageForm.value;
    payload.staffId = this.employeeId;
    payload.approval_status = +payload.approval_status;
    payload.reading_Rating = +payload.reading_Rating;
    payload.writing_Rating = +payload.writing_Rating;
    payload.speaking_Rating = +payload.speaking_Rating;
    payload.languageId = +payload.languageId;
    this.pageLoading = true;
    this.employeeService.addLanguage(payload).subscribe(
      (data) => {

        this.pageLoading = false;
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("Success", message, "success");
          this.getSavedLanguages(this.employeeId);
          $("#language_modal").modal("hide");
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
  getLanguages() {
    return this.employeeService.getLanguages().subscribe(
      (data) => {
        this.languages = data.setuplist;
        console.log(data)
      },
      (err) => {
        console.log(err);
      }
    );
  }

  // get saved language(s)
  getSavedLanguages(id: number) {
    return this.employeeService.getlanguageByStaffId(id).subscribe(
      (data) => {
        this.languagerating = data.employeeList;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  editLanguageRating(language) {
    this.languageForm.patchValue({
      id: language.id,
      languageId: language.languageId,
      language: language.language,
      reading_Rating: language.reading_Rating,
      writing_Rating: language.writing_Rating,
      speaking_Rating: language.speaking_Rating,
      approval_status: language.approval_status,
      approval_status_name: language.approval_status_name,
      staffId: language.staffId,
    })
    $("#language_modal").modal("show");
  }

  closelanguageModal() {
    $("#language_modal").modal("hide");
    this.initLaguageForm()
  }

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
    return this.utilitiesService.getCountry().subscribe(
      (data) => {
        this.countries = data.commonLookups;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getSavedEmergencyContact(id: number) {
    return this.employeeService.getEmergencyContactByStaffId(id).subscribe(
      (data) => {


        this.emmergencyContacts = data.employeeList;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  editContact(item) {
    this.emmergencyContactForm.patchValue({
      id: item.id,
      fullName: item.fullName,
      contact_phone_number: item.contact_phone_number,
      email: item.email,
      relationship: item.relationship,
      address: item.address,
      countryId: item.countryId,
      countryName: item.countryName,
      approval_status: item.approval_status,
      approval_status_name: item.approval_status_name,
      staffId: item.staffId,
    })
    $("#emergency_contact_modal").modal("show");
  }

  closeModal() {
    // close the modal
    // 2 re initialise the emergency contact form
    $("#emergency_contact_modal").modal("hide");
    this.initializeForm()


  }
  /* Emergency Contact */

  /* Referees */

  initRefereeForm() {
    if (isEmpty(this.employeeReferee)) {
      console.log("empty", this.employeeReferee);
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
        approvalStatus: ["", Validators.required],
        staffId: this.employeeId,
        refereeFile: ["", Validators.required],
      });
    } else {
      console.log(this.employeeReferee);

      this.cardFormTitle = "Edit Referee";
      this.refereeForm.patchValue({
        id: [0],
        fullName: this.employeeReferee.fullName,
        phoneNumber: this.employeeReferee.phoneNumber,
        email: this.employeeReferee.email,
        relationship: this.employeeReferee.relationship,
        numberOfYears: this.employeeReferee.numberOfYears,
        organization: this.employeeReferee.organization,
        address: this.employeeReferee.address,
        confirmationReceived: this.employeeReferee.confirmationReceived,
        confirmationDate: this.employeeReferee.confirmationDate,
        approvalStatus: this.employeeReferee.approvalStatus,
        staffId: this.employeeId,
        refereeFile: this.employeeReferee.refereeFile,
      });
    }
  }

  submitRefereeForm(form: FormGroup) {
    if (!form.valid) {
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    const payload = form.value;
    console.log(payload);

    payload.approvalStatus = +payload.approvalStatus;
    payload.numberOfYears = +payload.numberOfYears;
    const formData = new FormData();
    for (const key in form.value) {
      //console.log(key, this.identificationForm.get(key).value);
      formData.append(key, this.refereeForm.get(key).value);
    }
    this.spinner = true;
    return this.employeeService.postReferee(formData).subscribe(
      (res) => {
        console.log(res);
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          $("#referee_modal").modal("hide");
        }
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("Error", message, "error");
      }
    );
  }

  getEmployeeReferee(id: number) {
    this.employeeService.getRefereeByStaffId(id).subscribe((data) => {
      if (data.employeeList[0]) {
        this.employeeReferee = data.employeeList[0];
      }
      //console.log(this.employeeIdentification);
      this.initRefereeForm();
    });
  }

  /* Referees */

  onSelectedFile(event: Event, form: FormGroup) {
    this.utilitiesService.patchFile(event, form);
  }

  getUserData() {
    this.authService.getProfile().subscribe((data) => {
      console.log(data);
      this.currentUser = data.roles;
      this.currentUserId = data.staffId;
    });
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
