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

  // Forms
  emergencyContactForm: FormGroup;
  refereeForm: FormGroup;
  languageRatingForm: FormGroup;

  // To hold data for each card
  emergencyContacts: any;
  employeeReferee: any = {};
  languageRating: any[] = [];
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
  ngOnInit() {
    this.getUserData();
    this.initializeForm();
    this.getCountry();
    this.initLaguageRatingForm();
    this.getLanguages();
    this.route.paramMap.subscribe((params) => {
      this.employeeId = +params.get("id");
      console.log(this.employeeId);
    });

    this.getSingleEmployee(this.employeeId);

    this.getSavedEmergencyContact(this.employeeId);
    this.getSavedLanguageRating(this.employeeId);
  }

  /* Employee profile */

  getSingleEmployee(id: number) {
    this.pageLoading = true;
    this.employeeService.getEmployeeById(id).subscribe(
      (data) => {
        //console.log(this.employeeDetails);
        this.employeeDetails = data.employeeList[0];
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

  /* Emergency Contact */
  addEmergencyContact(emergencyContactForm) {
    const payload = emergencyContactForm.value;
    payload.staffId = this.employeeId;
    payload.approval_status = +payload.approval_status;
    payload.countryId = +payload.countryId;

    this.pageLoading = true;
    this.employeeService.addEmergencyContact(payload).subscribe(
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
        this.emergencyContacts = data.employeeList;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  deleteEmergencyContact() {
    let payload: object;
    if (this.selectedId.length === 0) {
      return swal.fire("Error", "Select items to delete", "error");
    } else {
      payload = {
        itemIds: this.selectedId,
      };
      //console.log(this.selectedId);
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
        //console.log(result);

        if (result.value) {
          return this.employeeService.deleteEmergencyContact(payload).subscribe(
            (res) => {
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOSHRM", message, "success").then(() => {
                  this.getSavedEmergencyContact(this.employeeId);
                });
              } else {
                swal.fire("Error", message, "error");
              }
            },
            (err) => {
              console.log(err);
            }
          );
        }
      });
    this.selectedId = [];
  }

  checkAllEmergency(event: Event) {
    if ((<HTMLInputElement>event.target).checked) {
      this.selectedId = this.emergencyContacts.map((item) => {
        return item.id;
      });
    } else {
      this.selectedId = [];
    }
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
    payload.reading_Rating = +payload.reading_Rating;
    payload.writing_Rating = +payload.writing_Rating;
    payload.speaking_Rating = +payload.speaking_Rating;
    payload.languageId = +payload.languageId;
    this.pageLoading = true;
    this.employeeService.addLanguageRating(payload).subscribe(
      (data) => {
        this.pageLoading = false;
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("Success", message, "success");
          this.getSavedLanguageRating(this.employeeId);
          $("#language_rating_modal").modal("hide");
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

  deleteLanguageRating() {
    let payload: object;
    if (this.selectedId.length === 0) {
      return swal.fire("Error", "Select items to delete", "error");
    } else {
      payload = {
        itemIds: this.selectedId,
      };
      //console.log(this.selectedId);
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
        //console.log(result);

        if (result.value) {
          return this.employeeService.deleteLanguageRating(payload).subscribe(
            (res) => {
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOSHRM", message, "success").then(() => {
                  this.getSavedLanguageRating(this.employeeId);
                });
              } else {
                swal.fire("Error", message, "error");
              }
            },
            (err) => {
              console.log(err);
            }
          );
        }
      });
    this.selectedId = [];
  }

  getLanguages() {
    return this.employeeService.getLanguages().subscribe(
      (data) => {
        this.languages = data.setuplist;
        console.log(data);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  // Prevents the edit modal from popping up when checkbox is clicked
  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
  }

  checkAll(event: Event) {
    if ((<HTMLInputElement>event.target).checked) {
      this.selectedId = this.languageRating.map((item) => {
        return item.id;
      });
    } else {
      this.selectedId = [];
    }
  }

  addItemId(event: Event, id: number) {
    if ((<HTMLInputElement>event.target).checked) {
      if (!this.selectedId.includes(id)) {
        this.selectedId.push(id);
      }
    } else {
      this.selectedId = this.selectedId.filter((_id) => {
        return _id !== id;
      });
    }
  }

  // get saved language(s)
  getSavedLanguageRating(id: number) {
    return this.employeeService.getLanguageRatingByStaffId(id).subscribe(
      (data) => {
        this.languageRating = data.employeeList;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  editLanguageRating(language) {
    this.languageRatingForm.patchValue({
      id: language.id,
      languageId: language.languageId,
      language: language.language,
      reading_Rating: language.reading_Rating,
      writing_Rating: language.writing_Rating,
      speaking_Rating: language.speaking_Rating,
      approval_status: language.approval_status,
      approval_status_name: language.approval_status_name,
      staffId: language.staffId,
    });
    $("#language_rating_modal").modal("show");
  }

  closelanguageRatingModal() {
    $("#language_rating_modal").modal("hide");
    this.initLaguageRatingForm();
  }

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
