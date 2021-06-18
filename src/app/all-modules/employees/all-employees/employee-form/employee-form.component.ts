import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SetupService } from "src/app/services/setup.service";
import swal from "sweetalert2";
import { ImageCroppedEvent, base64ToFile } from "ngx-image-cropper";
import { EmployeeService } from "src/app/services/employee.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { DataService } from "src/app/services/data.service";
import { Subscription } from "rxjs";
import { LoadingService } from "../../../../services/loading.service";
import { CommonService } from "../../../../services/common.service";
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
  employeeForm: FormGroup;
  public jobTitles: any[] = [];
  public jobTitleId;
  public countryId: number;
  public countries: any[] = [];
  public jobDetailForm;
  public states: any[] = [];
  public departments: any[] = [];
  public roles: any[] = [];
  public access: any[] = [];
  public accessLevel: any[] = [];
  loading: boolean;
  image: any;
  allJobGrades$ = this.setupService.getJobGrades();
  isVisible: boolean = false;
  navigationSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private setupService: SetupService,
    private utilitiesService: UtilitiesService,
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private loadingService: LoadingService,
    private commonService: CommonService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.route.queryParams.subscribe((param) => {
      const id: number = param.id;
      if (id !== undefined) {
        this.getProfile(id);
      } else {
      }
      // this.getProfile(id)
      // if (param.has("editUser")) {
      //   this.dataService.currentUser.subscribe((result) => {
      //     this.initializeEditForm(result);
      //   });
      // } else {
      //   this.initializeForm();
      // }
    });
    this.getJobTitle();
    this.getCountry();
    this.getStaffDepartments();
    this.getUserRole();
    this.getAccess();
  }

  getProfile(id: number) {
    this.loadingService.show();
    this.employeeService.getEmployeeById(id).subscribe(
      (data) => {
        this.loadingService.hide();
        const result = data.employeeList[0];
        this.getAccessLevelsByAccessLevelId(result.accessLevelId);
        this.employeeForm.patchValue({
          employeeId: result.employeeId,
          staffId: result.staffId,
          firstName: result.firstName,
          lastName: result.lastName,
          middleName: result.middleName,
          jobTitle: result.jobTitle,
          dateOfJoin: result.dateOfJoin,
          phoneNumber: result.phoneNumber,
          email: result.email,
          address: result.address,
          dateOfBirth: result.dateOfBirth,
          gender: result.gender,
          stateId: result.stateId,
          countryId: result.countryId,
          //staffLimit: [""],
          accessLevel: result.accessLevel,
          staffOfficeId: result.staffOfficeId,
          userName: result.userName,
          userStatus: "",
          accessLevelId: result.accessLevelId,
          userAccessLevels: result.userAccessLevels,
          userRoleNames: result.userRoleNames,
          password: [""],
          photoFile: [""],
          jobGrade: result.jobGrade,
          isHRAdmin: result.isHRAdmin,
        });
        this.getStatesByCountryId(result.countryId);
        // console.log(this.employeeForm.value);
        // Resets the photo input field of the form
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  initializeEditForm(result) {
    this.getStatesByCountryId(result?.countryId);
    this.getAccessLevelsByAccessLevelId(result?.accessLevelId);
    this.employeeForm = this.formBuilder.group({
      employeeId: result.employeeId,
      staffId: result?.staffId,
      firstName: [result?.firstName],
      lastName: [result?.lastName],
      middleName: [result?.middleName],
      jobTitle: [result?.jobTitle],
      dateOfJoin: [result?.dateOfJoin],
      phoneNumber: [result?.phoneNumber],
      email: [result?.email],
      address: [result?.address],
      dateOfBirth: [result?.dateOfBirth],
      gender: [result?.gender],
      stateId: [result?.sateId],
      countryId: [result?.countryId],
      //staffLimit: [""],
      accessLevel: [result?.accessLevel],
      staffOfficeId: [result?.staffOfficeId],
      userName: [result?.userName],
      userStatus: [result?.userStatus.isSuccessful],
      accessLevelId: [result?.accessLevelId],
      userAccessLevels: [result?.userAccessLevels],
      userRoleNames: [result?.userRoleNames],
      password: [""],
      photoFile: [""],
      jobGrade: [result?.jobGrade],
      isHRAdmin: [result?.isHRAdmin],
    });
    // Resets the photo input field of the form
    if (this.fileInput) {
      this.fileInput.nativeElement.value = "";
    }
  }

  initializeForm() {
    this.employeeForm = this.formBuilder.group({
      employeeId: [0],
      staffId: [0],
      //staffCode: [""],
      firstName: [""],
      lastName: [""],
      middleName: [""],
      jobTitle: [""],
      dateOfJoin: [""],
      phoneNumber: [""],
      email: [""],
      address: [""],
      dateOfBirth: [""],
      gender: [""],
      stateId: [""],
      countryId: [""],
      //staffLimit: [""],
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
      isHRAdmin: [false],
    });
    // Resets the photo input field of the form
    if (this.fileInput) {
      this.fileInput.nativeElement.value = "";
    }
  }

  addEmployeeToHrm(EmployeeForm: FormGroup) {
    const payload = EmployeeForm.value;
    // console.log(payload.userRoleNames);
    // return;
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
    if (!payload.dateOfBirth) {
      return swal.fire("Error", "Date Of Birth is required", "error");
    }
    if (!payload.gender) {
      return swal.fire("Error", "Gender is required", "error");
    }
    if (!payload.jobTitle) {
      return swal.fire("Error", "Job Title is required", "error");
    }
    if (!payload.phoneNumber) {
      return swal.fire("Error", "Phone Number is required", "error");
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
    // if (!payload.staffLimit) {
    //   return swal.fire("Error", "Staff Limit is required", "error");
    // }
    if (!payload.address) {
      return swal.fire("Error", "Address is required", "error");
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

    // EmployeeForm.get("dateOfBirth").setValue(
    //   new Date(EmployeeForm.get("dateOfBirth").value).toLocaleDateString(
    //     "en-CA"
    //   )
    // );
    // EmployeeForm.get("dateOfJoin").setValue(
    //   new Date(EmployeeForm.get("dateOfJoin").value).toLocaleDateString("en-CA")
    // );
    // let formData = new FormData();
    // for (const key in EmployeeForm.value) {
    //   formData.append(key, EmployeeForm.get(key).value);
    // }
    // const formData = new FormData();
    // for (let key in payload) {
    //   Array.isArray(payload[key])
    //     ? payload[key].forEach((value) => formData.append(key + "[]", value))
    //     : formData.append(key, payload[key]);
    // }
    // formData.set("accessLevel", "1");
    // formData.set("staffLimit", "1000");
    payload.accessLevel = "1";
    payload.staffLimit = "1000";
    payload.dateOfBirth = new Date(payload.dateOfBirth).toLocaleDateString(
      "en-CA"
    );
    payload.dateOfJoin = new Date(payload.dateOfJoin).toLocaleDateString(
      "en-CA"
    );
    const val = this.convertModelToFormData(payload);
    console.log(val);
    // return;
    this.loadingService.show();
    this.employeeService.addEmployee(val).subscribe(
      (res) => {
        this.loadingService.hide();
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
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  getJobTitle() {
    this.loadingService.show();
    return this.setupService.getJobTitle().subscribe(
      (data) => {
        this.loadingService.hide();

        this.jobTitles = data.setuplist;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  getCountry() {
    this.loadingService.show();
    return this.commonService.getCountries().subscribe(
      (data) => {
        this.loadingService.hide();
        this.countries = data.commonLookups;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  getStatesByCountryId(id) {
    this.loadingService.show();
    return this.commonService.getStatesByCountryId(id).subscribe(
      (data) => {
        this.loadingService.hide();
        this.states = data.commonLookups;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  getStaffDepartments() {
    this.loadingService.show();
    return this.commonService.getCompanyStructures().subscribe(
      (data) => {
        this.loadingService.hide();
        this.departments = data.companyStructures;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  getUserRole() {
    this.loadingService.show();
    return this.commonService.getRoles().subscribe(
      (data) => {
        this.loadingService.hide();
        this.roles = data.roles;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  getAccess() {
    this.loadingService.show();
    return this.commonService.getCompanyStructureDefinition().subscribe(
      (data) => {
        this.loadingService.hide();
        this.access = data.companyStructureDefinitions;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  getAccessLevelsByAccessLevelId(id) {
    this.loadingService.show();
    return this.commonService.getAccessLevelsByAccessLevelId(id).subscribe(
      (data) => {
        this.loadingService.hide();
        this.accessLevel = data.companyStructures;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  clearPhoto() {
    this.isVisible = false;
    this.employeeForm.get("photoFile").setValue("");
    // Resets the photo input field of the form
    if (this.fileInput) {
      this.fileInput.nativeElement.value = "";
    }
  }

  fileChangeEvent(event: any): void {
    this.isVisible = true;
    this.imageChangedEvent = event;
    this.utilitiesService.uploadFileValidator(event, this.employeeForm);

    if (
      this.utilitiesService.uploadFileValidator(event, this.employeeForm) ===
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
    this.employeeForm.patchValue({
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

  convertModelToFormData(val, formData = new FormData(), namespace = "") {
    if (typeof val !== "undefined" && val !== null) {
      if (val instanceof Date) {
        formData.append(namespace, val.toISOString());
      } else if (val instanceof Array) {
        for (let i = 0; i < val.length; i++) {
          this.convertModelToFormData(
            val[i],
            formData,
            namespace + "[" + i + "]"
          );
        }
      } else if (typeof val === "object" && !(val instanceof File)) {
        for (let propertyName in val) {
          if (val.hasOwnProperty(propertyName)) {
            this.convertModelToFormData(
              val[propertyName],
              formData,
              namespace ? `${namespace}[${propertyName}]` : propertyName
            );
          }
        }
      } else if (val instanceof File) {
        formData.append(namespace, val);
      } else {
        formData.append(namespace, val.toString());
      }
    }
    return formData;
  }
}
