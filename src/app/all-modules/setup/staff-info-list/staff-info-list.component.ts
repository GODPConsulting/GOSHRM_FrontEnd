import { saveAs } from 'file-saver';
import swal from 'sweetalert2';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';
import { StaffInfoService } from 'src/app/services/staff-info.service';

interface Columns {
  field: string;
  header: string;
}

@Component({
  selector: 'app-staff-info-list',
  templateUrl: './staff-info-list.component.html',
})
export class StaffInfoListComponent implements OnInit {
  fileToUpload: File;
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  staffInformation: Array<[]> = [];
  selectedstaffInformation: any[] = [];
  cols: Columns[];
  viewHeight: string = '600px';
  constructor(
    private loadingService: LoadingService,
    private staffInfoService: StaffInfoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cols = [
      { field: 'staffCode', header: 'staffCode' },
      { field: 'jobTitleName', header: 'jobTitleName' },
      { field: 'email', header: 'email' },
      { field: 'firstName', header: 'firstName' },
      { field: 'phoneNumber', header: 'phoneNumber' },
      { field: 'lastName', header: 'lastName' },
    ];
    this.getAllStaff();
  }

  showAddNew() {
    this.router.navigate(['/admin/staff-info']);
  }

  getAllStaff() {
    this.staffInfoService.getAllStaff().subscribe(
      (data) => {
        this.staffInformation = data.staff;
      },
      (err) => {}
    );
  }
  editStaff(row) {
    this.router.navigate(['/admin/staff-info'], {
      queryParams: { editstaffinfo: row.staffId },
    });
  }
  deleteStaff(row) {
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
          __this.staffInfoService.deleteStaff(row.staffId).subscribe((data) => {
            if (data['result'] == true) {
              swal.fire('GOS FINANCIAL', data['message'], 'success');
              __this.getAllStaff();
            } else {
              swal.fire('GOS FINANCIAL', data['message'], 'error');
            }
          });
        } else {
          swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
      });
  }

  exportStaff() {
    this.staffInfoService.exportStaff().subscribe((response) => {
      let data = response;
      if (data != undefined) {
        var byteString = atob(data);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        var bb = new Blob([ab]);
        try {
          var file = new File([bb], 'StaffList.xlsx', {
            type: 'application/vnd.ms-excel',
          });
          saveAs(file);
        } catch (err) {
          var textFileAsBlob = new Blob([bb], {
            type: 'application/vnd.ms-excel',
          });
          window.navigator.msSaveBlob(textFileAsBlob, 'StaffList.xlsx');
        }
      }
    });
  }
  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }
  async uploadStaff() {
    if (this.fileToUpload == null) {
      return swal.fire(
        'GOS FINANCIAL',
        'Please select upload document to continue',
        'error'
      );
    }
    if (
      this.fileToUpload.type !=
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      return swal.fire('GOS FINANCIAL', 'Only excel files allowed', 'error');
    }

    await this.staffInfoService
      .uploadStaff(this.fileToUpload)
      .then((data) => {
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.fileToUpload = null;
          this.myInputVariable.nativeElement.value = '';
          swal.fire('GOS FINANCIAL', message, 'success');
          this.getAllStaff();
        } else {
          this.myInputVariable.nativeElement.value = '';
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      })
      .catch((err) => {
        const error = JSON.parse(err);
        const message = error.status.message.friendlyMessage;
        this.myInputVariable.nativeElement.value = '';
        swal.fire('GOS FINANCIAL', message, 'error');
      });
  }
  multipleDelete() {
    if (this.selectedstaffInformation.length == 0) {
      swal.fire(
        'GOS FINANCIAL',
        'Please select records you want to delete',
        'error'
      );
      return;
    }
    let tempData = this.selectedstaffInformation;
    let targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach((el) => {
        let data = {
          targetId: el.staffId,
        };
        targetIds.push(data);
      });
    }
    let body = {
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
          __this.staffInfoService.deleteMultipleStaff(body).subscribe(
            (data) => {
              const message = data.status.message.friendlyMessage;
              if (data.status.isSuccessful) {
                swal.fire('GOS FINANCIAL', message, 'success');
                __this.getAllStaff();
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

  resetProfile(staffId: any) {
    swal
      .fire({
        title: 'Are you sure you want to reset staff profile?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        if (result.value) {
          return this.staffInfoService.resetProfile(staffId).subscribe(
            (res) => {
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire('GOS FINANCIAL', message, 'success');
              } else {
                swal.fire('GOS FINANCIAL', message, 'error');
              }
            },
            (err) => {
              const message = err.status.message.friendlyMessage;
              swal.fire('GOS FINANCIAL', message, 'error');
            }
          );
        }
      });
  }
}
