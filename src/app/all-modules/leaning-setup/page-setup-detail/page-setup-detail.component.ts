import { FormGroup } from '@angular/forms';
import { Component, OnInit } from "@angular/core";
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
declare const $: any;

@Component({
  selector: "app-page-setup-detail",
  templateUrl: "./page-setup-detail.component.html",
  styleUrls: ["./page-setup-detail.component.css"],
})

export class PageSetupDetailComponent implements OnInit {
  public enableForm: boolean = false;
  public spinner: boolean = false;
  public pageSetupForm = FormGroup;

  constructor() {
  }

  ngOnInit(): void {
    // this.pageSetupForm.disable();
  }

  editForm() {
    this.enableForm = !this.enableForm;
    // this.pageSetupForm.disable() = !this.pageSetupForm.disable()
  }

}
