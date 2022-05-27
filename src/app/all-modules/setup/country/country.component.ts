import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { LoadingService } from "src/app/services/loading.service";
import { CountriesService } from "src/app/services/countries.service";
import { CommonService } from "src/app/services/common.service";

@Component({
    selector: "app-country",
    templateUrl: "./country.component.html",
    styleUrls: ["./country.component.css"],
})
export class CountryComponent implements OnInit {
    form: FormGroup;
    formTitle: string = "Add Country Information";
    constructor(
        public fb: FormBuilder,
        private loadingService: LoadingService,
        private countryService: CountriesService,
        private router: Router,
        private route: ActivatedRoute,
        private commonService: CommonService
    ) {
        this.form = this.fb.group({
            countryId: [0],
            countryCode: ["", Validators.required],
            countryName: ["", Validators.required],
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            let countryId = params.id;
            if (countryId != null || countryId != undefined) {
                this.editCountry(countryId);
            }
        });
    }

    editCountry(countryId) {
        this.formTitle = "Edit Country Information";

        this.commonService.getCountry(countryId).subscribe(data => {

            let row = data.commonLookups[0];
            this.form = this.fb.group({
                countryId: row.lookupId,
                countryCode: row.code,
                countryName: row.lookupName,
            });
        }, err => {

        });
    }

    goBack() {
        this.router.navigate(["/setup/country-list"]);
    }
    submitCountryInfo(formObj) {

        this.commonService.updateCountry(formObj.value).subscribe(
            data => {

                let message = data.status.message.friendlyMessage;
                swal.fire("GOS FINANCIAL", message, "success");
                this.router.navigate(["/setup/country-list"]);
                // if (data["result"] == true) {
                //     swal.fire("GOS FINANCIAL", data["message"], "success");
                //     this.router.navigate(["/setup/country-list"]);
                // } else {
                //     swal.fire("GOS FINANCIAL", data["message"], "error");
                // }
            },
            err => {

                let message = err.status.message.friendlyMessage;
                swal.fire("GOS FINANCIAL", message, "error");
            }
        );
    }
}
