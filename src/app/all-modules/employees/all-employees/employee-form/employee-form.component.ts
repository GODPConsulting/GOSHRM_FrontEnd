import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SetupService } from "src/app/services/setup.service";
import swal from "sweetalert2";
import { ImageCroppedEvent, base64ToFile } from "ngx-image-cropper";
import { EmployeeService } from "src/app/services/employee.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import { Router } from "@angular/router";
declare const $: any;
@Component({
  selector: "app-employee-form",
  templateUrl: "./employee-form.component.html",
  styleUrls: ["./employee-form.component.css"],
})
export class EmployeeFormComponent implements OnInit {
  @ViewChild("fileInput")
  fileInput: ElementRef;
  imageChangedEvent: any = "";
  croppedImage: any = "";
  EmployeeForm: FormGroup;
  public jobTitles: any[] = [];
  public jobTitleId;
  public countryId: number;
  public countries: any[] = [];
  public jobDetailForm;
  public rows = [];
  public srch = [];
  public states: any[] = [];
  public pageLoading: boolean;
  public departments: any[] = [];
  public roles: any[] = [];
  public access: any[] = [];
  public accessLevel: any[] = [];
  loading: boolean;
  image: any;
  allJobGrades$ = this.setupService.getJobGrades();
  isVisible: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private setupService: SetupService,
    private utilitiesService: UtilitiesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getJobTitle();
    this.getCountry();
    this.getStaffDepartments();
    this.getUserRole();
    this.getAccess();
  }

  initializeForm() {
    this.EmployeeForm = this.formBuilder.group({
      staffId: [0],
      staffCode: [""],
      firstName: [""],
      lastName: [""],
      middleName: [""],
      jobTitle: [""],
      phoneNumber: [""],
      email: [""],
      address: [""],
      dateOfBirth: [""],
      gender: [""],
      stateId: [""],
      countryId: [""],
      staffLimit: [""],
      accessLevel: [""],
      staffOfficeId: [""],
      userName: [""],
      userStatus: [""],
      accessLevelId: [""],
      userAccessLevels: [[]],
      userRoleNames: [[]],
      password: [""],
      photoFile: [""],
      jobGrade: [""],
    });
    // Resets the photo input field of the form
    if (this.fileInput) {
      this.fileInput.nativeElement.value = "";
    }
  }

  /*   // Submits form to HRM and ERP endpoints
  addEmployeeToBoth(form: FormGroup) {
    this.addEmployeeToHrm(form);
    this.addEmployeeToErp(form);
  }

  addEmployeeToErp(EmployeeForm: FormGroup) {
    const payload = EmployeeForm.value;
    payload.jobTitle = +payload.jobTitle;
    payload.stateId = +payload.stateId;
    payload.staffLimit = +payload.staffLimit;
    payload.accessLevel = +payload.accessLevel;
    payload.staffOfficeId = +payload.staffOfficeId;
    payload.accessLevelId = +payload.accessLevelId;
    payload.countryId = +payload.countryId;
    delete payload.jobGrade;
    delete payload.photoFile;

    // validations to check if the form fields have value
    if (!payload.firstName) {
      // if first name is empty string, undefined or null

      return swal.fire("Error", "First Name is required", "error");
    }
    if (!payload.lastName) {
      return swal.fire("Error", "Last Name is required", "error");
    }
    if (!payload.middleName) {
      return swal.fire("Error", "Middle Name is required", "error");
    }
    if (!payload.staffCode) {
      return swal.fire("Error", "Staff Code is required", "error");
    }
    if (!payload.dateOfBirth) {
      return swal.fire("Error", "Date Of Birth is required", "error");
    }
    if (!payload.gender) {
      return swal.fire("Error", "Gender is required", "error");
    }
    if (!payload.jobTitle) {
      return swal.fire("Error", "Job Title is required", "error");
    }
    if (!payload.email) {
      return swal.fire("Error", "Email is required", "error");
    }
    if (!payload.countryId) {
      return swal.fire("Error", "Country is required", "error");
    }
    if (!payload.stateId) {
      return swal.fire("Error", "State is required", "error");
    }
    if (!payload.staffOfficeId) {
      return swal.fire("Error", "Office/Department is required", "error");
    }
    if (!payload.staffLimit) {
      return swal.fire("Error", "Staff Limit is required", "error");
    }
    if (!payload.address) {
      return swal.fire("Error", "Address is required", "error");
    }
    if (!payload.phoneNumber) {
      return swal.fire("Error", "Phone Number is required", "error");
    }
    if (!payload.userName) {
      return swal.fire("Error", "User Name is required", "error");
    }
    if (!payload.password) {
      return swal.fire("Error", "Password is required", "error");
    }
    if (!payload.userRoleNames) {
      return swal.fire("Error", "User Role is required", "error");
    }
    if (!payload.userStatus) {
      return swal.fire("Error", "Status is required", "error");
    }
    if (!payload.accessLevelId) {
      return swal.fire("Error", "Access is required", "error");
    }
    if (!payload.userAccessLevels) {
      return swal.fire("Error", "Access Level is required", "error");
    }

    this.loading = true;
    return this.setupService
      .updateData("/admin/add/update/staff", payload)
      .subscribe(
        (res) => {
          this.loading = false;
          const message = res.status.message.friendlyMessage;

          if (res.status.isSuccessful) {
            swal.fire("Success", message, "success");
            this.initializeForm();
            // $("#add_employee_form").modal("hide");
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
 */

  addEmployeeToHrm(EmployeeForm: FormGroup) {
    let payload = EmployeeForm.value;
    console.log(payload);

    // validations to check if the form fields have value
    if (!payload.firstName) {
      // if first name is empty string, undefined or null

      return swal.fire("Error", "First Name is required", "error");
    }
    if (!payload.lastName) {
      return swal.fire("Error", "Last Name is required", "error");
    }
    if (!payload.middleName) {
      return swal.fire("Error", "Middle Name is required", "error");
    }
    if (!payload.staffCode) {
      return swal.fire("Error", "Staff Code is required", "error");
    }
    if (!payload.dateOfBirth) {
      return swal.fire("Error", "Date Of Birth is required", "error");
    }
    if (!payload.gender) {
      return swal.fire("Error", "Gender is required", "error");
    }
    if (!payload.jobTitle) {
      return swal.fire("Error", "Job Title is required", "error");
    }
    if (!payload.email) {
      return swal.fire("Error", "Email is required", "error");
    }
    if (!payload.countryId) {
      return swal.fire("Error", "Country is required", "error");
    }
    if (!payload.stateId) {
      return swal.fire("Error", "State is required", "error");
    }
    if (!payload.staffOfficeId) {
      return swal.fire("Error", "Office/Department is required", "error");
    }
    if (!payload.staffLimit) {
      return swal.fire("Error", "Staff Limit is required", "error");
    }
    if (!payload.address) {
      return swal.fire("Error", "Address is required", "error");
    }
    if (!payload.phoneNumber) {
      return swal.fire("Error", "Phone Number is required", "error");
    }
    if (!payload.userName) {
      return swal.fire("Error", "User Name is required", "error");
    }
    if (!payload.password) {
      return swal.fire("Error", "Password is required", "error");
    }
    if (!payload.userRoleNames) {
      return swal.fire("Error", "User Role is required", "error");
    }
    if (!payload.userStatus) {
      return swal.fire("Error", "Status is required", "error");
    }
    if (!payload.accessLevelId) {
      return swal.fire("Error", "Access is required", "error");
    }
    if (!payload.userAccessLevels) {
      return swal.fire("Error", "Access Level is required", "error");
    }

    EmployeeForm.get("dateOfBirth").setValue(
      new Date(EmployeeForm.get("dateOfBirth").value).toLocaleDateString(
        "en-CA"
      )
    );
    let formData = new FormData();
    for (const key in EmployeeForm.value) {
      formData.append(key, EmployeeForm.get(key).value);
    }
    formData.append("dateOfJoin", new Date().toLocaleDateString("en-CA"));
    formData.set("countryId", "403");
    formData.set("stateId", "26");
    formData.set("accessLevel", "1");

    this.loading = true;
    return this.setupService
      .updateData("/hrm/add/update/staff", formData)
      .subscribe(
        (res) => {
          this.loading = false;
          const message = res.status.message.friendlyMessage;

          if (res.status.isSuccessful) {
            swal.fire("Success", message, "success");
            this.initializeForm();
            this.router.navigateByUrl("employees/employeeviews");
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

  getJobTitle() {
    this.pageLoading = true;
    return this.setupService.getJobTitle().subscribe(
      (data) => {
        this.pageLoading = false;

        this.jobTitles = data.setuplist;
      },
      (err) => {
        this.pageLoading = false;
      }
    );
  }

  getCountry() {
    this.pageLoading = true;
    return this.setupService.getData("/common/countries").subscribe(
      (data) => {
        this.pageLoading = false;
        this.countries = data.commonLookups;
      },
      (err) => {
        this.pageLoading = false;
      }
    );
  }

  getStatesByCountryId(id) {
    this.pageLoading = true;
    return this.setupService
      .getData(`/common/get/states/countryId?CountryId=${id}`)
      .subscribe(
        (data) => {
          this.pageLoading = false;
          this.states = data.commonLookups;
        },
        (err) => {
          this.pageLoading = false;
        }
      );
  }
  getStaffDepartments() {
    this.pageLoading = true;
    return this.setupService
      .getData("/company/get/all/companystructures")
      .subscribe(
        (data) => {
          this.pageLoading = false;
          this.departments = data.companyStructures;
        },
        (err) => {
          this.pageLoading = false;
        }
      );
  }

  getUserRole() {
    this.pageLoading = true;
    return this.setupService.getData("/admin/get/all/role").subscribe(
      (data) => {
        this.pageLoading = false;
        this.roles = data.roles;
      },
      (err) => {
        this.pageLoading = false;
      }
    );
  }

  getAccess() {
    this.pageLoading = true;
    return this.setupService
      .getData("/company/get/all/companystructureDefinition")
      .subscribe(
        (data) => {
          this.pageLoading = false;
          this.access = data.companyStructureDefinitions;
        },
        (err) => {
          this.pageLoading = false;
        }
      );
  }

  getAccessLevelsByAccessLevelId(id) {
    this.pageLoading = true;
    return this.setupService
      .getData(`/company/get/all/companystructure/accessId?AccessId=${id}`)
      .subscribe(
        (data) => {
          this.pageLoading = false;
          this.accessLevel = data.companyStructures;
        },
        (err) => {
          this.pageLoading = false;
        }
      );
  }

  clearPhoto() {
    this.isVisible = false;
    this.EmployeeForm.get("photoFile").setValue("");
    // Resets the photo input field of the form
    if (this.fileInput) {
      this.fileInput.nativeElement.value = "";
    }
  }

  fileChangeEvent(event: any): void {
    this.isVisible = true;
    this.imageChangedEvent = event;
    this.utilitiesService.uploadFileValidator(event, this.EmployeeForm);

    if (
      this.utilitiesService.uploadFileValidator(event, this.EmployeeForm) ===
      "file valid"
    ) {
      $("#crop_photo_modal").modal("show");
    } else {
      $("#crop_photo_modal").modal("hide");
    }
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.image = this.base64ToFile(
      event.base64,
      this.imageChangedEvent.target.files[0].name
    );

    // Appends profile photo to form
    this.EmployeeForm.patchValue({
      photoFile: this.image,
    });
    return this.image;
  }
  imageLoaded() {
    // this.image = this.croppedImage.image
    // show cropper image: HTMLImageElement
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }
  base64ToFile(data, filename) {
    const arr = data.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }
  uploadImage() {}
}
