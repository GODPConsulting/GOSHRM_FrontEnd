import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SetupService } from 'src/app/services/setup.service';
import swal from "sweetalert2";
declare const $: any;
@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {
  EmployeeForm: FormGroup;
  public jobTitles: any[] = [];
  public jobTitleId;
  public countryId: number;
  public countries: any[] = [];
  public jobDetailForm;
  public rows=[];
  public srch=[];
  public states: any[] = [];
  public pageLoading: boolean;
  public departments: any[]=[];
  public roles: any[] = [];
  public access:any[] = [];
  public accessLevel:any[] = [];
  loading: boolean
 
  constructor( 
    private formBuilder: FormBuilder,
    private setupService: SetupService) { }

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
      staffCode:["", ],
      firstName: ["", ],
      lastName: ["", ],
      middleName: ["", ],
      jobTitle: ["", ],
      phoneNumber: ["", ],
      email: ["", ],
      address: ["", ],
      dateOfBirth: ["",],
      gender: ["",],
      stateId: ["", ],
      countryId: ["",],
      staffLimit: ["", ],
      accessLevel: ["", ],
      staffOfficeId: ["", ],
      userName: ["", ],
      userStatus: ["", ],
      accessLevelId: ["", ],
      userAccessLevels: [[],],
      userRoleNames: [[],],
      password: ["", ], 
  })
}

  // AddEmployee Modal Api Call
  addEmployee(EmployeeForm: FormGroup) {
    const payload = EmployeeForm.value;
    payload.jobTitle = +payload.jobTitle;
    payload.stateId = +payload.stateId;
    payload.staffLimit = +payload.staffLimit;
    payload.accessLevel = +payload.accessLevel;
    payload.staffOfficeId = +payload.staffOfficeId;
    payload.accessLevelId = +payload.accessLevelId;
    payload.countryId = +payload.countryId;
   

    // validations to check if the form fields have value
    if (!payload.firstName) {

      // if first name is empty string, undefined or null

      return swal.fire('Error', 'First Name is required', 'error')
    }
    if (!payload.lastName) {
      return swal.fire('Error', 'Last Name is required', 'error')
    }
    if (!payload.middleName) {
      return swal.fire('Error', 'Middle Name is required', 'error')
    }
    if (!payload.staffCode) {
      return swal.fire('Error', 'Staff Code is required', 'error')
    }
    if (!payload.dateOfBirth) {
      return swal.fire('Error', 'Date Of Birth is required', 'error')
    }
    if (!payload.gender) {
      return swal.fire('Error', 'Gender is required', 'error')
    }
    if (!payload.jobTitle) {
      return swal.fire('Error', 'Job Title is required', 'error')
    }
    if (!payload.email) {
      return swal.fire('Error', 'Email is required', 'error')
    }
    if (!payload.countryId) {
      return swal.fire('Error', 'Country is required', 'error')
    }
    if (!payload.stateId) {
      return swal.fire('Error', 'State is required', 'error')
    }
    if (!payload.staffOfficeId) {
      return swal.fire('Error', 'Office/Department is required', 'error')
    }
    if (!payload.staffLimit) {
      return swal.fire('Error', 'Staff Limit is required', 'error')
    }
    if (!payload.address) {
      return swal.fire('Error', 'Address is required', 'error')
    }
    if (!payload.phoneNumber) {
      return swal.fire('Error', 'Phone Number is required', 'error')
    }
    if (!payload.userName) {
      return swal.fire('Error', 'User Name is required', 'error')
    }
    if (!payload.password) {
      return swal.fire('Error', 'Password is required', 'error')
    }
    if (!payload.userRoleNames) {
      return swal.fire('Error', 'User Role is required', 'error')
    }
    if (!payload.userStatus) {
      return swal.fire('Error', 'Status is required', 'error')
    }
    if (!payload.accessLevelId) {
      return swal.fire('Error', 'Access is required', 'error')
    }
    if (!payload.userAccessLevels) {
      return swal.fire('Error', 'Access Level is required', 'error')
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
            $("#add_employee_form").modal("hide");
          } else {
            swal.fire("Error", message, "error");
          }

        },
        (err) => {
          this.loading = false;
          const message = err.status.message.friendlyMessage;
          swal.fire("Error", message, "error");
        }
      );
  }

  getJobTitle() {
    this.pageLoading = true;
    return this.setupService.getData("/hrmsetup/get/all/jobtitle").subscribe(
      (data) => {
        this.pageLoading = false;
        console.log(data);
        this.jobTitles = data.setuplist;
      },
      (err) => {
        this.pageLoading = false;
        console.log(err);
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
        console.log(err);
      }
    );
  }

  getStatesByCountryId(id) {
    this.pageLoading = true;
   return this.setupService.getData(`/common/get/states/countryId?CountryId=${id}`).subscribe(
    (data) => {
      this.pageLoading= false;
      this.states = data.commonLookups;
    },
    (err) => {
      this.pageLoading = false;
      console.log(err);
    }
  );
  }
 getStaffDepartments() {
  this.pageLoading = true;
  return this.setupService.getData("/company/get/all/companystructures").subscribe(
   (data) => {
     this.pageLoading= false;
     this.departments= data.companyStructures;
   
   },
   (err) => {
     this.pageLoading = false;
     console.log(err);
   }
 );
 }

 getUserRole(){
this.pageLoading=true;
return this.setupService.getData("/admin/get/all/role").subscribe(
  (data) => {
    this.pageLoading= false;
    this.roles= data.roles;
  },
  (err)=>{
    this.pageLoading=false;
    console.log(err);
  }
);
 }

 getAccess(){
  this.pageLoading=true;
  return this.setupService.getData("/company/get/all/companystructureDefinition").subscribe(
    (data) => {
      this.pageLoading= false;
      this.access= data.companyStructureDefinitions;
    },
    (err)=>{
      this.pageLoading=false;
      console.log(err);
    }
  );
   }

   getAccessLevelsByAccessLevelId(id){
    this.pageLoading=true;
    return this.setupService.getData(`/company/get/all/companystructure/accessId?AccessId=${id}`).subscribe(
      (data) => {
        this.pageLoading= false;
        this.accessLevel= data.companyStructures;
      },
      (err)=>{
        this.pageLoading=false;
        console.log(err);
      }
    );
     }
}
