import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SetupService } from "src/app/services/setup.service";

import swal from "sweetalert2";

declare const $: any;
@Component({
  selector: "app-academic-qualification",
  templateUrl: "./academic-qualification.component.html",
  styleUrls: [
    "./academic-qualification.component.css",
    "../setup.component.css",
  ],
})
export class AcademicQualificationComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  @ViewChild('fileInput') fileInput: ElementRef
  public qualifications: any[] = [];
  public rows = [];
  public srch = [];
  pageLoading: boolean;

  spinner: boolean = false;
  public formTitle = "Add Academic Qualification";
  public academicQualificationForm: FormGroup;
  selectedId: any[] = [];
  public academicQualificationUploadForm: FormGroup;
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
    this.getAcademicQualifications();
    this.initializeForm();
  }

  stopParentEvent(event) {
    event.stopPropagation();
  }

  onSelectedFile(event) {
    this.file = event.target.files[0];
    this.academicQualificationUploadForm.patchValue({
      uploadInput: this.file,
    });
  }

  uploadAcademicQualification() {
    const formData = new FormData();
    formData.append(
      "uploadInput",
      this.academicQualificationUploadForm.get("uploadInput").value
    );
    if (!this.file) {
      return swal.fire('error', 'select a file', 'error')
    }

    //console.log(formData, this.jobGradeUploadForm.get("uploadInput").value);
    this.spinner = true;
    return this.setupService
      .updateData("/hrmsetup/upload/academic/qualification", formData)
      .subscribe(
        (res) => {
          this.spinner = false;
          const message = res.status.message.friendlyMessage;
          if (res.status.isSuccessful) {
            swal.fire("Success", message, "success");
            this.initializeForm();
            this.fileInput.nativeElement.value = ''
            $("#upload_academic_qualification").modal("hide");
          } else {
            swal.fire("Error", message, "error");
          }
          this.getAcademicQualifications();
        },
        (err) => {
          this.spinner = false;
          const message = err.status.message.friendlyMessage;
          swal.fire("Error", message, "error");
        }
      );
  }

  initializeForm() {
    this.academicQualificationForm = this.formBuilder.group({
      id: [0],
      qualification: ["", Validators.required],
      description: ["", Validators.required],
      rank: ["", Validators.required],
    });
    this.academicQualificationUploadForm = this.formBuilder.group({
      uploadInput: [""],
    });
  }

  getAcademicQualifications() {
    this.pageLoading = true;
    return this.setupService
      .getData("/hrmsetup/get/all/academic/qualifications")
      .subscribe(
        (data) => {
          this.pageLoading = false;
          //console.log(data);
          this.qualifications = data.setuplist;
          this.rows = this.qualifications;
          this.srch = [...this.rows];
        },
        (err) => {
          this.pageLoading = false;
          console.log(err);
        }
      );
  }
  // Add employee  Modal Api Call
  addAcademicQualification(academicQualificationForm: FormGroup) {
    const payload = academicQualificationForm.value;
    return this.setupService
      .updateData("/hrmsetup/add/update/academic/qualification", payload)
      .subscribe(
        (res) => {
          const message = res.status.message.friendlyMessage;
          //console.log(message);

          if (res.status.isSuccessful) {
            swal.fire("Success", message, "success");
            this.initializeForm();
            $("#add_academic_qualification").modal("hide");
          } else {
            swal.fire("Error", message, "error");
          }
          this.getAcademicQualifications();
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
            .deleteData("/hrmsetup/delete/academic/qualification", payload)
            .subscribe(
              (res) => {
                const message = res.status.message.friendlyMessage;
                if (res.status.isSuccessful) {
                  swal.fire("Success", message, "success").then(() => {
                    this.getAcademicQualifications();
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
  editAcademicQualification(row) {
    this.formTitle = "Edit Academic Qualification";
    this.academicQualificationForm.patchValue({
      id: row.id,
      qualification: row.qualification,
      description: row.description,
      rank: row.rank,
    });
    $("#add_academic_qualification").modal("show");
  }

  openUploadModal() {
    $("#upload_academic_qualification").modal("show");
  }

  openModal() {
    $("#add_academic_qualification").modal("show");
  }

  closeModal() {
    $("#add_academic_qualification").modal("hide");
    this.initializeForm();
  }
  checkAll(event) {
    if (event.target.checked) {
      this.selectedId = this.qualifications.map((item) => {
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
