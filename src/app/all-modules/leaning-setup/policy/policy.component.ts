import { Component, OnInit } from "@angular/core";
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Subscription } from "rxjs";
import { LmsService } from "src/app/services/lms.service";
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
   public profile: any;
   public companyId: number;
   public htmlContent = ``;
   public config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '8rem',
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
    private _lmsService: LmsService
   ) {}

  ngOnInit(): void {
    this.profile = JSON.parse(localStorage.getItem('userDetails'));
    this.companyId = this.profile.companyId;
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
      companyId: 0,
      policy_Content: ''
    }
    payload.companyId = this.companyId;
    payload.policy_Content = this.htmlContent;
    console.log(payload, this.htmlContent);
    this.sub.add(
      this._lmsService.updateCompanyPolicy(payload).subscribe({
        next: (res) => {
          // this.isFetchingCompanyInfo = false;
          console.log(res);
          if (res.status.isSuccessful) {
            swal.fire("GOSHRM", res.status.message.friendlyMessage).then(() => {
              this.canEditPolicy = !this.canEditPolicy
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
