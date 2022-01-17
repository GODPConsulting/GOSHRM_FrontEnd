import { FormGroup } from '@angular/forms';
import { Component, OnInit } from "@angular/core";
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
declare const $: any;

@Component({
  selector: "app-page-setup",
  templateUrl: "./page-setup.component.html",
  styleUrls: ["./page-setup.component.css"],
})

export class PageSetupComponent implements OnInit {
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
