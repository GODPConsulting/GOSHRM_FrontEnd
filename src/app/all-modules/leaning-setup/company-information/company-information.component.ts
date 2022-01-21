import { Component, HostListener, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { LmsService } from "src/app/services/lms.service";
import { LoadingService } from "src/app/services/loading.service";
import swal from 'sweetalert2';
declare const $: any;

@Component({
  selector: "app-company-information",
  templateUrl: "./company-information.component.html",
  styleUrls: ["./company-information.component.css"],
})
@HostListener("window: resize", ["$event"])
export class CompanyInformationComponent implements OnInit {
    sub: Subscription = new Subscription();
    spinner: boolean = false;
    isFetchingCompanyInfo: boolean = false;
    profile: any;
    companyId: number;
    companyForm: FormGroup;
    socialMediaForm: FormGroup;
    websiteForm: FormGroup;
    companyInfo: any = {
      "comapanyId": 0,
      "full_Name": "",
      "email_Address": "",
      "phone_Number": "",
      "physical_Address": "",
      "aboutInfo": "",
      "industryTypes": "",
      "specializationTypes": "",
    };
    socialMediaInfo: any = {
      "socialMediaId": 0,
      "linkedInType": "",
      "facebookType": "",
      "twitterType": "",
      "youtubeType": "",
    };
    websiteUrls: any = {
      "website_Name_First": "",
      "website_Link_First": "",
      "website_Name_Second": "",
      "website_Link_Second": "",
      "website_Name_Third": "",
      "website_Link_Third": "",
    };
    
  constructor(
    private fb: FormBuilder,
    private _lmsService: LmsService,
    private _loading: LoadingService
  ) {
  }

  ngOnInit(): void {
    this.profile = JSON.parse(localStorage.getItem('userDetails'));
    this.companyId = this.profile.companyId;
    this.initCompanyInfoForm();
    this.initSocialMediaForm();
    this.initWebsiteForm();
    this.getCompanyInfo();
    this.getSocialMediaLinks();
    this.getwebsiteURLS();
  }

  initCompanyInfoForm() {
    this.companyForm = this.fb.group({
      full_Name: [this.companyInfo?.full_Name ? this.companyInfo?.full_Name  : '' ],
      email_Address: [this.companyInfo?.email_Address ? this.companyInfo?.email_Address  : '' ],
      phone_Number: [this.companyInfo?.phone_Number ? this.companyInfo?.phone_Number  : '' ],
      physical_Address: [this.companyInfo?.physical_Address ? this.companyInfo?.physical_Address  : '' ],
      aboutInfo: [this.companyInfo?.aboutInfo ? this.companyInfo?.aboutInfo  : '' ],
      industryTypes: [this.companyInfo?.industryTypes ? this.companyInfo?.industryTypes  : '' ],
      specializationTypes: [this.companyInfo?.specializationTypes ? this.companyInfo?.specializationTypes  : '' ],
    })
  }

  initSocialMediaForm() {
    this.socialMediaForm = this.fb.group({
      linkedInType: [this.socialMediaInfo?.linkedInType ? this.socialMediaInfo?.linkedInType  : 'https://' ],
      facebookType: [this.socialMediaInfo?.facebookType ? this.socialMediaInfo?.facebookType  : 'https://' ],
      twitterType: [this.socialMediaInfo?.twitterType ? this.socialMediaInfo?.twitterType  : 'https://' ],
      youtubeType: [this.socialMediaInfo?.youtubeType ? this.socialMediaInfo?.youtubeType  : 'https://' ],
    })
  }

  initWebsiteForm() {
    this.websiteForm = this.fb.group({
      website_Name_First: [this.websiteUrls?.website_Name_First ? this.websiteUrls?.website_Name_First  : '' ],
      website_Link_First: [this.websiteUrls?.website_Link_First ? this.websiteUrls?.website_Link_First  : 'hhtps://' ],
      website_Name_Second: [this.websiteUrls?.website_Name_Second ? this.websiteUrls?.website_Name_Second  : '' ],
      website_Link_Second: [this.websiteUrls?.website_Link_Second ? this.websiteUrls?.website_Link_Second  : 'https://' ],
      website_Name_Third: [this.websiteUrls?.website_Name_Third ? this.websiteUrls?.website_Name_Third  : '' ],
      website_Link_Third: [this.websiteUrls?.website_Link_Third ? this.websiteUrls?.website_Link_Third  : 'https://' ],
    })
  }

  getCompanyInfo() {
    this._loading.show();
    this.sub.add(
      this._lmsService.getCompanyProfile(this.companyId).subscribe({
        next: (res) => {
          this.isFetchingCompanyInfo = false;
          this._loading.hide();
          this.companyInfo = res['companySetupTypes'][0];
          // console.log(res);
        },
        error: (error) => {
          this.isFetchingCompanyInfo = false;
          console.log(error);
        },
      })
    );
  }

  getSocialMediaLinks() {
    this.sub.add(
      this._lmsService.getSocialMediaUrls(this.companyId).subscribe({
        next: (res) => {
          this.isFetchingCompanyInfo = false;
          this.socialMediaInfo = res['socialMediaSetupTypes'][0];
          // console.log(res);
        },
        error: (error) => {
          this.isFetchingCompanyInfo = false;
          console.log(error);
        },
      })
    );
  }

  getwebsiteURLS() {
    this.sub.add(
      this._lmsService.getWebsiteUrls(this.companyId).subscribe({
        next: (res) => {
          this.isFetchingCompanyInfo = false;
          this.websiteUrls = res['websiteSetupTypes'][0];
          // console.log(res);
        },
        error: (error) => {
          this.isFetchingCompanyInfo = false;
          console.log(error);
        },
      })
    );
  }

  openCompanyInfoModal() {
    $("#edit-company-info").modal("show");
    this.initCompanyInfoForm();
  }

  closeCompanyInfoModal() {
    $("#edit-company-info").modal("hide");
  }

  openSocialMediaModal() {
    $("#social-media").modal("show");
    this.initSocialMediaForm();
  }

  closeSocialMediaModal() {
    $("#social-media").modal("hide");
  }

  openWebsiteModal() {
    $("#website").modal("show");
    this.initWebsiteForm();
  }

  closeWebsiteModal() {
    $("#website").modal("hide");
  }

  updateCompanyInfo() {
    this.isFetchingCompanyInfo = true;
    const payload = this.companyForm.value;
    payload.companyId = this.companyId;
    this.sub.add(
      this._lmsService.updateCompanyProfile(payload).subscribe({
        next: (res) => {
          this.isFetchingCompanyInfo = false;
          console.log(res);
          if (res.status.isSuccessful) {
            swal.fire("GOSHRM", res.status.message.friendlyMessage).then(() => {
              this.companyInfo = payload
              this.initCompanyInfoForm();
              this.closeCompanyInfoModal();
            });
          } else {
            swal.fire("GOSHRM", res.status.message.friendlyMessage);
          }
        },
        error: (error) => {
          this.isFetchingCompanyInfo = false;
          console.log(error);
          swal.fire("GOSHRM", "error");
        },
      })
    );
  }

  updateSocialmediaUrls() {
    this.isFetchingCompanyInfo = true;
    const payload = this.socialMediaForm.value;
    payload.companyid = this.companyId
    this.sub.add(
      this._lmsService.updateSocialMediaUrls(payload).subscribe({
        next: (res) => {
          console.log(res);
          this.isFetchingCompanyInfo = false;
          if (res?.status?.isSuccessful) {
            swal.fire("GOSHRM", res?.status?.message?.friendlyMessage).then(() => {
              this.socialMediaInfo = payload
              this.initSocialMediaForm();
              this.closeSocialMediaModal();
            });
          } else {
            swal.fire("GOSHRM", res?.status?.message?.friendlyMessage);
          }
        },
        error: (error) => {
          this.isFetchingCompanyInfo = false;
          console.log(error);
          swal.fire("GOSHRM", "error");
        },
      })
    );
  }

  updateWebsiteUrls() {
    this.isFetchingCompanyInfo = true;
    const payload = this.websiteForm.value;
    payload.companyid = this.companyId
    this.sub.add(
      this._lmsService.updateWebsiteUrls(payload).subscribe({
        next: (res) => {
          this.isFetchingCompanyInfo = false;
          console.log(res);
          if (res.status.isSuccessful) {
            swal.fire("GOSHRM", res.status.message.friendlyMessage).then(() => {
              this.websiteUrls = payload
              this.initWebsiteForm();
              this.closeWebsiteModal();
            });
          } else {
            swal.fire("GOSHRM", res.status.message.friendlyMessage);
          }
        },
        error: (error) => {
          this.isFetchingCompanyInfo = false;
          console.log(error);
          swal.fire("GOSHRM", "error");
        },
      })
    );
  }

 
}
