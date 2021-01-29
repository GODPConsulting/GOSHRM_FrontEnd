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

  // Forms
  emmergencyContactForm: FormGroup;
  refereeForm: FormGroup;

  // To hold data for each card
  emmergencyContacts: any;
  employeeReferee: any = {};

  approvalStatus: any = {};
  countries: any[] = [];

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
  ngOnInit() {
    this.getUserData();

    this.initializeForm();
    this.getCountry();

    this.route.paramMap.subscribe((params) => {
      this.employeeId = +params.get("id");
      console.log(this.employeeId);
    });

    this.getSingleEmployee(this.employeeId);

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
  /* Emergency Contact */

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
    });
    $("#emergency_contact_modal").modal("show");
  }

  closeModal() {
    // close the modal
    // 2 re initialise the emergency contact form
    $("#emergency_contact_modal").modal("hide");
    this.initializeForm();
  }
}
