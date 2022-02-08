import { Router } from "@angular/router";
// import { UserroleactivityService } from "./../../../core/services/userroleactivity.service";
import swal from "sweetalert2";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Component, ElementRef, OnInit } from "@angular/core";
import { LoadingService } from "src/app/services/loading.service";
import { UtilitiesService } from "src/app/services/utilities.service";

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.css']
})
export class UserRoleComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  userRoleList: any[] = [];
  selectedUserRole: any[] = [];
  viewHeight: any = "500px";
  edit = false;
  idEl: any = "checkbox";
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private userRoleService: UtilitiesService,
    private router: Router,
    private elem: ElementRef
  ) {
    console.log(this.elem.nativeElement.getAttribute("id"));
  }

  ngOnInit() {
    this.getAllUserRole();
  }

  getAllUserRole() {
    this.loadingService.show();
    this.userRoleService.getAllUserRole().subscribe(
      data => {
        this.loadingService.hide();
        if (data) {
          this.userRoleList = data["roles"];
        }
      },
      err => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire('Error', message, 'error')
      }
    );
  }

  showAddNew() {
    this.router.navigate(["/setup/user-role-activity"]);
  }

  editUserRole(row) {
    this.router.navigate(["/setup/user-role-activity"], {
      queryParams: { edituserrole: row.roleId }
    });
  }
  onRowSelect(event) {
    this.router.navigate(["/setup/user-role-activity"], {
      queryParams: { edituserrole: event.userRoleId }
    });
  }

  deleteUserRole(row) {
    const __this = this;
    swal.fire({
        // title: "Are you sure you want to delete record?",
        // text: "You won't be able to revert this!",
        // type: "question",
        // showCancelButton: true,
        // confirmButtonColor: "#3085d6",
        // cancelButtonColor: "#d33",
        // confirmButtonText: "Yes, delete it!",
        // cancelButtonText: "No, cancel!",
        // confirmButtonClass: "btn btn-success btn-move",
        // cancelButtonClass: "btn btn-danger",
        // buttonsStyling: true
      })
      .then(result => {
        if (result.value) {
          __this.loadingService.show();

          __this.userRoleService
            .deleteUserRole(row.userRoleId)
            .subscribe(data => {
              __this.loadingService.hide();
              if (data["result"] == true) {
                swal.fire("GOS FINANCIAL", data["message"], "success");
                __this.getAllUserRole();
              } else {
                swal.fire("GOS FINANCIAL", data["message"], "error");
              }
            });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }

  multipleDelete() {
    if (this.selectedUserRole.length == 0) {
      swal.fire("Error", "Please select records you want to delete", "error");
      return;
    }
    const tempData = this.selectedUserRole;
    const targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        const data = {
          targetId: el.roleId
        };
        targetIds.push(el.roleId);
      });
    }
    const body = {
      req: targetIds
    };
    const __this = this;
    swal.fire({
        // title: "Are you sure you want to delete record?",
        // text: "You won't be able to revert this!",
        // type: "question",
        // showCancelButton: true,
        // confirmButtonColor: "#3085d6",
        // cancelButtonColor: "#d33",
        // confirmButtonText: "Yes, delete it!",
        // cancelButtonText: "No, cancel!",
        // confirmButtonClass: "btn btn-success btn-move",
        // cancelButtonClass: "btn btn-danger",
        // buttonsStyling: true
      })
      .then(result => {
        if (result.value) {
          console.log(body);
          __this.loadingService.show();

          __this.userRoleService.deleteMultipleUserRole(body).subscribe(
            data => {
              __this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.status.isSuccessful) {
                swal.fire("Success", message, "success");
                this.selectedUserRole = [];
                __this.getAllUserRole();
              } else {
                swal.fire("Error", message, "error");
              }
            },
            err => {
              this.loadingService.hide();
              const message = err.status.message.friendlyMessage;
              swal.fire("Error", message, "error");
            }
          );
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
}

