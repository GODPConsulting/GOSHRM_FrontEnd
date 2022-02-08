import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CompanyService } from 'src/app/services/company.service';
import { LoadingService } from 'src/app/services/loading.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-company-structure-definition',
  templateUrl: './company-structure-definition.component.html',
})
export class CompanyStructureDefinitionComponent implements OnInit {
  form: FormGroup;
  formTitle: string = "Add Organisation Structure Definition";
  constructor(
      public fb: FormBuilder,
      private loadingService: LoadingService,
      private companyService: CompanyService,
      private router: Router,
      private route: ActivatedRoute
  ) {


      this.form = this.fb.group({
        structureDefinitionId: [0],
        definition: ["", Validators.required],
        description: ["", Validators.required],
        structureLevel: ["", Validators.required],
      });
  }

  ngOnInit() {
      this.route.queryParams.subscribe(params => {
          let structureDefinitionId = params["editcompanyStructuredefinition"];
          if (structureDefinitionId != null || structureDefinitionId != undefined) {
              this.editCompanyStructureDefinition(structureDefinitionId);
          }
      });
  }

  editCompanyStructureDefinition(structureDefinitionId) {
      this.formTitle = "Edit Organisation Structure Definition";
      this.loadingService.show();
      this.companyService
          .getCompanyStructureDefinition(structureDefinitionId)
          .subscribe(data => {
              this.loadingService.hide();
              let row = data["companyStructureDefinitions"][0];
              this.form = this.fb.group({
                structureDefinitionId: [row.structureDefinitionId],
                definition: [row.definition],
                description: [row.description],
                structureLevel: [row.structureLevel],
              });
          }, err => {
            this.loadingService.hide()
          });
  }

  goBack() {
      this.router.navigate(["/setup/company-structure-definition-list"]);
  }
  submitCompanyStructureDefinition(formObj) {
    const payload = formObj.value;
    // payload.companyId = 1;
    // payload.isMultiCompany = false;
    // payload.operatingLevel = 0;
    // payload.structureLevel = 0;
      this.loadingService.show();
      this.companyService.addUpdateCompanyStructureDefinition(payload).subscribe(
          data => {
              this.loadingService.hide();
              let message = data.status.message.friendlyMessage;
                  swal.fire("GOS FINANCIAL", message, "success");
                  this.router.navigate(["/organization/company-structure-definition-list"]);
          },
          err => {
              this.loadingService.hide();
              let error = err.status.message.friendlyMessage;
              swal.fire("GOS FINANCIAL", error, "error");
          }
      );
  }
}
