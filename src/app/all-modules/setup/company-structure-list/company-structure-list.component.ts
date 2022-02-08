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
import { LoadingService } from "src/app/services/loading.service";
import { CompanyService } from "src/app/services/company.service";

@Component({
  selector: "app-company-structure-list",
  templateUrl: "./company-structure-list.component.html",
  providers: [MessageService],
  styleUrls: ['./company-structure-list.component.css'],
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
    this.router.navigate(["/setup/company-structure"]);
  }

  getAllCompanyStructure() {
    this.loadingService.show();
    this.companyService.getAllCompanyStructure().subscribe(
      data => {
        this.loadingService.hide();
        this.companyStructureList = data["companyStructures"];
      },
      err => {
        this.loadingService.hide();
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
    console.log("TEst", row);
  }
  exportCompanyStructure() {
    this.loadingService.show();
    this.companyService.exportCompanyStructure().subscribe(response => {
      this.loadingService.hide();
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
      this.loadingService.hide()
    });
  }

  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }

 async uploadCompanyStructure() {
    if (this.fileToUpload == null) {
      return swal.fire(
        "Error",
        "Please select upload document to continue",
        "error"
      );
    }
    if (
      this.fileToUpload.type !=
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      return swal.fire("Error", "Only excel files allowed", "error");
    }
    this.loadingService.show();
    await this.companyService
      .uploadCompanyStructure(this.fileToUpload)
      .then(data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.fileToUpload = null;
          this.getAllCompanyStructure();
          this.fileInputVariable.nativeElement.value = "";
          swal.fire("Success", message, "success");
        } else {
          this.loadingService.hide();
          this.fileToUpload = null;
          this.getAllCompanyStructure();
          this.fileInputVariable.nativeElement.value = "";
          swal.fire("Error", message, "error");
        }
      })
      .catch(err => {
        this.loadingService.hide();
        const error = JSON.parse(err);
        const message = error.message.friendlyMessage;
        this.fileInputVariable.nativeElement.value = "";
        swal.fire("Error", message, "error");
      });
  }
  deleteCompanyStructure(row) {
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

          __this.companyService
            .deleteCompanyStructure(row.companyStructureId)
            .subscribe(data => {
              __this.loadingService.hide();
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

          __this.companyService.deleteMultipleCompanyStructure(body).subscribe(
            data => {
              __this.loadingService.hide();
              let message = data.status.message.friendlyMessage;
              if (data.status.isSuccessful) {
                swal.fire("GOS FINANCIAL", message, "success");
                __this.getAllCompanyStructure();
              } else {
                swal.fire("GOS FINANCIAL", message, "error");
              }
            },
            err => {
              this.loadingService.hide();
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
    this.loadingService.show();
    this.companyService.getCompanyStructureChart().subscribe(
      data => {
        this.loadingService.hide();
        this.displayChart = true;
        this.data = data["result"];
        // console.log(this.data1, this.data)
      },
      err => {
        this.loadingService.hide();
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
