import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "app-forgot",
  templateUrl: "./forgot.component.html",
  styleUrls: ["./forgot.component.css"],
})
export class ForgotComponent implements OnInit {
  forgotPassword: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initialiseForm();
  }
  initialiseForm() {
    this.forgotPassword = this.fb.group({
      email: [""],
    });
  }
}
