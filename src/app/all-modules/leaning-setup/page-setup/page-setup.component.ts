import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SetupService } from "src/app/services/setup.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";
import { LoadingService } from "../../../services/loading.service";
import { Subject, Subscription } from "rxjs";
import { ISearchColumn } from "../../../interface/interfaces";
import { LmsService } from "src/app/services/lms.service";

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
  public spinner: boolean = false;
  public jobGradeUploadForm: FormGroup;
  public profile: any;
  public companyId: number;
  public pageContents: any;
  public pageBanners: any;
  dtTrigger: Subject<any> = new Subject();
  selectJobGrades: any[];
  cols: ISearchColumn[];
  modalData = {
    isEditing: false,
    tabName: ''
  };
  current_tab: string;
  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private _lmsService: LmsService
  ) {}

  ngOnInit(): void {
    // $('table').dataTable({searching: false, paging: true, info: true, bFilter: false});
    this.profile = JSON.parse(localStorage.getItem('userDetails'));
    this.companyId = this.profile.companyId;
    this.current_tab = 'Page Banner',
    this.getPageContent();
    this.initializeForm(this.current_tab);
  }

  initializeForm(current_tab) {
    this.current_tab = current_tab;
  }

  getPageContent() {
    this.loadingService.show();
    this.sub.add(
      this._lmsService.getPageContent(this.companyId).subscribe({
        next: (res) => {
          // this.isFetchingCompanyInfo = false;
          this.loadingService.hide();
          // this.pageContents = res['pageBannerSetupTypes'][0];
          console.log(res);
        },
        error: (error) => {
          // this.isFetchingCompanyInfo = false;
          console.log(error);
        },
      })
    );
  }

  openUploadModal() {
    // Reset upload form
    this.fileInput.nativeElement.value = "";
    $("#upload_job_grade").modal("show");
  }

  openModal(isEdit) {
    this.initializeForm(this.current_tab);
    $("#add_job_grade").modal("show");
    this.modalData.isEditing = isEdit;
  }

  openDeleteModal() {
    this.initializeForm(this.current_tab);
    $("#delete_item").modal("show");
    console.log('Hello')
  }

  closeModal() {
    $("#add_job_grade").modal("hide");
  }

  closeDeleteModal() {
    $("#delete_item").modal("hide");
  }

  delete() {
   
  }

  getCurrentTab(tabName) {
    this.current_tab = tabName;
  }

  updatePolicySetup() {
    const payload = {}
    console.log(payload);
    this.sub.add(
      this._lmsService.updateCompanyPolicy(payload).subscribe({
        next: (res) => {
          // this.isFetchingCompanyInfo = false;
          console.log(res);
          if (res.status.isSuccessful) {
            swal.fire("GOSHRM", res.status.message.friendlyMessage).then(() => {
              
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

  // Prevents the edit modal from popping up when checkbox is clicked
  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
  }
}

