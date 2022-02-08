import swal from "sweetalert2";
import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { saveAs } from "file-saver";
import { LoadingService } from "src/app/services/loading.service";
import { CommonService } from "src/app/services/common.service";
import { StateService } from "src/app/services/state.service";

@Component({
  selector: "app-state-list",
  templateUrl: "./state-list.component.html",
  styleUrls:['./state-list.component.css']
})
export class StateListComponent implements OnInit {
  @ViewChild("fileInput") fileInput: ElementRef;
  stateInformation: any[] = [];
  selectedstateInformation: any[];
  viewHeight: any = "600px";
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
        field: 'code'
      },
      {
        header: 'lookupName',
        field: 'lookupName'
      }
    ]
    this.getAllState();
  }

  showAddNew() {
    this.router.navigate(["/setup/state"]);
  }

  getAllState() {
    this.loadingService.show();
    this.commonService.getAllState().subscribe(
      data => {
        this.loadingService.hide();
        this.stateInformation = data["commonLookups"];

        // console.log("Staffs", this.stateInformation);
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  editState(row) {
    this.router.navigate(["/setup/state"], {
      queryParams: { editstate: row.lookupId }
    });
  }
  deleteState(row) {
    const __this = this;
    swal.fire({
        // title: "Are you sure you want to delete user?",
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

          __this.stateService.deleteState(row.stateId).subscribe(data => {
            __this.loadingService.hide();
            if (data["result"] == true) {
              swal.fire("GOS FINANCIAL", "User deleted successful.", "success");
              __this.getAllState();
            } else {
              swal.fire("GOS FINANCIAL", "Record not deleted", "error");
            }
          });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
  exportStates() {
    this.loadingService.show();
    this.stateService.exportStatesList().subscribe(
      response => {
        this.loadingService.hide();
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
            const file = new File([bb], "States.xlsx", {
              type: "application/vnd.ms-excel"
            });
            saveAs(file);
          } catch (err) {
            const textFileAsBlob = new Blob([bb], {
              type: "application/vnd.ms-excel"
            });
            window.navigator.msSaveBlob(textFileAsBlob, "States.xlsx");
          }
        }
      },
      err => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire("Error", message, "error");
      }
    );
  }
  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }
  async uploadStates() {
    if (this.fileToUpload == null) {
      return swal.fire("Error", "Please select upload document to continue", "error");
    }
    if (
      this.fileToUpload.type !=
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      return swal.fire("Error", "Only excel files allowed", "error");
    }
    this.loadingService.show();
    await this.commonService
      .uploadStatesList(this.fileToUpload)
      .then(data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.fileToUpload = null;
          this.getAllState();
          this.fileInput.nativeElement.value = "";
          swal.fire("Success", message, "success");
        } else {
          this.fileToUpload = null;
          this.fileInput.nativeElement.value = "";
          swal.fire("Error", message, "error");
        }
      })
      .catch(err => {
        this.loadingService.hide();
        this.fileInput.nativeElement.value = "";
        let error = JSON.parse(err);
        const message = error.status.message.friendlyMessage;
        swal.fire("Error", message, "error");
      });
  }
  multipleDelete() {
    if (this.selectedstateInformation.length == 0) {
      swal.fire("Error", "Please select records you want to delete", "error");
      return;
    }
    let tempData = this.selectedstateInformation;
    let targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        let data = {
          targetId: el.lookupId
        };
        targetIds.push(el.lookupId);
      });
    }
    let body = {
      itemsId: targetIds
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

          __this.stateService.multiDeleteStates(body).subscribe(
            data => {
              __this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.status.isSuccessful) {
                swal.fire("Success", message, "success");
                this.selectedstateInformation = [];
                __this.getAllState();
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
