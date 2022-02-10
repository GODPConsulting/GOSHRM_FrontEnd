import { saveAs } from 'file-saver';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-company-structure-definition-list',
  templateUrl: './company-structure-definition-list.component.html',
})
export class CompanyStructureDefinitionListComponent implements OnInit {
  @ViewChild('myInput') myInput: any;
  form: FormGroup;
  myInputVariable: ElementRef;
  fileToUpload: File;
  companyStructureDefinitionList: any[] = [];
  selectedCompanyStructureDefinition: any[] = [];
  cols: any[];
  viewHeight: any = '600px';
  isMultiCompany = '';
  operatingLevel = '';
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private companyService: CompanyService,
    private router: Router
  ) {
    this.form = this.fb.group({
      isMultiCompany: ['', Validators.required],
      operatingLevel: [''],
    });
  }

  ngOnInit() {
    this.cols = [
      { field: 'definition', header: 'definition' },
      { field: 'description', header: 'description' },
      { field: 'structureLevel', header: 'structureLevel' },
    ];
    this.getAllCompanyStructureDefinition();
    this.getCompStructureDefinition();
  }

  showAddNew() {
    this.router.navigate(['/organization/company-structure-definition']);
  }

  getAllCompanyStructureDefinition() {
    this.companyService.getAllCompanyStructureDefinition().subscribe(
      (data) => {
        this.companyStructureDefinitionList =
          data['companyStructureDefinitions'];
      },
      (err) => {}
    );
  }
  editCompanyStructureDefinition(row) {
    this.router.navigate(['/organization/company-structure-definition'], {
      queryParams: {
        editcompanyStructuredefinition: row.structureDefinitionId,
      },
    });
  }
  onRowSelect(event) {
    this.router.navigate(['/organization/company-structure-definition'], {
      queryParams: {
        editcompanyStructuredefinition: event.structureDefinitionId,
      },
    });
  }

  exportCompanyStructureDefinition() {
    this.companyService.exportCompanyStructureDefinition().subscribe(
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
            const file = new File([bb], 'CompanyStructureDefinition.xlsx', {
              type: 'application/vnd.ms-excel',
            });
            saveAs(file);
          } catch (err) {
            const textFileAsBlob = new Blob([bb], {
              type: 'application/vnd.ms-excel',
            });
            window.navigator.msSaveBlob(
              textFileAsBlob,
              'CompanyStructureDefinition.xlsx'
            );
          }
        } else {
        }
      },
      (err) => {}
    );
  }

  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }

  async uploadCompanyStructureDefinition() {
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

    await this.companyService
      .uploadCompanyStructureDefinition(this.fileToUpload)
      .then((data) => {
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          // this.fileToUpload = null;
          swal.fire('GOS FINANCIAL', message, 'success').then(() => {
            this.myInput.nativeElement.value = '';
            this.getAllCompanyStructureDefinition();
          });
        } else {
          // this.fileToUpload = null;
          // this.getAllCompanyStructureDefinition();
          swal.fire('GOS FINANCIAL', message, 'error').then(() => {
            this.myInputVariable.nativeElement.value = '';
          });
        }
      })
      .catch((err) => {
        const error = JSON.parse(err);
        const message = error.status.message.friendlyMessage;
        // this.myInputVariable.nativeElement.value = "";
        swal.fire('GOS FINANCIAL', message, 'error').then(() => {
          this.myInput.nativeElement.value = '';
        });
      });
  }

  deleteCompanyStructureDefinition(row) {
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
          __this.companyService
            .deleteCompanyStructureDefinition(row.structureDefinitionId)
            .subscribe((data) => {
              if (data['result'] == true) {
                swal.fire(
                  'GOS FINANCIAL',
                  'User deleted successful.',
                  'success'
                );
                __this.getAllCompanyStructureDefinition();
              } else {
                swal.fire('GOS FINANCIAL', 'Record not deleted', 'error');
              }
            });
        } else {
          swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
      });
  }
  multipleDelete() {
    if (this.selectedCompanyStructureDefinition.length == 0) {
      swal.fire(
        'GOS FINANCIAL',
        'Please select records you want to delete',
        'error'
      );
      return;
    }
    const tempData = this.selectedCompanyStructureDefinition;
    const targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach((el) => {
        const data = {
          targetId: el.structureDefinitionId,
        };
        targetIds.push(el.structureDefinitionId);
      });
    }
    const body = {
      structureDefinitionIds: targetIds,
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
          __this.companyService
            .deleteMultipleCompanyStructureDefinition(body)
            .subscribe(
              (data) => {
                const message = data.status.message.friendlyMessage;
                if (data.status.isSuccessful) {
                  swal.fire('GOS FINANCIAL', message, 'success');
                  this.selectedCompanyStructureDefinition = [];
                  __this.getAllCompanyStructureDefinition();
                } else {
                  swal.fire('GOS FINANCIAL', message, 'error');
                  this.selectedCompanyStructureDefinition = [];
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
  getMultiCompany(value: any) {
    // this.valueSelected = true;
    this.isMultiCompany = value;
  }

  submitCompanyStructureDefinition() {
    const payload = {
      isMultiCompany: Boolean(JSON.parse(this.isMultiCompany)),
      operatingLevel: parseInt(this.operatingLevel),
    };

    this.companyService.updateStructureDefinition(payload).subscribe(
      (data) => {
        if (data.status.isSuccessful == true) {
          swal
            .fire(
              'GOS FINANCIAL',
              data.status.message.friendlyMessage,
              'success'
            )
            .then(() => {
              this.isMultiCompany = '';
              this.operatingLevel = '';
            });
        } else {
          swal.fire(
            'GOS FINANCIAL',
            data.status.message.friendlyMessage,
            'error'
          );
        }
      },
      (err) => {
        swal.fire('GOS FINANCIAL', JSON.stringify(err), 'error');
      }
    );
  }
  getCompStructureDefinition() {
    return this.companyService.getCompStructureDefinition().subscribe(
      (data) => {
        this.isMultiCompany = data.isMultiCompany;
        this.operatingLevel = data.operatingLevel;
      },
      (err) => {}
    );
  }
}
