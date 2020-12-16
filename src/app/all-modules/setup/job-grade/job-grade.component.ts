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
  styleUrls: ["./job-grade.component.css","../setup.component.css"]
})
export class JobGradeComponent implements OnInit {
  formTitle;
  public dtOptions: DataTables.Settings = {};
  //@ViewChild(DataTableDirective, { static: false })
  public jobGradeForm: FormGroup;
  //public employeeForm: FormGroup;
  public jobGrades: any[] = [];
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
  selectedId: any[] = [];
  pageLoading: boolean;
  public jobGradeUploadForm: FormGroup;
  file: File;

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

    this.getJobGrade();
    this.initializeForm();
  }

  onSelectedFile(event) {
    this.file = event.target.files[0];
    this.jobGradeUploadForm.patchValue({
      uploadInput: this.file,
    });
  }

  uploadJobGrade() {
    const formData = new FormData();
    formData.append(
      "uploadInput",
      this.jobGradeUploadForm.get("uploadInput").value
    );

    //console.log(formData, this.jobGradeUploadForm.get("uploadInput").value);
    return this.setupService
      .updateData("/hrmsetup/upload/jobgrade", formData)
      .subscribe(
        (res) => {
          const message = res.status.message.friendlyMessage;
          if (res.status.isSuccessful) {
            swal.fire("Success", message, "success");
            this.initializeForm();
            $("#upload_job_grade").modal("hide");
          } else {
            swal.fire("Error", message, "error");
          }
          this.getJobGrade();
        },
        (err) => {
          const message = err.status.message.friendlyMessage;
          swal.fire("Error", message, "error");
        }
      );
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
    //initialize upload form
    this.jobGradeUploadForm = this.formBuilder.group({
      uploadInput: [""],
    });
  }

  openUploadModal() {
    $("#upload_job_grade").modal("show");
  }

  openModal() {
    this.initializeForm();
    this.formTitle = "Add Job Grade";
    $("#add_job_grade").modal("show");
    if (this.jobGrades.length === 0) {
      this.jobGradeForm.get("job_grade_reporting_to").disable();
    } else {
      this.jobGradeForm.get("job_grade_reporting_to").enable();
    }
  }

  closeModal() {
    $("#add_job_grade").modal("hide");
    this.initializeForm();
  }

  getJobGrade() {
    this.pageLoading = true;
    return this.setupService.getData("/hrmsetup/get/all/jobgrades").subscribe(
      (data) => {
        this.pageLoading = false;
        //console.log(data);
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

  // AddjobGrade Modal Api Call
  addJobGrade(Form: FormGroup) {
    const payload = Form.value;
    console.log(payload);
    return this.setupService
      .updateData("/hrmsetup/add/update/jobgrade", payload)
      .subscribe(
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
          this.getJobGrade();
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
      console.log("b", body);
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
      console.log("s", this.selectedId);
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
            .deleteData("/hrmsetup/delete/jobgrade", payload)
            .subscribe(
              (res) => {
                const message = res.status.message.friendlyMessage;
                if (res.status.isSuccessful) {
                  swal.fire("Success", message, "success").then(() => {
                    this.getJobGrade();
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
}
