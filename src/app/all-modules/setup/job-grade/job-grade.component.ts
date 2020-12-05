import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { SetupService } from "src/app/services/setup.service";
import swal from "sweetalert2";

declare const $: any;
@Component({
  selector: "app-job-grade",
  templateUrl: "./job-grade.component.html",
  styleUrls: ["./job-grade.component.css"],
})
export class JobGradeComponent implements OnInit {
  formTitle;
  public dtOptions: DataTables.Settings = {};
  //@ViewChild(DataTableDirective, { static: false })
  public jobGradeForm: FormGroup;
  //public employeeForm: FormGroup;
  public jobGrades: any[] = [];
  public rows = [];
  public dtTrigger: Subject<any> = new Subject();
  public dtElement: DataTableDirective;
  public lstEmployee: any;
  //public url: any = "employeelist";
  // public tempId: any;
  // public editId: any;
  public srch = [];
  // public pipe = new DatePipe("en-US");
  // public DateJoin;
  // public statusValue;
  selectedId: any[] = [];
  pageLoading: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private setupService: SetupService
  ) {}

  ngOnInit(): void {
    $(".floating")
      .on("focus blur", function (e) {
        $(this)
          .parents(".form-focus")
          .toggleClass("focused", e.type === "focus" || this.value.length > 0);
      })
      .trigger("blur");
    this.initializeForm();
    this.getjobGrade();
  }

  initializeForm() {
    this.jobGradeForm = this.formBuilder.group({
      id: [0],
      job_grade: ["", Validators.required],
      job_grade_reporting_to: ["", Validators.required],
      rank: ["", Validators.required],
      probation_period_in_months: ["", Validators.required],
      description: ["", Validators.required],
    });
  }

  addjobGrade() {
    this.formTitle = "Add Job Grade";
    $("#add_job_grade").modal("show");
  }

  closeModal() {
    $("#add_job_grade").modal("hide");
    this.initializeForm();
  }

  getjobGrade() {
    this.pageLoading = true;
    return this.setupService.retrievejobGrade().subscribe(
      (data) => {
        this.pageLoading = false;
        console.log(data);
        this.jobGrades = data.setuplist;
        this.rows = this.jobGrades;
        this.srch = [...this.rows];
      },
      (err) => {
        this.pageLoading = false;
        console.log(err);
      }
    );
  }

  // Add employee  Modal Api Call
  addData(jobGradeForm: FormGroup) {
    const payload = jobGradeForm.value;
    console.log(payload);
    return this.setupService.updatejobGrade(payload).subscribe(
      (res) => {
        const message = res.status.message.friendlyMessage;
        //console.log(message);

        if (res.status.isSuccessful) {
          swal.fire("Success", message, "success");
          this.initializeForm();
          $("#add_job_grade").modal("hide");
        } else {
          swal.fire("Error", message, "error");
        }
        this.getjobGrade();
      },
      (err) => {
        const message = err.status.message.friendlyMessage;
        swal.fire("Error", message, "error");
      }
    );
    // let DateJoin = this.pipe.transform(
    //   this.addEmployeeForm.value.JoinDate,
    //   "dd-MM-yyyy"
    // );
    // let obj = {
    //   firstname: this.addEmployeeForm.value.FirstName,
    //   lastname: this.addEmployeeForm.value.LastName,
    //   username: this.addEmployeeForm.value.UserName,
    //   email: this.addEmployeeForm.value.Email,
    //   password: this.addEmployeeForm.value.Password,
    //   confirmpassword: this.addEmployeeForm.value.ConfirmPassword,
    //   employeeId: this.addEmployeeForm.value.EmployeeID,
    //   joindate: DateJoin,
    //   phone: this.addEmployeeForm.value.PhoneNumber,
    //   company: this.addEmployeeForm.value.CompanyName,
    //   department: this.addEmployeeForm.value.DepartmentName,
    //   designation: this.addEmployeeForm.value.Designation,
    //   mobile: "9944996335",
    //   role: "Web developer",
    // };
    // this.srvModuleService.add(obj, this.url).subscribe((data) => {
    //   $("#datatable").DataTable().clear();
    //   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //     dtInstance.destroy();
    //   });
    //   this.dtTrigger.next();
    // });
    // this.loadEmployee();
    // $("#add_employee").modal("hide");
    // this.addEmployeeForm.reset();
    // this.toastr.success("Employeee added sucessfully...!", "Success");
  }

  delete(id: any) {
    const body = [];
    body.push(id);
    const payload = {
      itemIds: body,
    };
    swal
      .fire({
        title: "Are you sure you want to delete this record?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!",
      })
      .then((result) => {
        console.log(result);

        if (result.value) {
          return this.setupService.deletejobGrade(payload).subscribe(
            (res) => {
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("Success", message, "success").then(() => {
                  this.getjobGrade();
                });
              } else {
                swal.fire("Error", message, "error");
              }
            },
            (err) => {
              console.log(err);
            }
          );
        }
      });
  }

  rerender(): void {
    $("#datatable").DataTable().clear();
    console.log(this.dtElement);

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
    });
    this.lstEmployee = [];
    //this.loadEmployee();
    setTimeout(() => {
      this.dtTrigger.next();
    }, 1000);
  }

  // Get Employee  Api Call
  loadEmployee() {
    // this.srvModuleService.get(this.url).subscribe((data) => {
    //   this.lstEmployee = data;
    //   this.rows = this.lstEmployee;
    // this.srch = [...this.rows];
    // });
  }

  // To Get The employee Edit Id And Set Values To Edit Modal Form
  edit(row) {
    this.formTitle = "Edit Job Grade";
    this.jobGradeForm.patchValue({
      id: row.id,
      job_grade: row.job_grade,
      job_grade_reporting_to: row.job_grade_reporting_to,
      rank: row.rank,
      probation_period_in_months: row.probation_period_in_months,
      description: row.description,
    });
    $("#add_job_grade").modal("show");
    // this.editId = value;
    // const index = this.lstEmployee.findIndex(item => {
    //   return item.id === value;
    // });
    // let toSetValues = this.lstEmployee[index];
    // this.editEmployeeForm.setValue({
    //   FirstName: toSetValues.firstname,
    //   LastName: toSetValues.lastname,
    //   UserName: toSetValues.username,
    //   Email: toSetValues.email,
    //   Password: toSetValues.password,
    //   ConfirmPassword: toSetValues.confirmpassword,
    //   EmployeeID: toSetValues.employeeId,
    //   JoinDate: toSetValues.joindate,
    //   PhoneNumber: toSetValues.phone,
    //   CompanyName: toSetValues.company,
    //   DepartmentName: toSetValues.department,
    //   Designation: toSetValues.designation
    // });
  }

  //search by Id
  searchId(val) {
    this.rows.splice(0, this.rows.length);
    let temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.job_grade.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }

  //search by name
  searchName(val) {
    this.rows.splice(0, this.rows.length);
    let temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.description.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }

  checkAll(event) {
    if (event.target.checked) {
      this.selectedId = this.jobGrades.map((item) => {
        return item.id;
      });
    } else {
      this.selectedId = [];
    }
  }

  addItemId(event, id) {
    if (event.target.checked) {
      if (!this.selectedId.includes(id)) {
        this.selectedId.push(id);
      }
    } else {
      this.selectedId = this.selectedId.filter((_id) => {
        return _id !== id;
      });
    }
  }

  deleteItems() {
    if (this.selectedId.length === 0) {
      return swal.fire("Error", "Select items to delete", "error");
    }
    const payload = {
      itemIds: this.selectedId,
    };
    swal
      .fire({
        title: "Are you sure you want to delete this record?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!",
      })
      .then((result) => {
        if (result.value) {
          return this.setupService.deletejobGrade(payload).subscribe(
            (res) => {
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("Success", message, "success").then(() => {
                  this.getjobGrade();
                });
              } else {
                swal.fire("Error", message, "error");
              }
            },
            (err) => {
              console.log(err);
            }
          );
        }
      });
  }
}
