import { MessageService } from "primeng/api";
import { saveAs } from "file-saver";
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef
} from "@angular/core";
import { Router } from "@angular/router";
import swal from "sweetalert2";
import { TreeNode } from "primeng/api";
import { Location } from "@angular/common";
import { CompanyService } from "src/app/services/company.service";
import { LoadingService } from "src/app/services/loading.service";

@Component({
  selector: "app-company-structure-list",
  templateUrl: "./company-structure-list.component.html",
  providers: [MessageService],
  styles: [
    `
      .company.ui-organizationchart
        .ui-organizationchart-node-content.ui-person {
        padding: 0;
        border: 0 none;
      }

      .node-header,
      .node-content {
        padding: 0.5em 0.7em;
      }

      .node-header {
        background-color: #495ebb;
        color: #ffffff;
      }

      .node-content {
        text-align: center;
        border: 1px solid #495ebb;
      }

      .node-content img {
        border-radius: 50%;
      }

      .department-cfo {
        background-color: #7247bc;
        color: #ffffff;
      }

      .department-coo {
        background-color: #a534b6;
        color: #ffffff;
      }

      .department-cto {
        background-color: #e9286f;
        color: #ffffff;
      }

      .ui-person .ui-node-toggler {
        color: #495ebb !important;
      }

      .department-cto .ui-node-toggler {
        color: #8a0a39 !important;
      }
    `
  ],
  encapsulation: ViewEncapsulation.None
})
export class CompanyStructureListComponent implements OnInit {
  @ViewChild("fileInput") fileInputVariable: ElementRef;
  fileToUpload: File;
  companyStructureList: any[] = [];
  selectedCompanyStructure: any[] = [];
  cols: any[];
  viewHeight: any = "600px";
  displayChart: boolean = false;
  data1: TreeNode[];
  selectedNode: TreeNode;
  data: TreeNode[];
  constructor(
    private messageService: MessageService,
    private loadingService: LoadingService,
    private companyService: CompanyService,
    private router: Router,
    private _location: Location
  ) {}

  ngOnInit() {
    this.cols = [
      { field: "name", header: "name" },
      { field: "structureTypeName", header: "structureTypeName" },
      { field: "headStaffName", header: "headStaffName" },
      { field: "countryName", header: "countryName" },
      { field: "parentCompanyID", header: "parentCompanyID" }
    ];
    this.getAllCompanyStructure();
    this.data = [
      {
        label: "CEO",
        type: "person",
        styleClass: "ui-person",
        expanded: true,
        data: { name: "Walter White", avatar: "walter.jpg" },
        children: [
          {
            label: "CFO",
            type: "person",
            styleClass: "ui-person",
            expanded: true,
            data: { name: "Saul Goodman", avatar: "saul.jpg" },
            children: [
              {
                label: "Tax",
                styleClass: "department-cfo"
              },
              {
                label: "Legal",
                styleClass: "department-cfo"
              }
            ]
          },
          {
            label: "COO",
            type: "person",
            styleClass: "ui-person",
            expanded: true,
            data: { name: "Mike E.", avatar: "mike.jpg" },
            children: [
              {
                label: "Operations",
                styleClass: "department-coo"
              }
            ]
          },
          {
            label: "CTO",
            type: "person",
            styleClass: "ui-person",
            expanded: true,
            data: { name: "Jesse Pinkman", avatar: "jesse.jpg" },
            children: [
              {
                label: "Development",
                styleClass: "department-cto",
                expanded: true,
                children: [
                  {
                    label: "Analysis",
                    styleClass: "department-cto"
                  },
                  {
                    label: "Front End",
                    styleClass: "department-cto"
                  },
                  {
                    label: "Back End",
                    styleClass: "department-cto"
                  }
                ]
              },
              {
                label: "QA",
                styleClass: "department-cto"
              },
              {
                label: "R&D",
                styleClass: "department-cto"
              }
            ]
          }
        ]
      }
    ];
  }

  showAddNew() {
    this.router.navigate(["/organization/company-structure"]);
  }

