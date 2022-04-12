import { Component, OnInit } from "@angular/core";
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Subscription } from "rxjs";
import { LmsService } from "src/app/services/lms.service";
import { LoadingService } from "src/app/services/loading.service";
import swal from 'sweetalert2';
declare const $: any;

@Component({
  selector: "app-policy",
  templateUrl: "./policy.component.html",
  styleUrls: ["./policy.component.css"],
})

export class PolicyComponent implements OnInit {
  public sub: Subscription = new Subscription();
   public spinner: boolean = false;
   public canEditPolicy:  boolean = false;
   public policyInfo: any;
   public profile: any;
   public companyId: number;
   public policyId: number = 0;
   public htmlContent = ``;
   public config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '45rem',
    minHeight: '10rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
      ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };

  constructor(
    private _lmsService: LmsService,
    private _loading: LoadingService
   ) {}

  ngOnInit(): void {
    this.profile = JSON.parse(localStorage.getItem('userDetails'));
    this.companyId = this.profile.companyId;
    this.getPolicyInfo();
  }

  getPolicyInfo() {
    this._loading.show();
    this.sub.add(
      this._lmsService.getPolicySetup(this.companyId).subscribe({
        next: (res) => {
          // this.isFetchingCompanyInfo = false;
          this._loading.hide();
          this.policyInfo = res['policySetupTypes'][0];
          this.policyId = this.policyInfo?.policyId;
          this.htmlContent = this.policyInfo.policy_Content
          console.log(res);
        },
        error: (error) => {
          // this.isFetchingCompanyInfo = false;
          console.log(error);
        },
      })
    );
  }

  openPolicyModal() {
    $("#policy-modal").modal("show");
  }

  closePolicyModal() {
    $("#policy-modal").modal("hide");
  }

  editPolicy() {
    this.canEditPolicy = !this.canEditPolicy;
  }

  updatePolicySetup() {
    const payload = {
      companyId: this.companyId,
      policy_Content: this.htmlContent,
      policyId: this.policyId
    }
    console.log(payload);
    this.sub.add(
      this._lmsService.updateCompanyPolicy(payload).subscribe({
        next: (res) => {
          // this.isFetchingCompanyInfo = false;
          console.log(res);
          if (res.status.isSuccessful) {
            swal.fire("GOSHRM", res.status.message.friendlyMessage).then(() => {
              this.canEditPolicy = !this.canEditPolicy;
              this.policyInfo.policy_Content = this.htmlContent
            });
          } else {
            swal.fire("GOSHRM", res.status.message.friendlyMessage);
          }
        },
        error: (error) => {
          // this.isFetchingCompanyInfo = false;
          console.log(error);
          swal.fire("GOSHRM", "error");
        },
      })
    );
  }
  
}
