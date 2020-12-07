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
  selector: 'app-employment-level',
  templateUrl: './employment-level.component.html',
  styleUrls: ['./employment-level.component.css']
})
export class EmploymentLevelComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public lstEmployee: any;
  public levels: any[] = [];
  public url: any = "employeelist";
  public tempId: any;
  public editId: any;

  public employmentLevelForm: FormGroup;
  public editEmployeeForm: FormGroup;
  formTitle: string  = "Add Employment Level"
  public pipe = new DatePipe("en-US");
  public rows = [];
  public srch = [];
  selectedId: any[] = [];
  public statusValue;
  public dtTrigger: Subject<any> = new Subject();
  public DateJoin;
  pageLoading: boolean;
  
  constructor(
    private formBuilder: FormBuilder,
    private setupService: SetupService) {   }

  ngOnInit(): void {

    $(".floating")
      .on("focus blur", function(e) {
        $(this)
          .parents(".form-focus")
          .toggleClass("focused", e.type === "focus" || this.value.length > 0);
      })
      .trigger("blur");
    this.initializeForm();
    this.getEmploymentLevels();
  }

  initializeForm() {
    this.employmentLevelForm = this.formBuilder.group({
      id: [0],
      employment_level: ["", Validators.required],
      description: ["", Validators.required]
    });
  }
  getEmploymentLevels() {
    this.pageLoading = true;
    return this.setupService.getEmploymentLevel().subscribe(
      data => {
        this.pageLoading = false;
        this.levels = data.setuplist;
        this.rows = this.levels;
        this.srch = [...this.rows];
      },
      err => {
        console.log(err);
      }
    );
  }
  // Add employee  Modal Api Call
  addData(employmentLevelForm: FormGroup) {
    const payload = employmentLevelForm.value;
    return this.setupService.updateEmploymentLevel(payload).subscribe(
      res => {
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire('Success', message, 'success')
          this.initializeForm();
          $("#add_employment_level").modal("hide");
        } else {
          swal.fire('Error', message, 'error')
        }
        this.getEmploymentLevels();
      },
      err => {
        const message = err.status.message.friendlyMessage;
        swal.fire('Error', message, 'error')
      }
    );
  }
  addEmploymentLevel() {
    this.formTitle = "Add Employment Level";
    $('#add_employment_level').modal('show')
  }
  loadEmployee() {
    // this.srvModuleService.get(this.url).subscribe((data) => {
    //   this.lstEmployee = data;
    //   this.rows = this.lstEmployee;
    // this.srch = [...this.rows];
    // });
  }
  
  closeModal() {
    $('#add_employment_level').modal('hide');
    this.initializeForm()
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

  // to know the date picker changes
  from(data) {
    this.DateJoin = this.pipe.transform(data, "dd-MM-yyyy");
  }
//search by Level
searchLevel(val) {
  this.rows.splice(0, this.rows.length);
  let temp = this.srch.filter(function(d) {
    val = val.toLowerCase();
    return d.employment_level.toLowerCase().indexOf(val) !== -1 || !val;
  });
  this.rows.push(...temp);
}

//search by description
  searchByDescription(val) {
    this.rows.splice(0, this.rows.length);
    let temp = this.srch.filter(function(d) {
      val = val.toLowerCase();
      return d.description.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
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
        return this.setupService.deleteEmploymentLevel(payload).subscribe(res => {
          const message = res.status.message.friendlyMessage;
          if (res.status.isSuccessful) {
            swal.fire('Success', message, 'success').then(() => {
              this.getEmploymentLevels()
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
   // To Get The employee Edit Id And Set Values To Edit Modal Form
  edit(row) {
   this.formTitle = "Edit Employment Level";
    this.employmentLevelForm.patchValue({
      id: row.id,
      employment_level: row.employment_level,
      description: row.description
    });
    $('#add_employment_level').modal('show')
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
        return this.setupService.deleteEmploymentLevel(payload).subscribe(res => {
          const message = res.status.message.friendlyMessage;
          if (res.status.isSuccessful) {
            swal.fire('Success', message, 'success').then(() => {
              this.getEmploymentLevels()
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
      this.selectedId = this.levels.map(item => {
        return item.id
      })
    } else {
      this.selectedId = []
    }
  }
}
