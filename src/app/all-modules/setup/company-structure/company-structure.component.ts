import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { CommonService } from "src/app/services/common.service";
import { CompanyService } from "src/app/services/company.service";
import { LoadingService } from "src/app/services/loading.service";
import { StaffInfoService } from "src/app/services/staff-info.service";
import swal from "sweetalert2";

@Component({
  selector: "app-company-structure",
  templateUrl: "./company-structure.component.html"
})
export class CompanyStructureComponent implements OnInit {
  form: FormGroup;
  formTitle: string = "Add Company Structure";
  companyStructureList: any[] = [];
  companyStructureDefinitionList: any[] = [];
  filteredCompanyStructure: any[] = [];
  countries: any[] = [];
  staffs: any[] = [];
  file: any;
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private companyService: CompanyService,
    private staffInfoService: StaffInfoService,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      companyStructureId: [0],
      name: [""],
      structureTypeId: [""],
      countryId: [""],
      address: [""],
      headStaffId: [0],
      parentCompanyID: [0],
      companyId: [0],
      code: [""],
      address1: [""],
      address2: [""],
      telephone: [""],
      fax: [""],
      email: [""],
      registrationNumber: [""],
      taxId: [""],
      noOfEmployees: [0],
      webSite: [""],
      logo: [""],
      // logoType: [""],
      city: [0],
      state: [0],

      currencyId: [0],
      reportCurrencyId: [0],
      applyRegistryTemplate: [""],
      postalCode: [""],
      isMultiCompany: [false],
      description: [""],
      subsidairy_Level: [0],
      registryTemplate: [""],
      fsTemplateName: [""],

    });
  }

  ngOnInit() {
    this.getAllCountry();
    this.getAllStaff();
    this.getAllCompanyStructure();
    this.getAllCompanyStructureDefinition();
    this.route.queryParams.subscribe(params => {
      let companyStructureId = params["editcompanyStructure"];
      if (companyStructureId != null || companyStructureId != undefined) {
        this.editCompanyStructure(companyStructureId);
      }
    });
  }

  getAllCountry() {
    this.loadingService.show();
    this.commonService.getAllCountry().subscribe(
      data => {
        this.loadingService.hide();
        this.countries = data.commonLookups;
      },
      err => {
        console.log(err);
        this.loadingService.hide();
      }
    );
  }
  getAllStaff() {
    this.loadingService.show();
    this.staffInfoService.getAllStaff().subscribe(data => {
      this.loadingService.hide();
      this.staffs = data["staff"];
    }, err => {
      this.loadingService.hide()
    });
  }
  getAllCompanyStructureDefinition() {
    this.loadingService.show();
    this.companyService.getAllCompanyStructureDefinition().subscribe(
      data => {
        this.loadingService.hide();
        this.companyStructureDefinitionList =
          data["companyStructureDefinitions"];
      },
      err => {
        this.loadingService.hide();
        console.log(err);
      }
    );
  }

  getAllCompanyStructure() {
    this.loadingService.show();
    this.companyService.getAllCompanyStructure().subscribe(
      data => {
        this.loadingService.hide();
        this.companyStructureList = data.companyStructures;
      },
      err => {
        console.log(err);
        this.loadingService.hide();
      }
    );
  }

  onStructureDefinitionChanged(value) {
    this.loadingService.show();
    this.companyService.getCompanyStructureByDefinition(value).subscribe(
      data => {
        this.loadingService.hide();
        this.filteredCompanyStructure = data["companyStructures"];
      },
      err => {
        console.log(err);
        this.loadingService.hide();
      }
    );
    this.parseValueToInt(value, 1);
  }

  editCompanyStructure(companyStructureId) {
    this.formTitle = "Edit Company Structure";
    this.loadingService.show();
    this.companyService
      .getCompanyStructure(companyStructureId)
      .subscribe(data => {
        this.loadingService.hide();
        let row = data.companyStructures[0];
        this.form = this.fb.group({
          companyStructureId: [row.companyStructureId],
          name: [row.name],
          structureTypeId: [row.structureTypeId],
          countryId: [row.countryId],
          address: [row.address],
          headStaffId: [row.headStaffId],
          parentCompanyID: [row.parentCompanyID],
          companyId: [row.companyId],
          code: [row.code],
          address1: [row.address1],
          address2: [row.address2],
          telephone: [row.telephone],
          fax: [row.fax],
          email: [row.email],
          registrationNumber: [row.registrationNumber],
          taxId: [row.taxId],
          noOfEmployees: [row.noOfEmployees],
          webSite: [row.webSite],
          logo: [row.logo],
          logoType: [row.logoType],
          city: [row.city],
          state: [row.state],
          currencyId: [row.currencyId],
          reportCurrencyId: [row.reportCurrencyId],
          applyRegistryTemplate: [row.applyRegistryTemplate],
          postalCode: [row.postalCode],
          description: [row.description],
          registryTemplate: [row.registryTemplate],
          fsTemplateName: [row.fsTemplateName],
        });
        this.onStructureDefinitionChanged(row.structureTypeId);
      });
  }

  goBack() {
    this.router.navigate(["/setup/company-structure-list"]);
  }
  submitCompanyStructure(formObj) {
    const payload = formObj.value;
    payload.isMultiCompany = false;
    this.loadingService.show();
    this.companyService.addUpdateCompanyStructure(this.file, payload, this.file).then(
      data => {
        this.loadingService.hide();
        let message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("Success", message, "success");
          this.router.navigate(["/organization/company-structure-list"]);
        } else {
          swal.fire("Error", message, "error");
        }
        // if (data["result"] == true) {
        //     swal.fire("GOS FINANCIAL", data["message"], "success");
        //     this.router.navigate(["/organization/company-structure-list"]);
        // } else {
        //     swal.fire("GOS FINANCIAL", data["message"], "error");
        // }
      },
    ).catch(err => {
      this.loadingService.hide();
      console.log(err);
      let error = JSON.parse(err);
      const message = error.status.message.friendlyMessage;
      swal.fire("Error", message, "error");
    });
  }
  parseValueToInt(value: string, num) {
    let parsedValue = parseInt(value);
    if (num == 1) {
      this.form.patchValue({
        structureTypeId: parsedValue
      });
    }
    if (num == 2) {
      this.form.patchValue({
        countryId: parsedValue
      });
    }
    if (num == 3) {
      this.form.patchValue({
        parentCompanyID: parsedValue
      });
    }
    if (num == 4) {
      this.form.patchValue({
        headStaffId: parsedValue
      });
    }
  }
}
