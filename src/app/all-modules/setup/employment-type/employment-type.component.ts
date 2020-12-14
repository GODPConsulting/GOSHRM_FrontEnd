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
  //public dtTrigger: Subject<any> = new Subject();
  public dtElement: DataTableDirective;
  public lstEmployee: any;
  //public url: any = "employeelist";
  // public tempId: any;
  // public editId: any;
  public srch = [];
  // public pipe = new DatePipe("en-US");
  // public DateJoin;
  // public statusValue;
  pageLoading: boolean;
  selectedId: any[] = [];

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

  openModal() {
    this.formTitle = "Add Employment Type";
    $("#add_employment_type").modal("show");
  }

  closeModal() {
    $("#add_employment_type").modal("hide");
    this.initializeForm();
  }

  getEmploymentType() {
    this.pageLoading = true;
    return this.setupService
      .getData("/hrmsetup/get/all/employmenttypes")
      .subscribe(
        (data) => {
          this.pageLoading = false;
          //console.log(data);
          this.employmentTypes = data.setuplist;
          this.rows = this.employmentTypes;
          this.srch = [...this.rows];
        },
        (err) => {
          this.pageLoading = false;
          console.log(err);
        }
      );
  }

  // Add employment via reactive form Modal Api Call
  addEmploymentType(Form: FormGroup) {
    const payload = Form.value;
    console.log(payload);
    return this.setupService
      .updateData("/hrmsetup/add/update/employmenttype", payload)
      .subscribe(
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
            .deleteData("/hrmsetup/delete/employmenttype", payload)
            .subscribe(
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

  // To Get The employee Edit Id And Set Values To Edit Modal Form
  edit(row) {
    this.formTitle = "Edit High School Subject";
    this.employmentTypeForm.patchValue({
      id: row.id,
      employment_type: row.employment_type,
      description: row.description,
    });
    $("#add_employment_type").modal("show");
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
      this.selectedId = this.employmentTypes.map((item) => {
        return item.id;
      });
    } else {
      this.selectedId = [];
    }
  }
}
