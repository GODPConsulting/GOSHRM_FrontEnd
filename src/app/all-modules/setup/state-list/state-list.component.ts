import swal from 'sweetalert2';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { LoadingService } from 'src/app/services/loading.service';
import { StateService } from 'src/app/services/state.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-state-list',
  templateUrl: './state-list.component.html',
  styleUrls: ['./state-list.component.css']
})
export class StateListComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  stateInformation: any[] = [];
  selectedstateInformation: any[];
  viewHeight: any = '600px';
  private fileToUpload: File;
  cols: any[] = [];
  constructor(
    private loadingService: LoadingService,
    private stateService: StateService,
    private router: Router,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.cols = [
      {
        header: 'code',
        field: 'code',
      },
      {
        header: 'lookupName',
        field: 'lookupName',
      },
    ];
    this.getAllState();
  }

  showAddNew() {
    this.router.navigate(['/setup/state']);
  }

  getAllState() {
    this.commonService.getAllState().subscribe(
      (data) => {
        this.stateInformation = data['commonLookups'];
      },
      (err) => {}
    );
  }
  editState(row) {
    this.router.navigate(['/setup/state'], {
      queryParams: { editstate: row.lookupId },
    });
  }
  deleteState(row) {
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
          __this.stateService.deleteState(row.stateId).subscribe((data) => {
            if (data['result'] == true) {
              swal.fire('GOS FINANCIAL', 'User deleted successful.', 'success');
              __this.getAllState();
            } else {
              swal.fire('GOS FINANCIAL', 'Record not deleted', 'error');
            }
          });
        } else {
          swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
      });
  }
  exportStates() {
    this.stateService.exportStatesList().subscribe(
      (response) => {
        const data = response;
        if (data != undefined) {
          const byteString = atob(data);
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          const bb = new Blob([ab]);
          try {
            const file = new File([bb], 'States.xlsx', {
              type: 'application/vnd.ms-excel',
            });
            saveAs(file);
          } catch (err) {
            const textFileAsBlob = new Blob([bb], {
              type: 'application/vnd.ms-excel',
            });
            window.navigator.msSaveBlob(textFileAsBlob, 'States.xlsx');
          }
        }
      },
      (err) => {
        const message = err.status.message.friendlyMessage;
        swal.fire('GOS FINANCIAL', message, 'error');
      }
    );
  }
  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }
  async uploadStates() {
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

    await this.commonService
      .uploadStatesList(this.fileToUpload)
      .then((data) => {
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.fileToUpload = null;
          this.getAllState();
          this.fileInput.nativeElement.value = '';
          swal.fire('GOS FINANCIAL', message, 'success');
        } else {
          this.fileToUpload = null;
          this.fileInput.nativeElement.value = '';
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      })
      .catch((err) => {
        this.fileInput.nativeElement.value = '';
        let error = JSON.parse(err);
        const message = error.status.message.friendlyMessage;
        swal.fire('GOS FINANCIAL', message, 'error');
      });
  }
  multipleDelete() {
    if (this.selectedstateInformation.length == 0) {
      swal.fire(
        'GOS FINANCIAL',
        'Please select records you want to delete',
        'error'
      );
      return;
    }
    let tempData = this.selectedstateInformation;
    let targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach((el) => {
        let data = {
          targetId: el.lookupId,
        };
        targetIds.push(el.lookupId);
      });
    }
    let body = {
      itemsId: targetIds,
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
          __this.stateService.multiDeleteStates(body).subscribe(
            (data) => {
              const message = data.status.message.friendlyMessage;
              if (data.status.isSuccessful) {
                swal.fire('GOS FINANCIAL', message, 'success');
                this.selectedstateInformation = [];
                __this.getAllState();
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
