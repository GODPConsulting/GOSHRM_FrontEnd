import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { data } from "jquery";
import { EmployeeService } from "src/app/services/employee.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";
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
  public selectedId: number[] = [];
  fileToUpload: File;

  // Forms
  emergencyContactForm: FormGroup;
  languageRatingForm: FormGroup;
  employeeQualificationForm: FormGroup;

  // To hold data for each card
  emergencyContacts: any = [];
  languageRating: any[] = [];
  employeeQualification: any[] = [];
  approvalStatus: any = {};
  countries: any[] = [];
  languages: any[] = [];
  grades: any[] = [];

  @ViewChild("fileInput")
  fileInput: ElementRef;
  readingRating: number;
  writingRating: number;
  speakingRating: number;
  loading: boolean;
  selectedEmergencyId: number[] = [];
  selectedLanguageId: number[] = [];
  selectedQualificationId: number[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private utilitiesService: UtilitiesService,
    private authService: AuthService
  ) {}
  initializeForm() {
    this.emergencyContactForm = this.formBuilder.group({
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
  initLaguageRatingForm() {
    this.languageRatingForm = this.formBuilder.group({
      id: [0],
      languageId: [0],
      language: [""],
      reading_Rating: [0],
      writing_Rating: [0],
      speaking_Rating: [0],
      approval_status: [],
      approval_status_name: [""],
      staffId: [""],
    });
  }

  initEmployeeQualificationForm() {
    this.employeeQualificationForm = this.formBuilder.group({
      id: [0],
      certificate: [""],
      institution: [""],
      startDate: [""],
      endDate: [""],
      gradeId: [""],
      approvalStatus: 2,
      staffId: this.employeeId,
      qualificationFile: [""],
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.employeeId = +params.get("id");
    });
    this.getUserData();
    this.initializeForm();
    this.getCountry();
    this.initLaguageRatingForm();
    this.getLanguages();
    this.initEmployeeQualificationForm();
    this.getGrades();
    this.getSingleEmployee(this.employeeId);
    this.getSavedEmergencyContact(this.employeeId);
    this.getSavedLanguageRating(this.employeeId);
    this.getSavedEmployeeQualification(this.employeeId);
  }

  /* Employee profile */

  getSingleEmployee(id: number) {
    this.pageLoading = true;
    this.employeeService.getEmployeeById(id).subscribe(
      (data) => {
        this.employeeDetails = data.employeeList[0];
        console.log(this.employeeDetails);
        this.pageLoading = false;
      },
      (err) => {
        this.pageLoading = false;
      }
    );
  }

  /* Employee profile */

  /* Emergency Contact */
  addEmergencyContact(emergencyContactForm) {
    const payload = emergencyContactForm.value;
    payload.staffId = this.employeeId;
    payload.approval_status = +payload.approval_status;
    payload.countryId = +payload.countryId;

    //this.pageLoading = true;
    this.loading = true;
    this.employeeService.addEmergencyContact(payload).subscribe(
      (data) => {
        //this.pageLoading = false;
        this.loading = false;
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("Success", message, "success");
          this.getSavedEmergencyContact(this.employeeId);
          $("#emergency_contact_modal").modal("hide");
        } else {
          swal.fire("GOSHRM", message, "error");
        }
      },
      (err) => {
        this.loading = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  getCountry() {
    return this.utilitiesService.getCountry().subscribe(
      (data) => {
        this.countries = data.commonLookups;
      },
      (err) => {}
    );
  }

  getSavedEmergencyContact(id: number) {
    return this.employeeService.getEmergencyContactByStaffId(id).subscribe(
      (data) => {
        this.emergencyContacts = data.employeeList;
      },
      (err) => {}
    );
  }

  deleteEmergencyContact() {
    let payload: object;
    if (this.selectedEmergencyId.length === 0) {
      return swal.fire("Error", "Select items to delete", "error");
    } else {
      payload = {
        itemIds: this.selectedEmergencyId,
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
          return this.employeeService.deleteEmergencyContact(payload).subscribe(
            (res) => {
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOSHRM", message, "success").then(() => {
                  this.getSavedEmergencyContact(this.employeeId);
                });
              } else {
                swal.fire("GOSHRM", message, "error");
              }
            },
            (err) => {}
          );
        }
      });
    this.selectedEmergencyId = [];
  }

  checkAllEmergency(event: Event) {
    this.selectedEmergencyId = this.utilitiesService.checkAllBoxes(
      event,
      this.emergencyContacts
    );
  }

  editEmergencyContact(item) {
    this.emergencyContactForm.patchValue({
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
    });
    $("#emergency_contact_modal").modal("show");
  }

  closeModal() {
    $("#emergency_contact_modal").modal("hide");
    this.initializeForm();
  }
  /* Emergency Contact */

  /* Language */
  addLanguageRating(languageRatingForm) {
    const payload = languageRatingForm.value;
    payload.staffId = this.employeeId;
    payload.approval_status = +payload.approval_status;
    payload.reading_Rating = this.readingRating;
    payload.writing_Rating = this.writingRating;
    payload.speaking_Rating = this.speakingRating;
    payload.languageId = +payload.languageId;
    this.loading = true;
    this.employeeService.addLanguageRating(payload).subscribe(
      (data) => {
        this.loading = false;
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("Success", message, "success");
          this.initLaguageRatingForm();
          this.readingRating = 0;
          this.writingRating = 0;
          this.speakingRating = 0;
          this.getSavedLanguageRating(this.employeeId);
          $("#language_rating_modal").modal("hide");
        } else {
          swal.fire("GOSHRM", message, "error");
        }
      },
      (err) => {
        this.loading = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  deleteLanguageRating() {
    let payload: object;
    if (this.selectedLanguageId.length === 0) {
      return swal.fire("Error", "Select items to delete", "error");
    } else {
      payload = {
        itemIds: this.selectedLanguageId,
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
          return this.employeeService.deleteLanguageRating(payload).subscribe(
            (res) => {
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOSHRM", message, "success").then(() => {
                  this.getSavedLanguageRating(this.employeeId);
                });
              } else {
                swal.fire("GOSHRM", message, "error");
              }
            },
            (err) => {}
          );
        }
      });
    this.selectedLanguageId = [];
  }

  getLanguages() {
    return this.employeeService.getLanguages().subscribe(
      (data) => {
        this.languages = data.setuplist;
      },
      (err) => {}
    );
  }
  // Prevents the edit modal from popping up when checkbox is clicked
  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
  }

  checkAllLanguage(event: Event) {
    this.selectedLanguageId = this.utilitiesService.checkAllBoxes(
      event,
      this.languageRating
    );
  }

  addItemId(event: Event, id: number, idsArray: number[]) {
    this.utilitiesService.deleteArray(event, id, idsArray);
  }

  // get saved language(s)
  getSavedLanguageRating(id: number) {
    return this.employeeService.getLanguageRatingByStaffId(id).subscribe(
      (data) => {
        this.languageRating = data.employeeList;
      },
      (err) => {}
    );
  }

  editLanguageRating(language) {
    this.languageRatingForm.patchValue({
      id: language.id,
      languageId: language.languageId,
      language: language.language,
      // reading_Rating: language.reading_Rating,
      // writing_Rating: language.writing_Rating,
      // speaking_Rating: language.speaking_Rating,
      approval_status: language.approval_status,
      approval_status_name: language.approval_status_name,
      staffId: language.staffId,
    });
    this.readingRating = language.reading_Rating;
    this.writingRating = language.writing_Rating;
    this.speakingRating = language.speaking_Rating;
    $("#language_rating_modal").modal("show");
  }

  closelanguageRatingModal() {
    $("#language_rating_modal").modal("hide");
    this.initLaguageRatingForm();
    this.readingRating = 0;
    this.writingRating = 0;
    this.speakingRating = 0;
  }
  onSelectedFile(event: Event, form: FormGroup) {
    this.utilitiesService.patchFile(event, form);
  }

  getUserData() {
    this.authService.getProfile().subscribe((data) => {
      this.currentUser = data.roles;
      this.currentUserId = data.staffId;
    });
  }
  getReadingRate(event: number) {
    this.readingRating = event;
  }

  getSpeakingRate(event: number) {
    this.speakingRating = event;
  }

  getWritingRate(event: number) {
    this.writingRating = event;
  }
  handleFile(event) {
    this.fileToUpload = event.target.files[0];
  }
  // EmployeeQualification
  addEmployeeQualification(employeeQualificationForm) {
    const payload = employeeQualificationForm.value;
    if (!payload.certificate) {
      return swal.fire("Error!", " Certificate is empty", "error");
    }
    if (!payload.institution) {
      return swal.fire("Error!", "Institution is empty", "error");
    }
    if (!payload.startDate) {
      return swal.fire("Error!", "Start Date is empty", "error");
    }
    if (!payload.endDate) {
      return swal.fire("Error!", "End Date is empty", "error");
    }
    if (!payload.gradeId) {
      return swal.fire("Error!", "Grade is empty", "error");
    }
    if (!this.fileToUpload) {
      return swal.fire("Error!", "Select a file", "error");
    }
    if (!payload.approvalStatus) {
      return swal.fire("Error!", "Select a status", "error");
    }
    this.spinner = true;
    this.employeeService
      .addEmployeeQualification(payload, this.fileToUpload)
      .then((data) => {
        this.spinner = false;
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("Success", message, "success").then(() => {
            this.getSavedEmployeeQualification(this.employeeId);
            this.closeEmployeeQualificationModal();
          });
        } else {
          swal.fire("GOSHRM", message, "error");
        }
      })
      .catch((err) => {
        this.spinner = false;

        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      });
  }

  getSavedEmployeeQualification(id: number) {
    return this.employeeService.getEmployeeQualificationByStaffId(id).subscribe(
      (data) => {
        this.employeeQualification = data.employeeList;
      },
      (err) => {}
    );
  }

  getGrades() {
    return this.employeeService.getGrades().subscribe(
      (data) => {
        this.grades = data.setuplist;
      },
      (err) => {}
    );
  }

  editEmployeeQualification(qualification) {
    this.employeeQualificationForm.patchValue({
      id: qualification.id,
      certificate: qualification.certificate,
      institution: qualification.institution,
      startDate: qualification.startDate,
      enddate: qualification.enddate,
      gradeId: qualification.gradeId,
      approvalStatus: qualification.countryId,
      staffId: qualification.staffId,
      qualificationFile: qualification.qualificationFile,
    });
    $("#employee_qualification_modal").modal("show");
  }

  closeEmployeeQualificationModal() {
    $("#employee_qualification_modal").modal("hide");
    this.initEmployeeQualificationForm();
  }

  checkAllQualification(event: Event) {
    this.selectedQualificationId = this.utilitiesService.checkAllBoxes(
      event,
      this.employeeQualification
    );
  }

  deleteEmployeeQualification() {
    let payload: object;
    if (this.selectedQualificationId.length === 0) {
      return swal.fire("Error", "Select items to delete", "error");
    } else {
      payload = {
        itemIds: this.selectedQualificationId,
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
          return this.employeeService
            .deleteEmployeeQualification(payload)
            .subscribe(
              (res) => {
                const message = res.status.message.friendlyMessage;
                if (res.status.isSuccessful) {
                  swal.fire("GOSHRM", message, "success").then(() => {
                    this.getSavedEmployeeQualification(this.employeeId);
                  });
                } else {
                  swal.fire("GOSHRM", message, "error");
                }
              },
              (err) => {}
            );
        }
      });
    this.selectedQualificationId = [];
  }
}
