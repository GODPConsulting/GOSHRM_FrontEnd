import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LoadingService } from "src/app/services/loading.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import { CommonService } from "src/app/services/common.service";
import { JwtService } from "src/app/services/jwt.service";
import { AuthService } from "src/app/services/auth.service";


@Component({
  selector: 'app-user-role-activities',
  templateUrl: './user-role-activities.component.html',
  styleUrls: ['./user-role-activities.component.css']
})
export class UserRoleActivitiesComponent implements OnInit {
  userRoleActivities: any[] = [];
  filteredUserRoleActivities: any[] = [];
  roleName: string;
  formTitlte: string = "Add New User Role";
  modules: any[];
  selecteduserRoleActivity: any[] = [];
  userRoleId: string = "";
  viewHeight: any = "600px";
  viewAll: boolean;
  createAll: boolean;
  updateAll: boolean;
  deleteAll: boolean;
  approveAll: boolean;
  arr: any[] = [];
  userId: string;
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private userRoleService: UtilitiesService,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private jwtService: JwtService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userId = this.jwtService.getUserDetails().userId;
    this.getAllModules();
    this.route.queryParams.subscribe(params => {
      let userRoleId = params["edituserrole"];
      if (userRoleId != null || userRoleId != undefined) {
        this.userRoleId = userRoleId;
        this.getNewUserRoles(userRoleId);
      } else {
        this.getNewUserRoles(0);
      }
    });
  }

  getAllModules() {
    this.loadingService.show();
    this.commonService.getAllModules().subscribe(
      response => {
        if (response) {
          this.loadingService.hide();
          this.modules = response.commonLookups;
        }
      },
      err => {
        this.loadingService.hide();
        console.log(err);
      }
    );
  }

  getNewUserRoles(userRoleId) {
    this.loadingService.show();
    this.userRoleService.getNewUserRoles(userRoleId).subscribe(
      response => {
        if (response) {
          this.userRoleActivities = response.activities;
          if (this.userRoleActivities != undefined) {
            this.filteredUserRoleActivities = this.userRoleActivities;
            this.roleName = this.userRoleActivities[0].roleName;
            if (this.userRoleId != '0') {
              this.selecteduserRoleActivity = this.userRoleActivities.filter(
                x => x.roleId == this.userRoleId
              );
            }
            this.loadingService.hide();
          }
        } else {
          this.loadingService.hide();
        }
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  onSelectedModuleChanged(value) {
    if (value != "") {
      this.filteredUserRoleActivities = this.userRoleActivities.filter(
        x => x.activityParentId == value
      );
    } else {
      this.filteredUserRoleActivities = this.userRoleActivities;
    }
  }

  SubmitUserRole() {
    // console.log(this.selecteduserRoleActivity);
    // return;
    // console.log(this.arr);
    // return;
    if (this.selecteduserRoleActivity.length === 0) {
      swal.fire(
        "GOS FINANCIAL",
        "Please select at least one page",
        "error"
      );
      return;
    }
    // console.log("Serrrrr", this.selecteduserRoleActivity)

    const body = {
      roleId: this.userRoleId,
      roleName: this.roleName,
      activities: this.selecteduserRoleActivity,
      userId: this.userId
    };
    // console.log(body);
    // return;
    this.loadingService.show();
    this.userRoleService.addUserRoleAndActivity(body).subscribe(
      data => {
        this.loadingService.hide();
        let message = data.status.message.friendlyMessage;
        swal.fire("GOS FINANCIAL", message, "success").then(() => {
          this.getUserDetails();
          this.router.navigate(["/admin/user-role"]);
        });
        // if (data["result"] === true) {
        //     this.router.navigate(["/admin/user-role"]);
        //     swal.fire("GOS FINANCIAL", data["message"], "success");
        // } else {
        //     swal.fire("GOS FINANCIAL", data["message"], "error");
        // }
      },
      err => {
        this.loadingService.hide();
        let error = err.status.message;
        swal.fire("GOS FINANCIAL", error.friendlyMessage, "error");
      }
    );
  }
  goBack() {
    this.router.navigate(["/admin/user-role"]);
  }
  getValue(value: any) {
    let data = {
      viewAll: value
    };
    this.arr.push(data);
    console.log(this.arr);
  }

  checkViewAll(event) {
    this.filteredUserRoleActivities = this.filteredUserRoleActivities.map(item => {
      return {...item, canView: event.target.checked}
    })
    // this.viewAll = !this.viewAll;
  }

  checkCreateAll(event) {
    this.filteredUserRoleActivities = this.filteredUserRoleActivities.map(item => {
      return {...item, canAdd: event.target.checked}
    })
  }

  checkUpdateAll(event) {
    this.filteredUserRoleActivities = this.filteredUserRoleActivities.map(item => {
      return {...item, canEdit: event.target.checked}
    })
    // this.updateAll = !this.updateAll;
  }

  checkDeleteAll(event) {
    this.filteredUserRoleActivities = this.filteredUserRoleActivities.map(item => {
      return {...item, canDelete: event.target.checked}
    })
    // this.deleteAll = !this.deleteAll;
  }

  checkApproveAll(event) {
    this.filteredUserRoleActivities = this.filteredUserRoleActivities.map(item => {
      return {...item, canApprove: event.target.checked}
    })
    // this.approveAll = !this.approveAll;
  }
  getUserDetails() {
    this.loadingService.show();
    return this.authService.getProfile().subscribe(
      data => {
        this.loadingService.hide();
        if (data != null) {
          this.jwtService.saveUserDetails(data);
          let activities;
          if (data.activities != null) {
            activities = data.activities.map(item => {
              return item.toLocaleLowerCase();
            });
            this.jwtService.saveUserActivities(activities).then(() => {
            });
          }
        }
      },
      error => {
        console.log(error);
      }
    );
  }
}

