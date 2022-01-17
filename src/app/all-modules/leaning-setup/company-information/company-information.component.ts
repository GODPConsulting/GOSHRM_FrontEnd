import { Component, HostListener, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";
import { LmsService } from "src/app/services/lms.service";
import { LoadingService } from "src/app/services/loading.service";
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
      "websiteId": 0,
      "website_Link": "",
      "website_Link_2": "",
      "website_Link_3": "",
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
      linkedInType: [this.socialMediaInfo?.linkedInType ? this.socialMediaInfo?.linkedInType  : '' ],
      facebookType: [this.socialMediaInfo?.facebookType ? this.socialMediaInfo?.facebookType  : '' ],
      twitterType: [this.socialMediaInfo?.twitterType ? this.socialMediaInfo?.twitterType  : '' ],
      youtubeType: [this.socialMediaInfo?.youtubeType ? this.socialMediaInfo?.youtubeType  : '' ],
    })
  }

  initWebsiteForm() {
    this.websiteForm = this.fb.group({
      website_Link: [this.websiteUrls?.website_Link ? this.websiteUrls?.website_Link  : '' ],
      website_Link_2: [this.websiteUrls?.website_Link_2 ? this.websiteUrls?.website_Link_2  : '' ],
      website_Link_3: [this.websiteUrls?.website_Link_3 ? this.websiteUrls?.website_Link_3  : '' ],
    })
  }

  getCompanyInfo() {
    this._loading.show();
    this.sub.add(
      this._lmsService.getCompanyProfile(this.companyId).subscribe({
        next: (res) => {
          this.isFetchingCompanyInfo = false;
          this._loading.hide();
          this.companyInfo = res;
          console.log(res);
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
          this.socialMediaInfo = res;
          console.log(res);
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
          this.websiteUrls = res;
          console.log(res);
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
    const payload = this.companyForm.value;
    payload.companyId = this.companyId;
    this.sub.add(
      this._lmsService.updateCompanyProfile(payload).subscribe({
        next: (res) => {
          this.isFetchingCompanyInfo = false;
          this.socialMediaInfo = res;
          console.log(res);
        },
        error: (error) => {
          this.isFetchingCompanyInfo = false;
          console.log(error);
        },
      })
    );
  }

  updateSocialmediaUrls() {
    const payload = this.socialMediaForm.value;
    payload.companyid = this.companyId
    this.sub.add(
      this._lmsService.updateSocialMediaUrls(payload).subscribe({
        next: (res) => {
          this.isFetchingCompanyInfo = false;
          this.socialMediaInfo = res;
          console.log(res);
        },
        error: (error) => {
          this.isFetchingCompanyInfo = false;
          console.log(error);
        },
      })
    );
  }

  updateWebsiteUrls() {
    const payload = this.websiteForm.value;
    payload.companyId = this.companyId
    this.sub.add(
      this._lmsService.updateWebsiteUrls(payload).subscribe({
        next: (res) => {
          this.isFetchingCompanyInfo = false;
          this.socialMediaInfo = res;
          console.log(res);
        },
        error: (error) => {
          this.isFetchingCompanyInfo = false;
          console.log(error);
        },
      })
    );
  }
 
}
