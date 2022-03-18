import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SetupService } from "src/app/services/setup.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";
import { LoadingService } from "../../../services/loading.service";
import { Subject, Subscription } from "rxjs";
import { ISearchColumn } from "../../../interface/interfaces";
import { LmsService } from "src/app/services/lms.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Console } from "console";

declare const $: any;
@Component({
  selector: 'app-page-setup',
  templateUrl: './page-setup.component.html',
  styleUrls: ['./page-setup.component.css']
})
export class PageSetupComponent implements OnInit {
 public sub: Subscription = new Subscription();
  public dtOptions: DataTables.Settings = {};
  @ViewChild("fileInput") fileInput: ElementRef;
  public jobGradeForm: FormGroup;
  public selectedId: number[] = [];
  public isCheck: boolean = false;
  public spinner: boolean = false;
  public jobGradeUploadForm: FormGroup;
  public profile: any;
  public companyId: number;
  public pageContents: any;
  public pageBanner: any[] = [];
  public selectedContent: any[] = [];
  dtTrigger: Subject<any> = new Subject();
  selectJobGrades: any[];
  cols: ISearchColumn[];
  modalData = {
    isEditing: false,
    tabName: ''
  };
  current_tab: string = 'Page Banner';
  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private _lmsService: LmsService,
    private _route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const q = this._route.snapshot.queryParamMap.get('q');
    if(q == 'content') {
      this.current_tab = 'Page Content'
    } else {
      this.current_tab = 'Page Banner'
    }
    this.profile = JSON.parse(localStorage.getItem('userDetails'));
    this.companyId = this.profile.companyId;
    this.getPageContent();
    this.getPageBanner();
    this.initializeForm(this.current_tab);
  }

  addNew() {
    if(this.current_tab == 'Page Content') {
      this.router.navigate(['/lms/application/page-setup-detail'], {
        queryParams: { page: 'content' },
      });
    } else {
      this.router.navigate(['/lms/application/page-setup-detail'], {
        queryParams: { page: 'banner' },
      });
    }
  }

  initializeForm(current_tab) {
    this.current_tab = current_tab;
  }

  getPageBanner() {
    this.loadingService.show();
    this.sub.add(
      this._lmsService.getPageBanner(this.companyId).subscribe({
        next: (res) => {
          // console.log(res)
          this.loadingService.hide();
          this.pageBanner = res['pageBannerSetupTypes'];
          // console.log(this.pageBanner);
        },
        error: (error) => {
          // this.isFetchingCompanyInfo = false;
          console.log(error);
        },
      })
    );
  }
  getPageContent() {
    this.loadingService.show();
    this.sub.add(
      this._lmsService.getPageContent(this.companyId).subscribe({
        next: (res) => {
          // this.isFetchingCompanyInfo = false;
          this.loadingService.hide();
          this.pageContents = res['pageContentSetupTypes'];
          // console.log(res);
        },
        error: (error) => {
          // this.isFetchingCompanyInfo = false;
          console.log(error);
        },
      })
    );
  }

  getCurrentTab(tabName) {
    this.current_tab = tabName;
  }

  editBanner(row) {
    console.log(row)
    this.router.navigate(['/lms/application/page-setup-detail'], {
      queryParams: { page: 'banner', page_Id: row.pageBannerId },
    });
  }

  editContent(row) {
    console.log(row)
    this.router.navigate(['/lms/application/page-setup-detail'], {
      queryParams: { page: 'content', page_Id: row.pageContentId },
    });
  }

  multipleDelete() {
    if (this.selectedContent.length == 0) {
      return swal.fire(
        'GOS FINANCIAL',
        'Please select records you want to delete',
        'error'
      );
    };
    let operation = '';
    let list
    let tempData = this.selectedContent;
    let targetIds = [];
    if(this.current_tab == 'Page Content') {
      operation = 'deleteContent';
      list = this.pageContents;
      if (tempData !== undefined) {
        tempData.forEach((el) => {
          let data = {
            targetId: el.pageContentId,
          };
          targetIds.push(el.pageContentId);
        });
      }
    } 
    let body = {
      pageContentId: targetIds,
      companyId: this.companyId
    };
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to delete record?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        if (result.value) {
          __this._lmsService[operation](body).subscribe(
            (data) => {
              const message = data.status.message.friendlyMessage;
              if (data.status.isSuccessful) {
                swal.fire('GOS FINANCIAL', message, 'success');
                this.selectedContent = [];
                let data
                if(this.current_tab == 'Page Content') {
                  data = list.filter(item => !targetIds.includes(item.contentId));
                  this.getPageContent();
                }
              } else {
                swal.fire('GOS FINANCIAL', message, 'error');
              }
            },
            (err) => {
              const message = err.status.message.friendlyMessage;
              swal.fire('GOS FINANCIAL', message, 'error');
            }
          );
        } else {
          swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
      });
  }

  delete(id) {
    let operation = '';
    let list
    if(this.current_tab == 'Page Content') {
      operation = 'deleteContent';
      list = this.pageContents
    }
    let targetIds = [id]
    let body = {
      pageContentId: targetIds,
      companyId: this.companyId
    };
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to delete record?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        if (result.value) {
          __this._lmsService[operation](body).subscribe(
            (data) => {
              const message = data.status.message.friendlyMessage;
              if (data.status.isSuccessful) {
                swal.fire('GOS FINANCIAL', message, 'success');
                let data
                if(this.current_tab == 'Page Content') {
                  data = list.filter(item => !targetIds.includes(item.contentId));
                  this.getPageContent();
                }
              } else {
                swal.fire('GOS FINANCIAL', message, 'error');
              }
            },
            (err) => {
              const message = err.status.message.friendlyMessage;
              swal.fire('GOS FINANCIAL', message, 'error');
            }
          );
        } else {
          swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
      });
  }

  getBase64(event, item) {
    let me = this;
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      //me.modelvalue = reader.result;
      // console.log(reader.result);
      me.uploadImage(reader.result, item);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  uploadImage(fileName, item) {
    const imageUrl = fileName.split(",");
    let payload;
    if(this.current_tab == 'Page Content') {
      payload  = {
        photoUrl: imageUrl[1],
        pageId: item.pageContentId,
        PageType: 1
      };
    } else {
      payload  = {
        photoUrl: imageUrl[1],
        pageId: item.pageBannerId,
        PageType: 2
      };
    }
    payload.companyId = this.companyId;
    this.loadingService.show();
    this._lmsService.uploadPageImage(payload).subscribe((data) => {
        if (data.status.isSuccessful) {
            this.loadingService.hide();
          swal.fire('GOS FINANCIAL', 'Content updated successfully.', 'success');
          item.photoUrl = fileName;
        } else {
            this.loadingService.hide();
          swal.fire('GOS FINANCIAL', 'Unable to add/update content', 'error');
        }
    });
  }

  // Prevents the edit modal from popping up when checkbox is clicked
  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
  }
}

