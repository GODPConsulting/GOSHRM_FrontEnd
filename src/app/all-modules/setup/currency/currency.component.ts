import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { LoadingService } from "src/app/services/loading.service";
import { CurrencyService } from "src/app/services/currency.service";
import { CommonService } from "src/app/services/common.service";

@Component({
  selector: "app-currency",
  templateUrl: "./currency.component.html",
  styleUrls: ['./currency.component.css']
})
export class CurrencyComponent implements OnInit {
  checkedbaseCurrency: boolean = false;
  checkedinUse: boolean = false;
  form: FormGroup;
  formTitle: string = "Add Currency Information";
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private currencyService: CurrencyService,
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService
  ) {
    this.form = this.fb.group({
      currencyId: [0],
      currencyCode: ["", Validators.required],
      currencyName: ["", Validators.required],
      baseCurrency: false,
      inuse: false
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      let currencyId = params.id;
      if (currencyId != null || currencyId != undefined) {
        this.editCurrency(currencyId);
      }
    });
  }

  editCurrency(currencyId) {
    this.formTitle = "Edit Currency Information";
    this.loadingService.show();
    this.commonService.getCurrency(currencyId).subscribe(data => {
      this.loadingService.hide();
      let row = data.commonLookups[0];
      this.form = this.fb.group({
        currencyId: row.lookupId,
        currencyCode: row.code,
        currencyName: row.lookupName,
        baseCurrency: row.baseCurrency,
        inuse: row.active
      });
    });
  }

  goBack() {
    this.router.navigate(["/setup/currency-list"]);
  }
  submitCurrencyInfo(formObj) {
    this.loadingService.show();
    this.commonService.updateCurrency(formObj.value).subscribe(
      data => {
        this.loadingService.hide();
        let message = data.status.message.friendlyMessage;
        swal.fire("GOS FINANCIAL", message, "success");
        this.router.navigate(["/setup/currency-list"]);
        // if (data["result"] == true) {
        //     swal.fire("GOS FINANCIAL", data["message"], "success");
        //     this.router.navigate(["/setup/currency-list"]);
        // } else {
        //     swal.fire("GOS FINANCIAL", data["message"], "error");
        // }
      },
      err => {
        this.loadingService.hide();
        let message = err.status.message.friendlyMessage;
        swal.fire("GOS FINANCIAL", message, "error");
      }
    );
  }
}
