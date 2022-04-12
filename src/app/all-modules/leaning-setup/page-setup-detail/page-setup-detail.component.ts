import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from "@angular/core";
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Subscription } from 'rxjs';
import { LmsService } from 'src/app/services/lms.service';
import swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';
declare const $: any;

@Component({
  selector: "app-page-setup-detail",
  templateUrl: "./page-setup-detail.component.html",
  styleUrls: ["./page-setup-detail.component.css"],
})

export class PageSetupDetailComponent implements OnInit {
  public sub: Subscription = new Subscription();
  public enableForm: boolean = false;
  public spinner: boolean = false;
  public pageSetupForm: FormGroup;
  public contentForm: FormGroup;
  public page_id: any;
  public formName: string = 'content';
  public profile: any;
  public companyId: number = 0;

  constructor(
    private fb: FormBuilder,
    private _lmsService: LmsService,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private loadingService: LoadingService
  ) {
  }

  ngOnInit(): void {
    this.profile = JSON.parse(localStorage.getItem('userDetails'));
    this.companyId = this.profile.companyId;
    this.activateRoute.queryParams.subscribe(params => {
      this.page_id = params.page_Id;
      this.formName = params.page;
      if (this.formName == 'content') {
          this.editContent(this.page_id);
      } else {
          this.editBanner();
      }
    });
    this.profile = JSON.parse(localStorage.getItem('userDetails'));
    this.companyId = this.profile.companyId;
    this.initPageBannerForm();
    this.initPageContentForm();
  }

  initPageBannerForm() {
    this.pageSetupForm = this.fb.group({
      pageBannerId: [0],
      pageBannerName: [""],
      pageBannerTitle: [""],
    })
  }
  initPageContentForm() {
    this.contentForm = this.fb.group({
      pageContentId: [0],
      page_Name: [""],
      page_Title: [""],
      section_Content: [""],
    })
  }

  editContent(id) {
    this.loadingService.show();
    this.sub.add(
      this._lmsService.getPageContentById(this.companyId, id).subscribe({
        next: (res) => {
          // console.log(res)
          this.loadingService.hide();
          const row = res.pageContentSetupTypes;
          this.contentForm = this.fb.group({
            pageContentId: row.pageContentId,
            page_Name: row.page_Name,
            page_Title: row.page_Title,
            section_Content: row.section_Content,
          });
        },
        error: (error) => {
          // this.isFetchingCompanyInfo = false;
          console.log(error);
        },
      })
    );
  }

  editBanner() {
    this.loadingService.show();
    this.sub.add(
      this._lmsService.getPageBanner(this.companyId).subscribe({
        next: (res) => {
          // console.log(res)
          this.loadingService.hide();
          const row = res.pageBannerSetupTypes;
          this.pageSetupForm = this.fb.group({
            pageBannerId: row.pageBannerId,
            pageBannerName: row.pageBannerName,
            pageBannerTitle: row.pageBannerTitle,
          });
        },
        error: (error) => {
          // this.isFetchingCompanyInfo = false;
          console.log(error);
        },
      })
    );
  }

  submit() {
    let operation
    let payload
    if (this.formName == 'content') {
      operation = 'updatePageContent';
      payload = this.contentForm.value
    } else {
      operation = 'updatePageBanner';
      payload = this.pageSetupForm.value
    }
    payload.companyId = this.companyId;
    this.loadingService.show();
      this._lmsService[operation](payload).subscribe((data) => {
        if (data.status.isSuccessful) {
            this.loadingService.hide();
          swal.fire('GOS FINANCIAL', `${this.formName} updated successfully.`, 'success');
          this.router.navigate(['/lms/application/page-setup'], { queryParams: { q: this.formName }});
        } else {
            this.loadingService.hide();
          swal.fire('GOS FINANCIAL', 'Unable to add/update content', 'error');
        }
      });
  }

  back() {
    if(this.formName == 'content') {
      this.router.navigate(['/lms/application/page-setup'], { queryParams: { q: 'content' }});
    } else {
      this.router.navigate(['/lms/application/page-setup'], { queryParams: { q: 'banner' }});
    }
  }

}
