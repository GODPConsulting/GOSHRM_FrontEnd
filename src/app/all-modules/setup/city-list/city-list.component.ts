import swal from "sweetalert2";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { saveAs } from "file-saver";
import { LoadingService } from "src/app/services/loading.service";
import { CityService } from "src/app/services/city.service";
import { CommonService } from "src/app/services/common.service";

@Component({
  selector: "app-city-list",
  templateUrl: "./city-list.component.html",
  styleUrls: ['./city-list.component.css']
})
export class CityListComponent implements OnInit {
  @ViewChild("fileInput") fileInput: ElementRef;
  cityInformation: any[] = [];
  selectedcityInformation: any[];
  viewHeight: any = "600px";
  cols: any[] = [];
  private fileToUpload: File;
  constructor(
    private loadingService: LoadingService,
    private cityService: CityService,
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
    this.getAllCity();
  }

  showAddNew() {
    this.router.navigate(["/setup/city"]);
  }

  getAllCity() {
    this.loadingService.show();
    this.commonService.getAllCity().subscribe(
      data => {
        this.loadingService.hide();
        this.cityInformation = data.commonLookups;

        // console.log("Staffs", this.cityInformation);
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  editCity(row) {
    this.router.navigate(["/setup/city"], {
      queryParams: { id: row.lookupId }
    });
  }
  deleteCity(row) {
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

          __this.cityService.deleteCity(row.cityId).subscribe(data => {
            __this.loadingService.hide();
            if (data["result"] == true) {
              swal.fire("GOS FINANCIAL", "User deleted successful.", "success");
              __this.getAllCity();
            } else {
              swal.fire("GOS FINANCIAL", "Record not deleted", "error");
            }
          });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
  exportCities() {
    this.loadingService.show();
    this.cityService.exportCity().subscribe(response => {
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
          const file = new File([bb], "Cities.xlsx", {
            type: "application/vnd.ms-excel"
          });
          saveAs(file);
        } catch (err) {
          const textFileAsBlob = new Blob([bb], {
            type: "application/vnd.ms-excel"
          });
          window.navigator.msSaveBlob(textFileAsBlob, "Cities.xlsx");
        }
      }
    }, err => {
      this.loadingService.hide();
      const message = err.status.message.friendlyMessage;
      swal.fire('Error', message, 'error')
    });
  }
  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }
  async uploadCities() {
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
    await this.cityService
      .uploadCity(this.fileToUpload)
      .then(data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("Success", message, "success");
          this.fileToUpload = null;
          this.fileInput.nativeElement = "";
          this.getAllCity();
        } else {
          swal.fire("Error", message, "error");
          this.fileInput.nativeElement = "";
        }
      })
      .catch(err => {
        this.loadingService.hide();
        let error = JSON.parse(err);
        console.log(error)
        const message = error.status.message.friendlyMessage;
        swal.fire("Error", message, "error");

      });
  }
  multipleDelete() {
    if (this.selectedcityInformation.length == 0) {
      return swal.fire(
        "Error",
        "Please select records you want to delete",
        "error"
      );

    }
    let tempData = this.selectedcityInformation;
    let targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        let data = {
          targetId: el.cityId
        };
        targetIds.push(el.lookupId);
      });
    }
    let body = {
      itemsId: targetIds
    };
    const __this = this;
    swal .fire({
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
          // console.log(body);
          // return;
          __this.loadingService.show();

          __this.cityService.multiDeleteCity(body).subscribe(
            data => {
              __this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.status.isSuccessful) {
                swal.fire("Success", message, "success");
                this.selectedcityInformation = [];
                __this.getAllCity();
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
