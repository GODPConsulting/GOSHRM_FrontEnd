import { Component, OnInit, ViewChild } from "@angular/core";
import { SetupService } from "../../../services/setup.service";
import { DataTableDirective } from "angular-datatables";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { Subject } from "rxjs";
import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";

declare const $: any;
@Component({
  selector: "app-language",
  templateUrl: "./language.component.html",
  styleUrls: ["./language.component.css", "../setup.component.css"],
})
export class LanguageComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public lstEmployee: any;
  public languages: any[] = [];
  public url: any = "languagelist";

  public languageUploadForm: FormGroup;
  file: File;
  public editEmployeeForm: FormGroup;
  formTitle: string = "Add language";
  public rows = [];
  public srch = [];
  public statusValue;
  pageLoading: boolean;
  loading: boolean = true;
  value: any;
  selectedId: any[] = [];
  languageForm: FormGroup;

  constructor(
    private setupService: SetupService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    $(".floating")
      .on("focus blur", function (e) {
        $(this)
          .parents(".form-focus")
          .toggleClass("focused", e.type === "focus" || this.value.length > 0);
      })
      .trigger("blur");

    this.dtOptions = {
      dom:
        "<'row'<'col-sm-8 col-md-5'f><'col-sm-4 col-md-6 align-self-end'l>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Start typing to search by any field",
      },
      columns: [{ orderable: false }, null, null],
      order: [[1, "asc"]],
    };
    this.initializeForm();
    this.getLanguage();
  }

  onSelectedFile(event) {
    this.file = event.target.files[0];
    this.languageUploadForm.patchValue({
      uploadInput: this.file,
    });
  }

  uploadLanguage() {
    this.loading = true;
    const formData = new FormData();
    formData.append(
      "uploadInput",
      this.languageUploadForm.get("uploadInput").value
    );
    //console.log(formData, this.languageForm.get("uploadInput").value);
    return this.setupService
      .updateData("/hrmsetup/upload/language", formData)
      .subscribe(
        (res) => {
          const message = res.status.message.friendlyMessage;
          if (res.status.isSuccessful) {
            swal.fire("Success", message, "success");
            this.initializeForm();
            $("#upload_language").modal("hide");
          } else {
            swal.fire("Error", message, "error");
          }
          this.getLanguage();
          this.loading = false;
        },
        (err) => {
          const message = err.status.message.friendlyMessage;
          swal.fire("Error", message, "error");
        }
      );
  }
  openUploadModal() {
    $("#upload_language").modal("show");
  }

  initializeForm() {
    this.languageForm = this.formBuilder.group({
      id: [0],
      language: ["", Validators.required],
      description: ["", Validators.required],
    });
    this.languageUploadForm = this.formBuilder.group({
      uploadInput: [""],
    });
  }
  getLanguage() {
    this.pageLoading = true;
    return this.setupService.getData("/hrmsetup/get/all/languages").subscribe(
      (data) => {
        this.pageLoading = false;
        //console.log(data);
        this.languages = data.setuplist;
        this.rows = this.languages;
        this.srch = [...this.rows];
      },
      (err) => {
        this.pageLoading = false;
        this.loading = false;
        console.log(err);
      }
    );
  }

  // Get Employee  Api Call
  loadLanguage() {
    // this.srvModuleService.get(this.url).subscribe((data) => {
    //   this.lstEmployee = data;
    //   this.rows = this.lstEmployee;
    // this.srch = [...this.rows];
    // });
  }

  // Add employee  Modal Api Call
  // addData(languageForm: FormGroup) {
  //   const payload = languageForm.value;
  //   return this.setupService.updateLanguage(payload).subscribe(
  //     res => {
  //       const message = res.status.message.friendlyMessage;
  //       if (res.status.isSuccessful) {
  //         swal.fire('Success', message, 'success')
  //         this.initializeForm();
  //         $("#add_language").modal("hide");
  //       } else {
  //         swal.fire('Error', message, 'error')
  //       }
  //       this.getLanguage();
  //     },
  //     err => {
  //       const message = err.status.message.friendlyMessage;
  //       swal.fire('Error', message, 'error')
  //     }
  //   );
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
  //}

  // edit modal api call
  editLanguage() {
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

  // To Get The employee Edit Id And Set Values To Edit Modal Form
  edit(row) {
    this.formTitle = "Edit Language";
    this.languageForm.patchValue({
      id: row.id,
      language: row.language,
      description: row.description,
    });
    $("#add_language").modal("show");
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
  deleteLanguage() {
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
    let temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.subject.toLowerCase().indexOf(val) !== -1 || !val;
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

  openModal() {
    $("#add_language").modal("show");
  }

  closeModal() {
    $("#add_language").modal("hide");
    this.initializeForm();
  }

  addLanguage(languageForm: FormGroup) {
    const payload = languageForm.value;
    return this.setupService
      .updateData("/hrmsetup/add/update/language", payload)
      .subscribe(
        (res) => {
          const message = res.status.message.friendlyMessage;
          //console.log(message);

          if (res.status.isSuccessful) {
            swal.fire("Success", message, "success");
            this.initializeForm();
            $("#add_language").modal("hide");
          } else {
            swal.fire("Error", message, "error");
          }
          this.getLanguage();
        },
        (err) => {
          const message = err.status.message.friendlyMessage;
          swal.fire("Error", message, "error");
        }
      );
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
            .deleteData("/hrmsetup/delete/language", payload)
            .subscribe(
              (res) => {
                const message = res.status.message.friendlyMessage;
                if (res.status.isSuccessful) {
                  swal.fire("Success", message, "success").then(() => {
                    this.getLanguage();
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
    this.selectedId = [];
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
      this.selectedId = this.languages.map((item) => {
        return item.id;
      });
    } else {
      this.selectedId = [];
    }
  }
}