  getAllCompanyStructure() {

    this.companyService.getAllCompanyStructure().subscribe(
      data => {

        this.companyStructureList = data["companyStructures"];
      },
      err => {

      }
    );
  }
  editCompanyStructure(row) {
    this.router.navigate(["/organization/company-structure"], {
      queryParams: { editcompanyStructure: row.companyStructureId }
    });
  }
  onRowSelect(event) {
    this.router.navigate(["/organization/company-structure"], {
      queryParams: { editcompanyStructure: event.companyStructureId }
    });
  }
  rowClicked(row: any): void {

  }
  exportCompanyStructure() {

    this.companyService.exportCompanyStructure().subscribe(response => {

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
          var file = new File([bb], "CompanyStructure.xlsx", {
            type: "application/vnd.ms-excel"
          });
          saveAs(file);
        } catch (err) {
          var textFileAsBlob = new Blob([bb], {
            type: "application/vnd.ms-excel"
          });
          window.navigator.msSaveBlob(textFileAsBlob, "CompanyStructure.xlsx");
        }
      }
    }, err => {

    });
  }

  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }

 async uploadCompanyStructure() {
    if (this.fileToUpload == null) {
      return swal.fire(
        "GOS FINANCIAL",
        "Please select upload document to continue",
        "error"
      );
    }
    if (
      this.fileToUpload.type !=
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      return swal.fire("GOS FINANCIAL", "Only excel files allowed", "error");
    }

    await this.companyService
      .uploadCompanyStructure(this.fileToUpload)
      .then(data => {

        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.fileToUpload = null;
          this.getAllCompanyStructure();
          this.fileInputVariable.nativeElement.value = "";
          swal.fire("GOS FINANCIAL", message, "success");
        } else {

          this.fileToUpload = null;
          this.getAllCompanyStructure();
          this.fileInputVariable.nativeElement.value = "";
          swal.fire("GOS FINANCIAL", message, "error");
        }
      })
      .catch(err => {

        const error = JSON.parse(err);
        const message = error.status.message.friendlyMessage;
        this.fileInputVariable.nativeElement.value = "";
        swal.fire("GOS FINANCIAL", message, "error");
      });
  }
  deleteCompanyStructure(row) {
    const __this = this;
    swal
      .fire({
        title: "Are you sure you want to delete record?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {


          __this.companyService
            .deleteCompanyStructure(row.companyStructureId)
            .subscribe(data => {

              if (data["result"] == true) {
                swal.fire(
                  "GOS FINANCIAL",
                  "User deleted successful.",
                  "success"
                );
                __this.getAllCompanyStructure();
              } else {
                swal.fire("GOS FINANCIAL", "Record not deleted", "error");
              }
            });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
  multipleDelete() {
    if (this.selectedCompanyStructure.length === 0) {
      swal.fire(
        "GOS FINANCIAL",
        "Please select records you want to delete",
        "error"
      );
      return;
    }
    let tempData = this.selectedCompanyStructure;
    let targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        let data = el.companyStructureId;
        targetIds.push(data);
      });
    }
    let body = {
      companyStructureIds: targetIds
    };
    const __this = this;
    swal
      .fire({
        title: "Are you sure you want to delete record?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {


          __this.companyService.deleteMultipleCompanyStructure(body).subscribe(
            data => {

              let message = data.status.message.friendlyMessage;
              if (data.status.isSuccessful) {
                swal.fire("GOS FINANCIAL", message, "success");
                __this.getAllCompanyStructure();
              } else {
                swal.fire("GOS FINANCIAL", message, "error");
              }
            },
            err => {

              let message = err.status.message.friendlyMessage;
              swal.fire("GOS FINANCIAL", message, "error");
            }
          );
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
  viewOrganizationChart() {

    this.companyService.getCompanyStructureChart().subscribe(
      data => {

        this.displayChart = true;
        this.data = data["result"];

      },
      err => {

      }
    );
  }
  goback() {
    this._location.back();
  }
  onNodeSelect(event) {
    this.messageService.add({
      severity: "success",
      summary: "Node Selected",
      detail: event.node.label
    });
  }
}
