import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { data } from "jquery";
import { EmployeeService } from "src/app/services/employee.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";
import { AuthService } from "src/app/services/auth.service";
import { SetupService } from "src/app/services/setup.service";
import { Subscription } from "rxjs";
import { DataService } from "src/app/services/data.service";
import { LoadingService } from "../../../../services/loading.service";
import { CommonService } from "../../../../services/common.service";
import { JwtService } from "../../../../services/jwt.service";
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
  qualification: any[] = [];

  @ViewChild("fileInput")
  fileInput: ElementRef;
  readingRating: number;
  writingRating: number;
  speakingRating: number;
  loading: boolean;
  selectedEmergencyId: number[] = [];
  selectedLanguageId: number[] = [];
  selectedQualificationId: number[] = [];
  navigationSubscription: Subscription;
  dataToChild: any = {};
  isHr: string;
  activeIndex: number = 0;
  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private utilitiesService: UtilitiesService,
    private authService: AuthService,
    private setupService: SetupService,
    private router: Router,
    private dataService: DataService,
    private loadingService: LoadingService,
    private commonService: CommonService,
    private jwtService: JwtService
  ) {
    // Handles route reloading...solves view not changing when user navigates to his/her own profile from another user's profile route
    this.navigationSubscription = this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.initInvites();
      }
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((param) => {
      console.log(param);
      this.employeeId = +param.employeeId;
      this.isHr = param.isHr;
    });
    console.log(this.isHr);
    // Get access to the user data shared from sidebar
    this.jwtService.getHrmUserDetails().then((user) => {
      this.dataToChild.user = user;
      this.dataToChild.isHr = this.dataToChild.user?.userRoleNames.includes(
        "HR Admin"
      );
      this.dataToChild.canSeeProfileElement =
        this.dataToChild.user?.userRoleNames.includes("HR Admin") ||
        this.dataToChild.user?.staffId === this.employeeId;
    });
    // this.dataService.currentUser.subscribe((result) => {
    //   console.log(result);
    //   this.dataToChild.user = result;
    //   this.dataToChild.isHr = this.dataToChild.user?.userRoleNames.includes(
    //     "HR Admin"
    //   );
    //   this.dataToChild.canSeeProfileElement =
    //     this.dataToChild.user?.userRoleNames.includes("HR Admin") ||
    //     this.dataToChild.user?.staffId === this.employeeId;
    // });
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
    this.getAcademicQualification();
  }

  initializeForm() {
    this.emergencyContactForm = this.formBuilder.group({
      id: [0],
      fullName: [""],
      contact_phone_number: [""],
      email: [""],
      relationship: [""],
      address: [""],
      countryId: [""],
      countryName: [""],
      approval_status: [{ value: "2", disabled: this.isHr !== "true" }],
      staffId: this.employeeId,
    });
  }
  initLaguageRatingForm() {
    this.languageRatingForm = this.formBuilder.group({
      id: [0],
      languageId: [""],
      reading_Rating: [""],
      writing_Rating: [""],
      speaking_Rating: [""],
      approval_status: [{ value: "2", disabled: this.isHr !== "true" }],
      staffId: this.employeeId,
    });
  }

  initEmployeeQualificationForm() {
    this.employeeQualificationForm = this.formBuilder.group({
      id: [0],
      qualificationId: [""],
      institution: [""],
      startDate: [""],
      endDate: [""],
      gradeId: [""],
      approval_status: [{ value: "2", disabled: this.isHr !== "true" }],
      staffId: this.employeeId,
      qualificationFile: [""],
    });
  }

  /* Employee profile */
  getSingleEmployee(id: number) {
    this.loadingService.show();
    this.employeeService.getEmployeeById(id).subscribe(
      (data) => {
        this.employeeDetails = data.employeeList[0];

        this.loadingService.hide();
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  /* Employee profile */

  /* Emergency Contact */
  addEmergencyContact(form: FormGroup) {
    // Send mail to HR
    const payload = form.value;
    payload.staffId = this.employeeId;
    if (this.isHr !== "true") {
      payload.approval_status = 2;
    }
    payload.approval_status = +payload.approval_status;
    payload.countryId = +payload.countryId;
    // console.log(payload);
    // return;
    if (!payload.fullName) {
      return swal.fire("Error", "Full Name is empty", "error");
    }
    if (!payload.relationship) {
      return swal.fire("Error", "Relationship is empty", "error");
    }
    if (!payload.contact_phone_number) {
      return swal.fire("Error", "Contact's Phone Number is empty", "error");
    }
    if (!payload.email) {
      return swal.fire("Error", "email is empty", "error");
    }
    if (!this.utilitiesService.validateEmail(payload.email)) {
      return swal.fire("Error", "Email not valid", "error");
    }
    if (!payload.countryId) {
      return swal.fire("Error", "Country is empty", "error");
    }
    if (!payload.address) {
      return swal.fire("Error", "Address is empty", "error");
    }

    this.loading = true;
    this.employeeService.addEmergencyContact(payload).subscribe(
      (data) => {
        this.loading = false;
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("Success", message, "success").then(() => {
            if (!this.dataToChild.isHr) {
              this.utilitiesService
                .sendToHr(
                  "Add Emergency Contact",
                  this.dataToChild.user.firstName,
                  this.dataToChild.user.lastName,
                  this.dataToChild.user.email,
                  this.dataToChild.user.userId
                )
                .subscribe();
            }
            this.getSavedEmergencyContact(this.employeeId);
            $("#emergency_contact_modal").modal("hide");
          });
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
    return this.commonService.getCountries().subscribe(
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
          this.loadingService.show();
          return this.employeeService.deleteEmergencyContact(payload).subscribe(
            (res) => {
              this.loadingService.hide();
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOSHRM", message, "success").then(() => {
                  this.getSavedEmergencyContact(this.employeeId);
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
  addLanguageRating(form: FormGroup) {
    if (!form.valid) {
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    const payload = form.value;
    if (this.isHr !== "true") {
      payload.approval_status = 2;
    }
    payload.approval_status = +payload.approval_status;
    payload.staffId = this.employeeId;
    payload.reading_Rating = this.readingRating;
    payload.writing_Rating = this.writingRating;
    payload.speaking_Rating = this.speakingRating;
    payload.languageId = +payload.languageId;

    if (!payload.languageId) {
      return swal.fire("Error", "Language is empty", "error");
    }
    if (!payload.reading_Rating) {
      return swal.fire("Error", "Reading Rating is empty", "error");
    }
    if (!payload.writing_Rating) {
      return swal.fire("Error", "Writing Rating is empty", "error");
    }
    if (!payload.speaking_Rating) {
      return swal.fire("Error", "speaking Rating is empty", "error");
    }
    if (!payload.approval_status) {
      return swal.fire("Error", "Approval Status is empty", "error");
    }
    // form.get("approval_status").disable();

    this.loading = true;
    this.employeeService.addLanguageRating(payload).subscribe(
      (data) => {
        this.loading = false;
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("Success", message, "success").then(() => {
            // Send mail to HR
            if (!this.dataToChild.isHr) {
              this.utilitiesService
                .sendToHr(
                  "Add Language",
                  this.dataToChild.user.firstName,
                  this.dataToChild.user.lastName,
                  this.dataToChild.user.email,
                  this.dataToChild.user.userId
                )
                .subscribe();
              // if (form.get("approval_status").value !== 2) {
              //   form.get("approval_status").setValue(2);
              // }
            }
            this.initLaguageRatingForm();
            this.readingRating = 0;
            this.writingRating = 0;
            this.speakingRating = 0;
            this.getSavedLanguageRating(this.employeeId);
            $("#language_rating_modal").modal("hide");
          });
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
          this.loadingService.show();
          return this.employeeService.deleteLanguageRating(payload).subscribe(
            (res) => {
              this.loadingService.hide();
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOSHRM", message, "success").then(() => {
                  this.getSavedLanguageRating(this.employeeId);
                });
              } else {
                return swal.fire("GOSHRM", message, "error");
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
    this.loadingService.show();
    return this.employeeService.getLanguageRatingByStaffId(id).subscribe(
      (data) => {
        this.loadingService.hide();
        this.languageRating = data.employeeList;
      },
      (err) => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
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
    this.utilitiesService.uploadFileValidator(event, form, this.employeeId);
  }

  getUserData() {
    //refactor this and use data service
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
  addEmployeeQualification(form: FormGroup) {
    // Send mail to HR
    if (!this.dataToChild.isHr) {
      this.utilitiesService
        .sendToHr(
          "Add Qualification",
          this.dataToChild.user.firstName,
          this.dataToChild.user.lastName,
          this.dataToChild.user.email,
          this.dataToChild.user.userId
        )
        .subscribe();
    }
    const payload = form.value;
    if (this.isHr !== "true") {
      payload.approval_status = 2;
    }
    if (!payload.qualificationId) {
      return swal.fire("Error!", "Select Qualification", "error");
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
    // if (!payload.approvalStatus) {
    //   return swal.fire("Error!", "Select a status", "error");
    // }
    // form.get("approvalStatus").disable();
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
        const error = JSON.parse(err);
        const message = error.status.message.friendlyMessage;
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

  getAcademicQualification() {
    return this.setupService.getAcademicQualification().subscribe(
      (data) => {
        this.qualification = data.setuplist;
      },
      (err) => {}
    );
  }

  editEmployeeQualification(qualification) {
    this.employeeQualificationForm.patchValue({
      id: qualification.id,
      QualificationId: qualification.qualificationId,
      institution: qualification.institution,
      startDate: qualification.startDate,
      enddate: qualification.enddate,
      gradeId: qualification.gradeId,
      approvalStatus: qualification.approvalStatus,
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
          this.loadingService.show();
          return this.employeeService
            .deleteEmployeeQualification(payload)
            .subscribe(
              (res) => {
                this.loadingService.hide();
                const message = res.status.message.friendlyMessage;
                if (res.status.isSuccessful) {
                  swal.fire("GOSHRM", message, "success").then(() => {
                    this.getSavedEmployeeQualification(this.employeeId);
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
    this.selectedQualificationId = [];
  }

  /* Handles Route reloading */
  initInvites() {
    this.ngOnInit();
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
  /* Handles Route reloading */
  editProfile() {
    this.router.navigate(["/employees/employee-form"], {
      queryParams: {
        id: this.employeeId,
      },
    });
  }

  downloadFile() {}

  tabChange(event: any) {
    this.activeIndex = event.index;
  }
}
