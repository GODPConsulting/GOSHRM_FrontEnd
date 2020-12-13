import { Component, OnInit, ViewChild } from "@angular/core";
import { SetupService } from "../../../services/setup.service";
import { DataTableDirective } from "angular-datatables";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { Subject } from "rxjs";
import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { ApiService } from "src/app/services/api.service";
import { toBase64String } from "@angular/compiler/src/output/source_map";

declare const $: any;
@Component({
  selector: "app-academic-discipline",
  templateUrl: "./academic-discipline.component.html",
  styleUrls: ["./academic-discipline.component.css"],
})
export class AcademicDisciplineComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public lstEmployee: any;
  public disciplines: any[] = [];
  public url: any = "employeelist";
  public tempId: any;
  public editId: any;

  public academicDisciplineForm: FormGroup;
  public editEmployeeForm: FormGroup;
  formTitle: string = "Add Academic Discipline";
  public pipe = new DatePipe("en-US");
  public rows = [];
  public srch = [];
  public statusValue;
  public dtTrigger: Subject<any> = new Subject();
  public DateJoin;
  pageLoading: boolean;
  value: any;
  selectedId: any[] = [];
  trustedUrl: SafeUrl;
  blob;
  dload; //= "http://godp.co.uk:72/api/v1/hrmsetup/download/academic/disciplines";
  constructor(
    private setupService: SetupService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private apiservice: ApiService
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
    this.getAcademicDisplines();
  }
  /* 
  downloadFile() {
    this.apiservice.download().subscribe((data) => {
      console.log(data);
      //this.blob = window.atob(JSON.stringify(data));

      this.dload = toBase64String((JSON.stringify(data)));
      console.log(this.blob);
    });
  }

  _base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }
 */
  /* 
  downloadFile() {
    this.apiservice.download().subscribe((data) => {
      console.log(data);
      this.blob = window.atob(JSON.stringify(data));
      console.log(this.blob);
    });
  }
 */
  /* downloadFile() {
   this.apiservice.download("hrmsetup/download/academic/disciplines").subscribe(file => {
     this.blob= new Blob([file],{type: 'application/xlsx'});

   })
  } */

  /*  Working for csv download
 
 downloadFile() {
    return this.setupService
      .getData("/hrmsetup/get/all/academic/disciplines")
      .subscribe(
        (data) => {
          //this.users = data;
          console.log(data);
          let serialNum = 1;
          const customerData = data.setuplist;
           const jsonData = customerData.map((row) => ({
            //console.log(row);

            "S/N": serialNum++,
            Discipline: row.discipline,
            Description: row.description,
            Rank: row.rank,
          }));

          console.log(jsonData);
          const csvData = this.objToCsv(jsonData);
          this.downloadData(csvData);
        },
        (err) => console.log(err)
      );
  }

  objToCsv(data) {
    const csvRows = [];
    // get the headers
    const headers = Object.keys(data[0]);
    csvRows.push(headers);

    // loop over rows
    for (const row of data) {
      const values = headers.map((header) => {
        const escaped = ("" + row[header]).replace(/"/g, '\\"'); // form escaped comma separated values
        return `"${escaped}"`;
      });
      csvRows.push(values.join(","));
    }
    return csvRows.join("\n");
  }

  downloadData(data) {
    const blob = new Blob([data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    this.trustedUrl = this.sanitizer.bypassSecurityTrustUrl(url);
  } */

  initializeForm() {
    this.academicDisciplineForm = this.formBuilder.group({
      id: [0],
      discipline: ["", Validators.required],
      description: ["", Validators.required],
      rank: [0, Validators.required],
    });
  }
  getAcademicDisplines() {
    this.pageLoading = true;
    return this.setupService
      .getData("/hrmsetup/get/all/academic/disciplines")
      .subscribe(
        (data) => {
          this.pageLoading = false;
          this.disciplines = data.setuplist;
          this.rows = this.disciplines;
          this.srch = [...this.rows];
        },
        (err) => {
          this.pageLoading = false;
          console.log(err);
        }
      );
  }
  rerender(): void {
    $("#datatable").DataTable().clear();
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
  addData(academicDisciplineForm: FormGroup) {
    const payload = academicDisciplineForm.value;
    console.log(payload);

    payload.rank = parseInt(payload.rank);
    return this.setupService
      .updateData("/hrmsetup/add/update/academic/discipline", payload)
      .subscribe(
        (res) => {
          const message = res.status.message.friendlyMessage;
          if (res.status.isSuccessful) {
            swal.fire("Success", message, "success");
            this.initializeForm();
            $("#add_academic_discipline").modal("hide");
          } else {
            swal.fire("Error", message, "error");
          }
          this.getAcademicDisplines();
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
    this.formTitle = "Edit Academic Discipline";
    this.academicDisciplineForm.patchValue({
      id: row.id,
      discipline: row.discipline,
      description: row.description,
      rank: row.rank,
    });
    $("#add_academic_discipline").modal("show");
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

  //search by Discipline
  searchDiscipline(val) {
    this.rows.splice(0, this.rows.length);
    let temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.discipline.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }

  //search by Description
  searchDescription(val) {
    this.rows.splice(0, this.rows.length);
    let temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.description.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }

  //search by purchase
  searchByDesignation(val) {
    this.rows.splice(0, this.rows.length);
    let temp = this.srch.filter(function (d) {
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

  addAcademicDiscipline() {
    this.formTitle = "Add Academic Discipline";
    $("#add_academic_discipline").modal("show");
  }

  closeModal() {
    $("#add_academic_discipline").modal("hide");
    this.initializeForm();
  }

  delete(id: any) {
    let payload;

    if (id) {
      const body = [id];
      //body.push(id);
      //console.log(body);
      payload = {
        itemIds: body,
      };
    } else if (this.selectedId) {
      if (this.selectedId.length === 0) {
        return swal.fire("Error", "Select items to delete", "error");
      }
      payload = {
        itemIds: this.selectedId,
      };
      //console.log(this.selectedId);
    }

    swal
      .fire({
        title: "Are you sure you want to delete this record?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!",
      })
      .then((result) => {
        //console.log(result);

        if (result.value) {
          return this.setupService
            .deleteData("/hrmsetup/delete/academic/discipline", payload)
            .subscribe(
              (res) => {
                const message = res.status.message.friendlyMessage;
                if (res.status.isSuccessful) {
                  swal.fire("Success", message, "success").then(() => {
                    this.getAcademicDisplines();
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

  checkAll(event) {
    if (event.target.checked) {
      this.selectedId = this.disciplines.map((item) => {
        return item.id;
      });
    } else {
      this.selectedId = [];
    }
  }
}
