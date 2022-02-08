import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { LoadingService } from "src/app/services/loading.service";
import { CityService } from "src/app/services/city.service";
import { StateService } from "src/app/services/state.service";
import { CommonService } from "src/app/services/common.service";

@Component({
    selector: "app-city",
    templateUrl: "./city.component.html",
    styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {
    form: FormGroup;
    formTitle: string = "Add City Information";
    stateList: any[];
    constructor(
        public fb: FormBuilder,
        private loadingService: LoadingService,
        private cityService: CityService,
        private stateService: StateService,
        private router: Router,
        private route: ActivatedRoute,
        private commonService: CommonService
    ) {
        this.form = this.fb.group({
            cityId: [0],
            cityCode: ["", Validators.required],
            cityName: ["", Validators.required],
            stateId: ["" ,Validators.required],
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            let cityId = params.id;
            if (cityId != null || cityId != undefined) {
                this.editCity(cityId);
            }
        });
        this. getAllState();
    }


    getAllState() {
        this.loadingService.show();
        this.commonService.getAllState().subscribe(data => {
            this.loadingService.hide();
            this.stateList = data.commonLookups;

            // console.log("Staffs", this.stateInformation);
        });
    }

    editCity(cityId) {
        this.formTitle = "Edit City Information";
        this.loadingService.show();
        this.commonService.getCity(cityId).subscribe(data => {
            this.loadingService.hide();
            let row = data.commonLookups[0];
            this.form = this.fb.group({
                cityId: row.lookupId,
                cityCode: row.code,
                cityName: row.lookupName,
                stateId: row.parentId
            });
        }, err => {
          this.loadingService.hide()
        });
    }

    goBack() {
        this.router.navigate(["/setup/city-list"]);
    }
    submitCityInfo(formObj) {
        this.loadingService.show();
        this.commonService.updateCity(formObj.value).subscribe(
            data => {
                this.loadingService.hide();
              let message = data.status.message.friendlyMessage;
              swal.fire("GOS FINANCIAL", message, "success");
              this.router.navigate(["/setup/city-list"]);
                // if (data["result"] == true) {
                //     swal.fire("GOS FINANCIAL", data["message"], "success");
                //     this.router.navigate(["/setup/city-list"]);
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
    parseValueToInt(value: string) {
      let parsedValue = parseInt(value)
      this.form.patchValue({
        stateId: parsedValue
      })
    }
}
