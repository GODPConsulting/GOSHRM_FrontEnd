import swal from "sweetalert2";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { saveAs } from "file-saver";
import { LoadingService } from "src/app/services/loading.service";
import { CurrencyService } from "src/app/services/currency.service";
import { CommonService } from "src/app/services/common.service";

@Component({
  selector: "app-currency-list",
  templateUrl: "./currency-list.component.html",
  styleUrls: ['./currency-list.component.css']
})
export class CurrencyListComponent implements OnInit {
  @ViewChild("fileInput") fileInput: any;
  fileToUpload: File;
  currencyInformation: any[] = [];
  selectedcurrencyInformation: any[];
  viewHeight: any = "600px";
  cols: any[] = [];
  constructor(
    private loadingService: LoadingService,
    private currencyService: CurrencyService,
    private router: Router,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.cols = [
      {
        header: "code",
        field: "code"
      },
      {
        header: "lookupName",
        field: "lookupName"
      }
    ];
    this.getAllCurrency();
  }

  showAddNew() {
    this.router.navigate(["/setup/currency"]);
  }

  getAllCurrency() {
    this.loadingService.show();
    this.commonService.getAllCurrency().subscribe(
      data => {
        this.loadingService.hide();
        this.currencyInformation = data.commonLookups;

        // console.log("Staffs", this.currencyInformation);
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  editCurrency(row) {
    this.router.navigate(["/setup/currency"], {
      queryParams: { id: row.lookupId }
    });
  }
  deleteCurrency(row) {
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

          __this.currencyService
            .deleteCurrency(row.currencyId)
            .subscribe(data => {
              __this.loadingService.hide();
              if (data["result"] == true) {
                swal.fire(
                  "GOS FINANCIAL",
                  "User deleted successful.",
                  "success"
                );
                __this.getAllCurrency();
              } else {
                swal.fire("GOS FINANCIAL", "Record not deleted", "error");
              }
            });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
  exportCurrencies() {
    this.loadingService.show();
    this.currencyService.exportCurrencies().subscribe(
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
            const file = new File([bb], "Currencies.xlsx", {
              type: "application/vnd.ms-excel"
            });
            saveAs(file);
          } catch (err) {
            const textFileAsBlob = new Blob([bb], {
              type: "application/vnd.ms-excel"
            });
            window.navigator.msSaveBlob(textFileAsBlob, "Currencies.xlsx");
          }
        }
      },
      err => {
        this.loadingService.hide();
        const message = err.message.friendlyMessage;
        swal.fire("Error", message, "error");
      }
    );
  }

  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }

  async uploadCurrencies() {
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
    await this.currencyService
      .uploadCurrencies(this.fileToUpload)
      .then(data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.fileToUpload = null;
          this.getAllCurrency();
          this.fileInput.nativeElement.value = "";
          swal.fire("Success", message, "success");
        } else {
          this.fileInput.nativeElement.value = "";
          swal.fire("Error", message, "error");
        }
      })
      .catch(err => {
        let error = JSON.parse(err);
        const message = error.status.message.friendlyMessage;
        swal.fire("Error", message, "error");
        this.loadingService.hide();
      });
  }
  multipleDelete() {
    if (this.selectedcurrencyInformation.length == 0) {
      return swal.fire(
        "Error",
        "Please select records you want to delete",
        "error"
      );
    }
    const tempData = this.selectedcurrencyInformation;
    const ids = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        ids.push(el.lookupId);
      });
    }
    const body = { itemsId: ids };
    // const __this = this;
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
      .then(
        result => {
          if (result.value) {
            this.loadingService.show();

            this.commonService.multipleDeleteCurrency(body).subscribe(data => {
              this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.status.isSuccessful) {
                swal.fire("Success", message, "success");
                this.selectedcurrencyInformation = [];
                this.getAllCurrency();
              } else {
                swal.fire("Error", message, "error");
              }
            });
          } else {
            swal.fire("Error", "Cancelled", "error");
          }
        },
        err => {
          this.loadingService.hide();
          const message = err.status.message.friendlyMessage;
          swal.fire("Error", message, "error");
        }
      );
  }
}
