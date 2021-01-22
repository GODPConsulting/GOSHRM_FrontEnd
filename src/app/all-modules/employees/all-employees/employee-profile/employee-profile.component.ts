import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { data } from "jquery";
import { ToastrService } from "ngx-toastr";
import { EmployeeService } from "src/app/services/employee.service";
import swal from "sweetalert2";

@Component({
  selector: "app-employee-profile",
  templateUrl: "./employee-profile.component.html",
  styleUrls: ["./employee-profile.component.css"],
})
export class EmployeeProfileComponent implements OnInit {
  employeeDetails: any = {};
  pageLoading: boolean = false; // controls the visibility of the page loader

  @ViewChild("fileInput")
  fileInput: ElementRef;
  //public addEmployeeForm: FormGroup;
  spinner: boolean = false;
  //value: any;

  constructor(
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      console.log(+params.get("id"));
      if (!+params.get("id")) {
        console.log("new");
      }
      this.getSingleEmployee(+params.get("id"));
    });
    /* this.addEmployeeForm = this.formBuilder.group({
      client: ["", [Validators.required]],
    }); */
  }

  onSubmit() {
    this.toastr.success("Bank & statutory added", "Success");
    this.fileInput.nativeElement.value = "";
  }

  /* Employee profile */

  getSingleEmployee(id: number) {
    this.pageLoading = true;
    this.employeeService.getSingleEmployee(id).subscribe(
      (data) => {
        console.log(data);
        //console.log(this.employeeDetails);
        this.employeeDetails = data.staff[0];
        this.pageLoading = false;
        console.log(this.employeeDetails);
      },
      (err) => {
        this.pageLoading = false;
        console.log(err);
      }
    );
  }

  /* Employee profile */

  /* Emergency Contact */

  /* Emergency Contact */

  /*  uploadReferee() {
    const formData = new FormData();
    formData.append(
      "uploadInput",
      this.employee_profileUploadForm.get("uploadInput").value
    );
    if (!this.file) {
      return swal.fire("Error", "Select a file", "error");
    }
    //console.log(formData, this.languageForm.get("uploadInput").value);
    this.spinner = true;

    return this.setupService
      .updateData("/hrmsetup/upload/language", formData)
      .subscribe(
        (res) => {
          this.spinner = false;
          const message = res.status.message.friendlyMessage;

          if (res.status.isSuccessful) {
            swal.fire("Success", message, "success");
            this.initializeForm();
            this.fileInput.nativeElement.value = "";
          } else {
            swal.fire("Error", message, "error");
          }
          this.getEmployee_Profile();
        },
        (err) => {
          this.spinner = false;
          const message = err.status.message.friendlyMessage;
          swal.fire("Error", message, "error");
        }
      );
  } 
  */
}
