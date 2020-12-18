import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SetupService } from "src/app/services/setup.service";
import swal from "sweetalert2";
declare const $: any;
@Component({
  selector: "app-academic-grade",
  templateUrl: "./academic-grade.component.html",
  styleUrls: ["./academic-grade.component.css", "../setup.component.css"],
})
export class AcademicGradeComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  public grades: any[] = [];
  public rows = [];
  public srch = [];
  pageLoading: boolean;
  public formTitle = "Add Academic Grade";
  public academicGradeForm: FormGroup;
  selectedId: any[] = [];
  public academicGradeUploadForm: FormGroup;
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
    this.dtOptions = {
      dom:
        "<'row'<'col-sm-8 col-md-5'f><'col-sm-4 col-md-6 align-self-end'l>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Start typing to search by any field",
      },
      columns: [{ orderable: false }, null, null, null],
      order: [[1, "asc"]],
    };
    this.getAcademicGrade();
    this.initializeForm();
  }

  onSelectedFile(event) {
    this.file = event.target.files[0];
    this.academicGradeUploadForm.patchValue({
      uploadInput: this.file,
    });
  }

  uploadAcademicGrade() {
    const formData = new FormData();
    formData.append(
      "uploadInput",
      this.academicGradeUploadForm.get("uploadInput").value
    );

    //console.log(formData, this.jobGradeUploadForm.get("uploadInput").value);
    return this.setupService
      .updateData("/hrmsetup/upload/academic/grade", formData)
      .subscribe(
        (res) => {
          const message = res.status.message.friendlyMessage;
          if (res.status.isSuccessful) {
            swal.fire("Success", message, "success");
            this.initializeForm();
            $("#upload_academic_grade").modal("hide");
          } else {
            swal.fire("Error", message, "error");
          }
          this.getAcademicGrade();
        },
        (err) => {
          const message = err.status.message.friendlyMessage;
          swal.fire("Error", message, "error");
        }
      );
  }

  initializeForm() {
    this.academicGradeForm = this.formBuilder.group({
      id: [0],
      grade: ["", Validators.required],
      description: ["", Validators.required],
      rank: ["", Validators.required],
    });
    this.academicGradeUploadForm = this.formBuilder.group({
      uploadInput: [""],
    });
  }

  getAcademicGrade() {
    this.pageLoading = true;
    return this.setupService
      .getData("/hrmsetup/get/all/academic/grades")
      .subscribe(
        (data) => {
          this.pageLoading = false;
          this.grades = data.setuplist;
          this.rows = this.grades;
          this.srch = [...this.rows];
        },
        (err) => {
          this.pageLoading = false;
          console.log(err);
        }
      );
  }

  openUploadModal() {
    $("#upload_academic_grade").modal("show");
  }

  openModal() {
    $("#add-academic-grade").modal("show");
  }

  closeModal() {
    $("#add-academic-grade").modal("hide");
    this.initializeForm();
  }

  // Add employee  Modal Api Call
  addAcademicGrade(academicGradeForm: FormGroup) {
    const payload = academicGradeForm.value;
    payload.rank = +payload.rank;
    return this.setupService
      .updateData("/hrmsetup/add/update/academic/grade", payload)
      .subscribe(
        (res) => {
          const message = res.status.message.friendlyMessage;
          //console.log(message);

          if (res.status.isSuccessful) {
            swal.fire("Success", message, "success");
            this.initializeForm();
            $("#add-academic-grade").modal("hide");
          } else {
            swal.fire("Error", message, "error");
          }
          this.getAcademicGrade();
        },
        (err) => {
          const message = err.status.message.friendlyMessage;
          swal.fire("Error", message, "error");
        }
      );
  }

  // To Get The employee Edit Id And Set Values To Edit Modal Form
  editAcademicGrade(row) {
    this.formTitle = "Edit Academic Grade";
    this.academicGradeForm.patchValue({
      id: row.id,
      grade: row.grade,
      description: row.description,
      rank: row.rank,
    });
    $("#add-academic-grade").modal("show");
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
            .deleteData("/hrmsetup/delete/academic/grade", payload)
            .subscribe(
              (res) => {
                const message = res.status.message.friendlyMessage;
                if (res.status.isSuccessful) {
                  swal.fire("Success", message, "success").then(() => {
                    this.getAcademicGrade();
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

  /* deleteItems() {
    if (this.selectedId.length === 0) {
      return swal.fire("Error", "Select items to delete", "error");
    }
    const payload = {
      itemIds: this.selectedId,
    };
    console.log(this.selectedId);

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
          return this.setupService
            .deleteData("/hrmsetup/delete/hmo", payload)
            .subscribe(
              (res) => {
                const message = res.status.message.friendlyMessage;
                if (res.status.isSuccessful) {
                  swal.fire("Success", message, "success").then(() => {
                    this.getHmo();
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
  } */

  checkAll(event) {
    if (event.target.checked) {
      this.selectedId = this.grades.map((item) => {
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

  /*  getHmo() {
    this.pageLoading = true;
    return this.setupService.getHmos().subscribe(
      (data) => {
        this.pageLoading = false;
        console.log(data);
        this.hmos = data.setuplist;
        this.rows = this.hmos;
        this.srch = [...this.rows];
      },
      (err) => {
        this.pageLoading = false;
        console.log(err);
      }
    );
  } */
}
