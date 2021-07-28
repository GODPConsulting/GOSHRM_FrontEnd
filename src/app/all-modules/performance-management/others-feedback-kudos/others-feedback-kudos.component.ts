import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "app-others-feedback-kudos",
  templateUrl: "./others-feedback-kudos.component.html",
  styleUrls: ["./others-feedback-kudos.component.css"],
})
export class OthersFeedbackKudosComponent implements OnInit {
  appraisalFeedbackForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initialiseForm();
  }

  // initialise form

  initialiseForm() {
    this.appraisalFeedbackForm = this.fb.group({
      employee: [""],
      revieweeJobGrade: [""],
      revieweeJobTitle: [""],
      office: [""],
      reviewPeriod: [""],
      lengthOfService: [""],
      reviewerName: [""],
      department: [""],
      reviewerJobGrade: [""],
      reviewerJobTitle: [""],
    });
  }
}
