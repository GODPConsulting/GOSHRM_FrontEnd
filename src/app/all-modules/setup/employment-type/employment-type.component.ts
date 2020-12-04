import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { SetupService } from "src/app/services/setup.service";
import swal from "sweetalert2";

declare const $: any;
@Component({
  selector: "app-employment-type",
  templateUrl: "./employment-type.component.html",
  styleUrls: ["./employment-type.component.css"],
})
export class EmploymentTypeComponent implements OnInit {
  formTitle;
  public dtOptions: DataTables.Settings = {};
  //@ViewChild(DataTableDirective, { static: false })
  public employmentTypeForm: FormGroup;
  //public employeeForm: FormGroup;
  public employmentTypes: any[] = [];
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
    this.getEmploymentType();
  }

  initializeForm() {
    this.employmentTypeForm = this.formBuilder.group({
      id: [0],
      employment_type: ["", Validators.required],
      description: ["", Validators.required],
    });
  }

  addEmploymentType() {
    this.formTitle = "Add Employment Type";
    $("#add_employment_type").modal("show");
  }

  getEmploymentType() {
    return this.setupService.getEmploymentTypeApi().subscribe(
      (data) => {
        console.log(data);
        this.employmentTypes = data.setuplist;
        this.rows = this.employmentTypes;
        this.srch = [...this.rows];
      },
      (err) => {
        console.log(err);
      }
    );
  }

  // Add employee  Modal Api Call
  addData(employmentTypeForm: FormGroup) {
    const payload = employmentTypeForm.value;
    console.log(payload);
    return this.setupService.updateEmploymentType(payload).subscribe(
      (res) => {
        const message = res.status.message.friendlyMessage;
        //console.log(message);

        if (res.status.isSuccessful) {
          swal.fire("Success", message, "success");
          this.initializeForm();
          $("#add_employment_type").modal("hide");
        } else {
          swal.fire("Error", message, "error");
        }
        this.getEmploymentType();
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
          return this.setupService.deleteEmploymentType(payload).subscribe(
            (res) => {
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("Success", message, "success").then(() => {
                  this.getEmploymentType();
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
    this.formTitle = "Edit High School Subject";
    this.employmentTypeForm.patchValue({
      id: row.id,
      employment_type: row.employment_type,
      description: row.description,
    });
    $("#add_employment_type").modal("show");
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
      return d.employment_type.toLowerCase().indexOf(val) !== -1 || !val;
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
}
