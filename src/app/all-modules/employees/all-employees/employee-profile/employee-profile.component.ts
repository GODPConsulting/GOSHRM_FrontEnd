import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-employee-profile",
  templateUrl: "./employee-profile.component.html",
  styleUrls: ["./employee-profile.component.css"],
})
export class EmployeeProfileComponent implements OnInit {
  @ViewChild("fileInput")
  fileInput: ElementRef;
  public addEmployeeForm: FormGroup;
  constructor(
    private toastr: ToastrService,
    private formBuilder: FormBuilder
    
  ) {}

  ngOnInit() {
    this.addEmployeeForm = this.formBuilder.group({
      client: ["", [Validators.required]],
    });
  }

  onSubmit() {
    this.toastr.success("Bank & statutory added", "Success");
  }
}
