import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, ElementRef, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';
import { SearchColumn } from 'src/app/interface/interfaces';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls:['./user-role.component.css']
})
export class UserRoleComponent implements OnInit {
  userRoleList: any[] = [];
  selectedUserRole: any[] = [];
  viewHeight: any = '500px';
  edit = false;
  idEl: any = 'checkbox';
  cols: SearchColumn[];
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private userRoleService: UtilitiesService,
    private router: Router,
    private elem: ElementRef
  ) {}

  ngOnInit() {
    this.getAllUserRole();
  }

  getAllUserRole() {
    this.userRoleService.getAllUserRole().subscribe(
      (data) => {
        if (data) {
          this.userRoleList = data['roles'];
        }
      },
      (err) => {
        const message = err.status.message.friendlyMessage;
        swal.fire('GOS FINANCIAL', message, 'error');
      }
    );
  }

  showAddNew() {
    this.router.navigate(['/setup/user-role-activity']);
  }

  editUserRole(row) {
    this.router.navigate(['/setup/user-role-activity'], {
      queryParams: { edituserrole: row.roleId },
    });
  }
  onRowSelect(event) {
    this.router.navigate(['/setup/user-role-activity'], {
      queryParams: { edituserrole: event.userRoleId },
    });
  }

  deleteUserRole(row) {
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to delete record?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        if (result.value) {
          __this.userRoleService
            .deleteUserRole(row.userRoleId)
            .subscribe((data) => {
              if (data['result'] == true) {
                swal.fire('GOS FINANCIAL', data['message'], 'success');
                __this.getAllUserRole();
              } else {
                swal.fire('GOS FINANCIAL', data['message'], 'error');
              }
            });
        } else {
          swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
      });
  }

  multipleDelete() {
    if (this.selectedUserRole.length == 0) {
      swal.fire(
        'GOS FINANCIAL',
        'Please select records you want to delete',
        'error'
      );
      return;
    }
    const tempData = this.selectedUserRole;
    const targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach((el) => {
        const data = {
          targetId: el.roleId,
        };
        targetIds.push(el.roleId);
      });
    }
    const body = {
      req: targetIds,
    };
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to delete record?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        if (result.value) {
          __this.userRoleService.deleteMultipleUserRole(body).subscribe(
            (data) => {
              const message = data.status.message.friendlyMessage;
              if (data.status.isSuccessful) {
                swal.fire('GOS FINANCIAL', message, 'success');
                this.selectedUserRole = [];
                __this.getAllUserRole();
              } else {
                swal.fire('GOS FINANCIAL', message, 'error');
              }
            },
            (err) => {
              const message = err.status.message.friendlyMessage;
              swal.fire('GOS FINANCIAL', message, 'error');
            }
          );
        } else {
          swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
      });
  }
}
