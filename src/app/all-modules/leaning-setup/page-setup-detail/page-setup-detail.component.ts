import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from "@angular/core";
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Subscription } from 'rxjs';
import { LmsService } from 'src/app/services/lms.service';
import swal from 'sweetalert2';
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

  constructor(
    private fb: FormBuilder,
    private _lmsService: LmsService
  ) {
  }

  ngOnInit(): void {
    this.initPageContentForm();
  }

  initPageContentForm() {
    this.pageSetupForm = this.fb.group({
      pageContentId: [0],
      page_Name: [""],
      page_Title: [""],
      section_Content: [""],
    })
  }

  submit() {
    const payload = this.pageSetupForm.value;
    console.log(payload);
    this.sub.add(
      this._lmsService.updatePageContent(payload).subscribe({
        next: (res) => {
          console.log(res)
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

}
