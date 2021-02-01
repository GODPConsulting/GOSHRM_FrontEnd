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
  public pageLoading: boolean;
  public spinner: boolean = false;
  public formTitle: string = "Add Academic Grade";
  public academicGradeForm: FormGroup;
  public selectedId: number[] = [];
  public academicGradeUploadForm: FormGroup;
  public file: File;

  constructor(
    private formBuilder: FormBuilder,
    private setupService: SetupService
  ) {}

  ngOnInit(): void {
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
  getAcademicGrade() {
    this.pageLoading = true;
    return this.setupService
      .getAcademicGrade()
      .subscribe(
        (data) => {
          this.pageLoading = false;
          this.grades = data.setuplist;
        },
        (err) => {
          this.pageLoading = false;
          console.log(err);
        }
      );
  }

  // Prevents the edit modal from popping up when checkbox is clicked
  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
  }

  // Appends a selected file to "uploadInput"
  onSelectedFile(event) {
    this.file = event.target.files[0];
    this.academicGradeUploadForm.patchValue({
      uploadInput: this.file,
    });
  }

  downloadFile() {
    this.setupService
      .exportExcelFile("/hrmsetup/download/academic/grades")
      .subscribe(
        (resp) => {
          const data = resp;
          if (data != undefined) {
            const byteString = atob(data);
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
            }
            const bb = new Blob([ab]);
            try {
              const file = new File([bb], "Academic Grade.xlsx", {
                type: "application/vnd.ms-excel",
              });
              console.log(file, bb);
              saveAs(file);
            } catch (err) {
              const textFileAsBlob = new Blob([bb], {
                type: "application/vnd.ms-excel",
              });
              window.navigator.msSaveBlob(
                textFileAsBlob,
                "Deposit Category.xlsx"
              );
            }
          } else {
            return swal.fire(`GOS HRM`, "Unable to download data", "error");
          }
        },
        (err) => {}
      );
  }

  uploadAcademicGrade() {
    // Checks if a file has been selected
    if (!this.file) {
      return swal.fire("Error", "Select a file", "error");
    }
    const formData = new FormData();
    formData.append(
      "uploadInput",
      this.academicGradeUploadForm.get("uploadInput").value
    );
    this.spinner = true;
    return this.setupService
      .updateData("/hrmsetup/upload/academic/grade", formData)
      .subscribe(
        (res) => {
          this.spinner = false;
          const message = res.status.message.friendlyMessage;
          if (res.status.isSuccessful) {
            swal.fire("GOSHRM", message, "success");
            this.initializeForm();
            $("#upload_academic_grade").modal("hide");
          } else {
            swal.fire("Error", message, "error");
          }
          this.getAcademicGrade();
        },
        (err) => {
          this.spinner = false;
          const message = err.status.message.friendlyMessage;
          swal.fire("Error", message, "error");
        }
      );
  }

  initializeForm() {
    // Initialize the add modal form
    this.academicGradeForm = this.formBuilder.group({
      id: [0],
      grade: ["", Validators.required],
      description: ["", Validators.required],
      rank: ["", Validators.required],
    });

    // Initialize the upload form
    this.academicGradeUploadForm = this.formBuilder.group({
      uploadInput: [""],
    });
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

  // Add academic grade  Modal
  addAcademicGrade(form: FormGroup) {
    if (!form.valid) {
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    const payload = form.value;
    payload.rank = +payload.rank;
    this.spinner = true;
    return this.setupService
      .updateData("/hrmsetup/add/update/academic/grade", payload)
      .subscribe(
        (res) => {
          this.spinner = false;
          const message = res.status.message.friendlyMessage;
          //console.log(message);
          if (res.status.isSuccessful) {
            swal.fire("GOSHRM", message, "success");
            this.initializeForm();
            $("#add-academic-grade").modal("hide");
          } else {
            swal.fire("Error", message, "error");
          }
          this.getAcademicGrade();
        },
        (err) => {
          this.spinner = false;
          const message = err.status.message.friendlyMessage;
          swal.fire("Error", message, "error");
        }
      );
  }

  // Set Values To Edit Modal Form
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

  // Deleting items from table
  delete() {
    let payload: object;
    if (this.selectedId.length === 0) {
      return swal.fire("Error", "Select items to delete", "error");
    } else {
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
                  swal.fire("GOSHRM", message, "success").then(() => {
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
    this.selectedId = [];
  }

  // Checks all items in table
  checkAll(event) {
    if (event.target.checked) {
      this.selectedId = this.grades.map((item) => {
        return item.id;
      });
    } else {
      this.selectedId = [];
    }
  }

  // Adds selected items to an array for multi delete
  addItemId(event, id: number) {
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
