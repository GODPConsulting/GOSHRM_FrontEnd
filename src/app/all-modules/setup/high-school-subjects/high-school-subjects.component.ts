import { Component, OnInit, ViewChild } from "@angular/core";
import { SetupService } from "../../../services/setup.service";
import { DataTableDirective } from "angular-datatables";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { Subject } from "rxjs";
import { ToastrService } from "ngx-toastr";
import swal from 'sweetalert2'

declare const $: any;
@Component({
  selector: "app-high-school-subjects",
  templateUrl: "./high-school-subjects.component.html",
  styleUrls: ["./high-school-subjects.component.css"]
})
export class HighSchoolSubjectsComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public lstEmployee: any;
  public subjects: any[] = [];
  public url: any = "employeelist";
  public tempId: any;
  public editId: any;

  public highSchoolForm: FormGroup;
  public editEmployeeForm: FormGroup;
  formTitle: string  = "Add High School Subject"
  public pipe = new DatePipe("en-US");
  public rows = [];
  public srch = [];
  public statusValue;
  public dtTrigger: Subject<any> = new Subject();
  public DateJoin;
  pageLoading: boolean;
  value: any;
  selectedId: any[] = [];
  constructor(
    private setupService: SetupService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    $(".floating")
      .on("focus blur", function(e) {
        $(this)
          .parents(".form-focus")
          .toggleClass("focused", e.type === "focus" || this.value.length > 0);
      })
      .trigger("blur");
    this.initializeForm();
    this.getHighSchools();
  }
  initializeForm() {
    this.highSchoolForm = this.formBuilder.group({
      id: [0],
      subject: ["", Validators.required],
      description: ["", Validators.required]
    });
  }
  getHighSchools() {
    this.pageLoading = true;
    return this.setupService.getHighSchoolSubject().subscribe(
      data => {
        this.pageLoading = false;
        this.subjects = data.setuplist;
        this.rows = this.subjects;
        this.srch = [...this.rows];
      },
      err => {
        this.pageLoading = false;
        console.log(err);
      }
    );
  }
  rerender(): void {
    $("#datatable")
      .DataTable()
      .clear();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
    });
    this.lstEmployee = [];
    this.loadEmployee();
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

  // Add employee  Modal Api Call
  addData(highSchoolForm: FormGroup) {
    const payload = highSchoolForm.value;
    return this.setupService.updateHighSchoolSubject(payload).subscribe(
      res => {
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire('Success', message, 'success')
          this.initializeForm();
          $("#add_high_school_subject").modal("hide");
        } else {
          swal.fire('Error', message, 'error')
        }
        this.getHighSchools();
      },
      err => {
        const message = err.status.message.friendlyMessage;
        swal.fire('Error', message, 'error')
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

  // to know the date picker changes
  from(data) {
    this.DateJoin = this.pipe.transform(data, "dd-MM-yyyy");
  }

  // edit modal api call
  editEmployee() {
    // let obj = {
    //   firstname: this.editEmployeeForm.value.FirstName,
    //   lastname: this.editEmployeeForm.value.LastName,
    //   username: this.editEmployeeForm.value.UserName,
    //   email: this.editEmployeeForm.value.Email,
    //   password: this.editEmployeeForm.value.Password,
    //   confirmpassword: this.editEmployeeForm.value.ConfirmPassword,
    //   employeeId: this.editEmployeeForm.value.EmployeeID,
    //   joindate: this.editEmployeeForm.value.JoinDate,
    //   phone: this.editEmployeeForm.value.PhoneNumber,
    //   company: this.editEmployeeForm.value.CompanyName,
    //   department: this.editEmployeeForm.value.DepartmentName,
    //   designation: this.editEmployeeForm.value.Designation,
    //   mobile: "9944996335",
    //   role: "Web developer",
    //   id: this.editId,
    // };
    // this.srvModuleService.update(obj, this.url).subscribe((data1) => {
    //   $("#datatable").DataTable().clear();
    //   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //     dtInstance.destroy();
    //   });
    //   this.dtTrigger.next();
    // });
    // this.loadEmployee();
    // $("#edit_employee").modal("hide");
    // this.toastr.success("Employeee Updated sucessfully...!", "Success");
  }

  // To Get The employee Edit Id And Set Values To Edit Modal Form
  edit(row) {
   this.formTitle = "Edit High School Subject";
    this.highSchoolForm.patchValue({
      id: row.id,
      subject: row.subject,
      description: row.description
    });
    $('#add_high_school_subject').modal('show')
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

  // delete employee data api call
  deleteEmployee() {
    // this.srvModuleService.delete(this.tempId, this.url).subscribe((data) => {
    //   $("#datatable").DataTable().clear();
    //   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //     dtInstance.destroy();
    //   });
    //   this.dtTrigger.next();
    // });
    // this.loadEmployee();
    // $("#delete_employee").modal("hide");
    // this.toastr.success("Employee deleted sucessfully..!", "Success");
  }

  //search by Id
  searchId(val) {
    this.rows.splice(0, this.rows.length);
    let temp = this.srch.filter(function(d) {
      val = val.toLowerCase();
      return d.subject.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }

  //search by name
  searchName(val) {
    this.rows.splice(0, this.rows.length);
    let temp = this.srch.filter(function(d) {
      val = val.toLowerCase();
      return d.description.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }

  //search by purchase
  searchByDesignation(val) {
    this.rows.splice(0, this.rows.length);
    let temp = this.srch.filter(function(d) {
      val = val.toLowerCase();
      return d.designation.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }

  //getting the status value
  getStatus(data) {
    this.statusValue = data;
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  addHighSchool() {
    this.formTitle = "Add High School Subject";
    $('#add_high_school_subject').modal('show')
  }

  closeModal() {
    $('#add_high_school_subject').modal('hide');
    this.initializeForm()
  }

  delete(id: any) {
   const body = [];
   body.push(id);
   const payload = {
     itemIds: body
   };
   swal.fire({
     title: "Are you sure you want to delete this record?",
     text: "You won't be able to revert this",
     icon: "warning",
     showCancelButton: true,
     confirmButtonText: "Yes!"
   }).then(result => {
     if (result.value) {
       return this.setupService.deleteHighSchoolSubject(payload).subscribe(res => {
         const message = res.status.message.friendlyMessage;
         if (res.status.isSuccessful) {
           swal.fire('Success', message, 'success').then(() => {
             this.getHighSchools()
           })
         } else {
           swal.fire('Error', message, 'error')
         }
       }, err => {
         console.log(err);
       })
     }
   })
  }
  addItemId(event, id) {
    if (event.target.checked) {
      if (!this.selectedId.includes(id)) {
        this.selectedId.push(id)
      }
    } else {
      this.selectedId = this.selectedId.filter(_id => {
        return _id !== id;
      })
    }

  }
  deleteItems() {
    if (this.selectedId.length === 0) {
      return swal.fire('Error', 'Select items to delete', 'error')
    }
    const payload = {
      itemIds: this.selectedId
    };
    swal.fire({
      title: "Are you sure you want to delete this record?",
      text: "You won't be able to revert this",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes!"
    }).then(result => {
      if (result.value) {
        return this.setupService.deleteHighSchoolSubject(payload).subscribe(res => {
          const message = res.status.message.friendlyMessage;
          if (res.status.isSuccessful) {
            swal.fire('Success', message, 'success').then(() => {
              this.getHighSchools()
            })
          } else {
            swal.fire('Error', message, 'error')
          }
        }, err => {
          console.log(err);
        })
      }
    })

  }
  checkAll(event) {
    if (event.target.checked) {
      this.selectedId = this.subjects.map(item => {
        return item.id
      })
    } else {
      this.selectedId = []
    }
  }
}
