import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";

@Component({
  selector: "app-employee-profile",
  templateUrl: "./employee-profile.component.html",
  styleUrls: ["./employee-profile.component.css"],
})
export class EmployeeProfileComponent implements OnInit {
  @ViewChild("fileInput")
  fileInput: ElementRef;
  public addEmployeeForm: FormGroup;
  public rows = [];
  public srch = [];
  public statusValue;
  setupService: any;
  file: any;
  
  employee_profileUploadForm: any;
  initializeForm: any;
  getEmployee_Profile: any;
  pageLoading: boolean;
  spinner: boolean = false;
  value: any;
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
    this.fileInput.nativeElement.value = "";
    
  }

  uploadReferee() {
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

}
