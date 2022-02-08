import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { SelectItem } from "primeng/api";
import { CommonService } from "src/app/services/common.service";
import { LoadingService } from "src/app/services/loading.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import { CompanyService } from "src/app/services/company.service";
import { CountriesService } from "src/app/services/countries.service";

@Component({
  selector: "app-staff-info",
  templateUrl: "./staff-info.component.html",
  styles: [
    `
      .multiselect-radius {
        border-radius: 4px !important;
      },
    `
  ]
})
export class StaffInfoComponent implements OnInit {
  form: FormGroup;
  formTitle: string = "Create New Staff";
  countries: any[];
  states: any[];
  jobTitles: any[];
  userRoleList: any[];
  accessList: any[];
  accessLevelList: any[];
  accessLevels: SelectItem[];
  userRoles: SelectItem[];
  selectedAccessLevel: string[] = [];
  companyStructureList: any[] = [];
  constructor(
    public fb: FormBuilder,
    private commonService: CommonService,
    private loadingService: LoadingService,
    private staffInfoService: UtilitiesService,
    private countryService: CountriesService,
    private companyService: CompanyService,
    private userRoleService: UtilitiesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      staffId: [0],
      staffCode: [""],
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      middleName: [""],
      jobTitle: ["", Validators.required],
      phoneNumber: [""],
      email: ["", Validators.required],
      address: [""],
      dateOfBirth: [""],
      gender: ["", Validators.required],
      stateId: [""],
      countryId: [""],
      accessLevel: [""],
      staffOfficeId: [0],
      staffLimit: [0],
      username: ["", Validators.required],
      password: [""],
      userStatus: ["", Validators.required],
      userAccountId: [0],
      userRoleNames: [[], Validators.required],
      userAccessLevels: [[]]
    });
  }

  ngOnInit() {
    this.loadDropDowns();
    this.route.queryParams.subscribe(params => {
      let staffId = params["editstaffinfo"];
      if (staffId != null || staffId != undefined) {
        this.editStaff(staffId);
      }
    });
  }

  loadDropDowns() {
    this.commonService.getJobTitles().subscribe(
      data => {
        this.jobTitles = data["commonLookups"];
      },
      err => {
        this.loadingService.hide();
      }
    );

    this.commonService.getAllCountry().subscribe(
      data => {
        this.countries = data["commonLookups"];
      },
      err => {
        this.loadingService.hide();
      }
    );

    this.userRoleService.getAllUserRole().subscribe(data => {
      this.userRoleList = data["roles"];
      this.userRoles = [];
      if (this.userRoleList !== undefined) {
        this.userRoleList.forEach(el => {
          this.userRoles.push({ label: el.roleName, value: el.roleName });
        });
      }
    });

    this.companyService.getAllCompanyStructureDefinition().subscribe(
      data => {
        this.accessList = data["companyStructureDefinitions"];
      },
      err => {
        console.log(err);
      }
    );

    this.companyService.getAllCompanyStructure().subscribe(data => {
      this.companyStructureList = data["companyStructures"];
      console.log("flave", this.companyStructureList);
    });
  }

  onAccessLevelChanged(value, clear: boolean = false) {
    if (value != null) {
      this.loadingService.show();
      this.companyService.getCompanyStructureByAccessId(value).subscribe(
        data => {
          this.loadingService.hide();
          this.accessLevelList = data["companyStructures"];
          this.accessLevels = [];
          if (this.accessLevelList !== undefined) {
            this.accessLevelList.forEach(el => {
              this.accessLevels.push({
                label: el.name,
                value: el.companyStructureId
              });
            });
          }
        },
        err => {
          this.loadingService.hide();
          console.log(err);
        }
      );
      if (clear == true) {
        this.form.get("userAccessLevels").setValue([]);
      }
      this.parseValueToInt(value, 5);
    }
  }
  editStaff(staffId) {
    this.formTitle = "Edit Staff Information";
    this.loadingService.show();
    this.staffInfoService.getSingleStaff(staffId).subscribe(
      data => {
        this.loadingService.hide();
        let row = data.staff[0];
        this.form = this.fb.group({
          staffId: row.staffId,
          staffCode: row.staffCode,
          firstName: row.firstName,
          lastName: row.lastName,
          middleName: row.middleName,
          jobTitle: row.jobTitle,
          phoneNumber: row.phoneNumber,
          email: row.email,
          address: row.address,
          dateOfBirth: new Date(row.dateOfBirth),
          gender: row.gender,
          stateId: row.stateId,
          countryId: row.countryId,
          accessLevel: [row.accessLevel],
          staffOfficeId: [row.staffOfficeId],
          staffLimit: [row.staffLimit],
          username: [row.userName],
          password: [""],
          userStatus: [row.userStatus],
          userAccountId: [row.userAccountId],
          userRoleNames: [row.userRoleNames],
          userAccessLevels: [row.userAccessLevels]
        });
        this.onAccessLevelChanged(row.accessLevel);
        this.getStateByCountry(row.countryId);
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  goBack() {
    this.router.navigate(["/admin/staff-info-list"]);
  }
  submitStaffInfo(formObj) {
    const payload = formObj.value;
    payload.userStatus = payload.userStatus.toString();
    this.loadingService.show();
    this.staffInfoService.addStaffInfo(payload).subscribe(
      data => {
        this.loadingService.hide();
        let message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("Success", message, "success");
          this.router.navigate(["/admin/staff-info-list"]);
        } else {
          swal.fire("Error", message, "error");
        }
        // if (data["result"] == true) {
        //   swal.fire("GOS FINANCIAL", data["message"], "success");
        //   this.router.navigate(["/admin/staff-info-list"]);
        // } else {
        //   swal.fire("GOS FINANCIAL", data["message"], "error");
        // }
      },
      err => {
        this.loadingService.hide();
        let message = err.status.message.friendlyMessage;
        swal.fire("GOS FINANCIAL", message, "error");
      }
    );
  }
  parseValueToInt(value: string, num: number): void {
    let parsedValue = parseInt(value);
    if (num == 1) {
      this.form.patchValue({
        jobTitle: parsedValue
      });
    }
    if (num == 2) {
      this.form.patchValue({
        countryId: parsedValue
      });
    }
    if (num == 3) {
      this.form.patchValue({
        stateId: parsedValue
      });
    }
    if (num == 4) {
      this.form.patchValue({
        staffOfficeId: parsedValue
      });
    }
    if (num == 5) {
      this.form.patchValue({
        accessLevel: parsedValue
      });
    }
  }
  getStateByCountry(id: any) {
    this.loadingService.show();
    this.commonService.getStateByCountry(id).subscribe(
      data => {
        this.loadingService.hide();
        this.states = data["commonLookups"];
      },
      err => {
        this.loadingService.hide();
      }
    );
    this.parseValueToInt(id, 2);
  }
}

