import { Component, HostListener, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EventValidationErrorMessage } from "angular-calendar/node_modules/calendar-utils";
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
    companyInfoFormFormSubmitted: boolean = false;
    socialMediaFormSubmitted: boolean = false;
    websiteFormSubmitted: boolean = false;
    profile: any;
    companyId: number;
    userid: string;
    companyForm: FormGroup;
    socialMediaForm: FormGroup;
    websiteForm: FormGroup;
    companyInfo: any = {
      "comapanyId": 0,
      "company_Name": "",
      "email_Address": "",
      "phone_Number": "",
      "physical_Address": "",
      "aboutInfo": "",
      "industryTypes": "",
      "specializationTypes": "",
    };
    socialMediaInfo: socialMedia[] = [];
    websiteUrls: Website[] = [];
    payouts: any[] = [];
    allTrainers: any[] = [];

  expenseEditForm: FormGroup;
  expense: any;
    
  constructor(
    private fb: FormBuilder,
    private _lmsService: LmsService,
    private _loading: LoadingService
  ) {
  }

  ngOnInit(): void {
    this.profile = JSON.parse(localStorage.getItem('userDetails'));
    this.companyId = this.profile.companyId;
    this.userid = this.profile.userId;
    this.initCompanyInfoForm();
    this.initSocialMediaForm();
    this.initWebsiteForm();
    this.getCompanyInfo();
    this.getSocialMediaLinks();
    this.getwebsiteURLS();
    this.getAllTrainers();
    this.getPayouts();
  }

  initCompanyInfoForm() {
    this.companyForm = this.fb.group({
      company_Name: [this.companyInfo?.company_Name ? this.companyInfo?.company_Name  : '' ],
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
      socialMedia: this.fb.array([
        this.fb.group({
          socialMediaId: [0],
          socialMediaUrl: ['https://',
            [
              Validators.required,
              Validators.pattern('(https?://)([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')
            ]
          ],
          socialMediaType: [0, Validators.required],
          companyId: [0]
        })
      ]),
    })
  }

  get newForm(): FormArray {
    return this.socialMediaForm.get('socialMedia') as FormArray;
  }

  addSocialMedia() {
    let sm = this.fb.group(new socialMedia());
		this.newForm.push(sm);
  }

  setSocailmedias() {
		this.newForm.setValue(this.socialMediaInfo);
	}

  initWebsiteForm() {
    this.websiteForm = this.fb.group({
      websiteItem: this.fb.array([
        this.fb.group({
          websiteId: [0],
          website_Link: ['https://',
            [
              Validators.required,
              Validators.pattern('(https?://)([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')
            ]
          ],
          website_Name: ['', Validators.required],
          companyId: [0]
        })
      ]),
    })
  }

  get newWebsiteForm(): FormArray {
    return this.websiteForm.get('websiteItem') as FormArray;
  }

  addWebsite() {
    let web = this.fb.group(new Website());
		this.newWebsiteForm.push(web);
  }

  setWebsiteForm() {
		this.newWebsiteForm.setValue(this.websiteUrls);
	}

  removeQuestion(i: number) {
    if (i > 0) this.newForm.removeAt(i);
  }

  patchForm() {
    this.newForm.patchValue(this.socialMediaInfo);
    console.log(this.socialMediaForm.get('socialMedia').value ,this.newForm.value);
  }

  getCompanyInfo() {
    this._loading.show();
    this.sub.add(
      this._lmsService.getCompanyProfile(this.companyId).subscribe({
        next: (res) => {
          this.isFetchingCompanyInfo = false;
          this._loading.hide();
          this.companyInfo = res['companySetupTypes'];
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
      this._lmsService.getSocialMediaUrls(this.companyId, this.profile.userId).subscribe({
        next: (res) => {
          this.isFetchingCompanyInfo = false;
          this.expense = this.socialMediaInfo = res['socialMediaSetupTypes'];
          // console.log(this.socialMediaInfo);
          // this.patchForm();
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
      this._lmsService.getWebsiteUrls(this.companyId, this.profile.userId).subscribe({
        next: (res) => {
          this.isFetchingCompanyInfo = false;
          this.websiteUrls = res['websiteSetupTypes'];
          // console.log(res);
        },
        error: (error) => {
          this.isFetchingCompanyInfo = false;
          console.log(error);
        },
      })
    );
  }

  getPayouts() {
    this.sub.add(
      this._lmsService.getAllPayoutSetup(this.companyId, this.userid).subscribe({
        next: (res) => {
          this.isFetchingCompanyInfo = false;
          this.payouts = res['payoutSetupTypes'];
          console.log(res);
        },
        error: (error) => {
          this.isFetchingCompanyInfo = false;
          console.log(error);
        },
      })
    );
  }

  getAllTrainers() {
    this.sub.add(
      this._lmsService.getAllTrainers(this.companyId).subscribe({
        next: (res) => {
          this.isFetchingCompanyInfo = false;
          this.allTrainers = res['trainingProviderObjs'];
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
    const payload = this.socialMediaForm.get('socialMedia').value;
    payload.map((m: any) => {
      m.socialMediaType = +m.socialMediaType,
      m.companyId = +this.companyId,
      m.SociaMediaCreatedByType = 1
      m.userId = this.profile.userId
    });
    // const output = payload.map(({socialMediaType, ...rest}) => ({...rest, socialMediaType: +socialMediaType}));
    // const output2 = output.map(({companyId, ...rest}) => ({...rest, companyId: +this.companyId}));
    // const result = output2.map(({SociaMediaCreatedByType, ...rest}) => ({...rest, SociaMediaCreatedByType: 1}));
    console.log(payload);
    if(this.socialMediaForm.valid) {
      this.sub.add(
        this._lmsService.updateSocialMediaUrls(payload).subscribe({
          next: (res) => {
            console.log(res);
            this.isFetchingCompanyInfo = false;
            if (res?.status?.isSuccessful) {
              swal.fire("GOSHRM", res?.status?.message?.friendlyMessage).then(() => {
                this.socialMediaInfo = [...payload];
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
  }

  updateWebsiteUrls() {
    this.socialMediaFormSubmitted = true;
    const payload = this.websiteForm.get('websites').value;
    payload.map((m: any) => {
      m.companyId = +this.companyId,
      m.SociaMediaCreatedByType = 1
      m.userId = this.profile.userId
    })
    const output = payload.map(({companyId, ...rest}) => ({...rest, companyId: +this.companyId}));
    const result = output.map(({WebsiteCreatedByType, ...rest}) => ({...rest, WebsiteCreatedByType: 1}));
   if(this.websiteForm.valid) {
    this.sub.add(
      this._lmsService.updateWebsiteUrls(result).subscribe({
        next: (res) => {
          this.socialMediaFormSubmitted = false;
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
          this.socialMediaFormSubmitted = false;
          console.log(error);
          swal.fire("GOSHRM", "error");
        },
      })
    );
   }
  }

  getBase64(event) {
    let me = this;
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      //me.modelvalue = reader.result;
      console.log(reader.result);
      me.uploadLogo(reader.result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  uploadLogo(FileName) {
    this.isFetchingCompanyInfo = true;
    const imageUrl = FileName.split(",");
    const payload = {
      photoUrl: imageUrl[1],
      updatedBy: this.profile.userId,
      companyId: this.companyId
    }
    console.log(payload)
    if(FileName !=  null) {
      this.sub.add(
        this._lmsService.updateCompanyLogo(payload).subscribe({
          next: (res) => {
            console.log(res);
            this.isFetchingCompanyInfo = false;
            if (res?.status?.isSuccessful) {
              swal.fire("GOSHRM", res?.status?.message?.friendlyMessage).then(() => {
               this.companyInfo.photoUrl = FileName;
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
  }

}



export class socialMedia {
	socialMediaId = 0;
	socialMediaType = 0; 
	socialMediaUrl = '';
	companyId = 0;
} 

export class Website {
  websiteId = 0;
  website_Name = "";
  website_Link = "";
  companyId = 0;
}