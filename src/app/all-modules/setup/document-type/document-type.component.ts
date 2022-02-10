import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import { LoadingService } from 'src/app/services/loading.service';
import { CustomerService } from 'src/app/services/customer.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-document-type',
  templateUrl: './document-type.component.html',
  styleUrls: ['./document-type.component.css'],
})
export class DocumentTypeComponent implements OnInit {
  documentTypeList: any[] = [];
  selectedDocumentType: any[];
  form: FormGroup;
  formTitle = 'Add Document Type';
  displayDocumentType = false;
  viewHeight: any = '600px';
  fileToUpload: File;
  cols: any[];
  @ViewChild('fileInput') fileInput: ElementRef;
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private customerService: CustomerService,
    private commonService: CommonService
  ) {
    this.form = this.fb.group({
      documentTypeId: [''],
      name: ['', Validators.required],
      document_identifier: [0, Validators.required],
    });
  }

  ngOnInit() {
    this.cols = [{ field: 'lookupName', header: 'lookupName' }];
    this.getAllDocumentType();
  }

  submitDocumentType(formObj) {
    const payload = formObj.value;
    if (payload.documentTypeId == null) {
      payload.documentTypeId = 0;
    }
    payload.document_identifier = parseInt(payload.document_identifier);

    this.commonService.updateDocumenttype(payload).subscribe(
      (data) => {
        let message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire('GOS FINANCIAL', message, 'success');
          this.getAllDocumentType();
          this.form.reset();
          this.displayDocumentType = false;
        } else {
          swal.fire('GOS FINANCIAL', message, 'error');
          this.displayDocumentType = false;
          this.form.reset();
        }
        // if (data['result'] == true) {
        //     swal.fire('GOS FINANCIAL', data['message'], 'success');
        //     this.getAllDocumentType();
        //     this.form.reset();
        //     this.displayDocumentType = false;
        // } else {
        //     swal.fire('GOS FINANCIAL', data['message'], 'error');
        // }
      },
      (err) => {
        let message = err.status.message.friendlyMessage;
        swal.fire('GOS FINANCIAL', message, 'error');
      }
    );
  }

  showAddNew() {
    this.form.reset();
    this.displayDocumentType = true;
  }

  getAllDocumentType() {
    this.commonService.getAllDocumentType().subscribe(
      (data) => {
        this.documentTypeList = data['commonLookups'];
      },
      (err) => {}
    );
  }
  editDocumentType(row) {
    this.displayDocumentType = true;
    this.formTitle = 'Edit Document Type';
    this.form = this.fb.group({
      documentTypeId: [row.lookupId],
      name: [row.lookupName],
      document_identifier: [row.parentId, Validators.required],
    });
  }

  rowClicked(row: any): void {}

  deleteDocumentType(row) {
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to delete this record?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        if (result.value) {
          __this.customerService
            .deleteDocumentType(row.lookupId)
            .subscribe((data) => {
              if (data['result'] == true) {
                swal.fire('GOS FINANCIAL', data['message'], 'success');
                __this.getAllDocumentType();
              } else {
                swal.fire('GOS FINANCIAL', data['message'], 'error');
              }
            });
        } else {
          swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
      });
  }
  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }
  async uploadDocumentType() {
    if (this.fileToUpload == null) {
      return swal.fire(
        'GOS FINANCIAL',
        'Please select upload document to continue',
        'error'
      );
    }

    await this.commonService
      .uploadDocumentType(this.fileToUpload)
      .then((data) => {
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.fileToUpload = null;
          this.fileInput.nativeElement.value = '';
          this.getAllDocumentType();
          swal.fire('GOS FINANCIAL', message, 'success');
        } else {
          this.fileToUpload = null;
          this.fileInput.nativeElement.value = '';
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      })
      .catch((err) => {
        this.fileInput.nativeElement.value = '';
        const error = JSON.parse(err);
        const message = error.status.message.friendlyMessage;
        swal.fire('GOS FINANCIAL', message, 'error');
      });
  }
  exportDocumentType() {
    this.commonService.exportDocumentType().subscribe(
      (response) => {
        let data = response;
        if (data != undefined) {
          let byteString = atob(data);
          let ab = new ArrayBuffer(byteString.length);
          let ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          let bb = new Blob([ab]);
          try {
            let file = new File([bb], 'Documents Type.xlsx', {
              type: 'application/vnd.ms-excel',
            });
            saveAs(file);
          } catch (err) {
            let textFileAsBlob = new Blob([bb], {
              type: 'application/vnd.ms-excel',
            });
            window.navigator.msSaveBlob(textFileAsBlob, 'Documents Type.xlsx');
          }
        }
      },
      (err) => {}
    );
  }
  multipleDelete() {
    if (this.selectedDocumentType.length === 0) {
      return swal.fire(
        'GOS FINANCIAL',
        'Please select records you want to delete',
        'error'
      );
    }
    const tempData = this.selectedDocumentType;
    const targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach((el) => {
        // const data = {
        //   targetId: el.lookupId
        // };
        if (el.lookupId == 1) {
          return swal.fire(
            'GOS FINANCIAL',
            'Document Type Signature cannot be deleted',
            'error'
          );
        }
        targetIds.push(el.lookupId);
      });
    }
    const body = {
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
          __this.commonService.multiDeleteDocumentType(body).subscribe(
            (data) => {
              const message = data.status.message.friendlyMessage;
              if (data.status.isSuccessful) {
                swal.fire('GOS FINANCIAL', message, 'success');
                __this.getAllDocumentType();
                this.selectedDocumentType = [];
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
          swal.fire('Info', 'Cancelled', 'info');
        }
      });
  }
}
