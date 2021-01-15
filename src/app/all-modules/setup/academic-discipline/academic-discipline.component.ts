import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { SetupService } from "../../../services/setup.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import swal from "sweetalert2";
import { saveAs } from "file-saver";

declare const $: any;
@Component({
  selector: "app-academic-discipline",
  templateUrl: "./academic-discipline.component.html",
  styleUrls: ["./academic-discipline.component.css", "../setup.component.css"],
})
export class AcademicDisciplineComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  @ViewChild("fileInput")
  fileInput: ElementRef;
  public disciplines: any[] = [];
  public academicDisciplineForm: FormGroup;
  public academicDisciplineUploadForm: FormGroup;
  public formTitle: string = "Add Academic Discipline";
  public pageLoading: boolean;
  public spinner: boolean = false;
  public selectedId: number[] = [];
  public file: File;

  constructor(
    private setupService: SetupService,
    private formBuilder: FormBuilder
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
    this.initializeForm();
    this.getAcademicDisplines();
  }

  // prevents the"editAcademicGrade(row)" from working on checkbox
  stopParentEvent(event) {
    event.stopPropagation();
  }

  // appends a selected file to "uploadInput"
  onSelectedFile(event) {
    this.file = event.target.files[0];
    this.academicDisciplineUploadForm.patchValue({
      uploadInput: this.file,
    });
  }

  uploadAcademicDiscipline() {
    if (!this.file) {
      return swal.fire("Error", "Select a file", "error");
    }
    const formData = new FormData();
    formData.append(
      "uploadInput",
      this.academicDisciplineUploadForm.get("uploadInput").value
    );
    this.spinner = true;
    return this.setupService
      .updateData("/hrmsetup/upload/academic/discipline", formData)
      .subscribe(
        (res) => {
          this.spinner = false;
          const message = res.status.message.friendlyMessage;
          if (res.status.isSuccessful) {
            swal.fire("Success", message, "success");
            $("#upload_academic_discipline").modal("hide");
          } else {
            swal.fire("Error", message, "error");
          }
          this.getAcademicDisplines();
        },
        (err) => {
          this.spinner = false;
          const message = err.status.message.friendlyMessage;
          swal.fire("Error", message, "error");
        }
      );
  }

  downloadFile() {
    this.setupService
      .exportExcelFile("/hrmsetup/download/academic/disciplines")
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
              const file = new File([bb], "Academic Discipline.xlsx", {
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
        () => {}
      );
  }

  openUploadModal() {
    $("#upload_academic_discipline").modal("show");
    this.fileInput.nativeElement.value = "";
  }

  initializeForm() {
    this.academicDisciplineForm = this.formBuilder.group({
      id: [0],
      discipline: ["", Validators.required],
      description: ["", Validators.required],
      rank: ["", Validators.required],
    });
    this.academicDisciplineUploadForm = this.formBuilder.group({
      uploadInput: [""],
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
        },
        (err) => {
          this.pageLoading = false;
          console.log(err);
        }
      );
  }

  // Add Academic Discipline  Modal
  addAcademicDiscipline(form: FormGroup) {
    if (!form.valid) {
      swal.fire("Error", "Please complete all fields", "error");
      return;
    }
    const payload = form.value;
    //console.log(payload);
    payload.rank = parseInt(payload.rank);
    this.spinner = true;
    return this.setupService
      .updateData("/hrmsetup/add/update/academic/discipline", payload)
      .subscribe(
        (res) => {
          this.spinner = false;
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
          this.spinner = false;
          const message = err.status.message.friendlyMessage;
          swal.fire("Error", message, "error");
        }
      );
  }

  // Set Values To Edit Modal Form
  edit(row) {
    this.formTitle = "Edit Academic Discipline";
    this.academicDisciplineForm.patchValue({
      id: row.id,
      discipline: row.discipline,
      description: row.description,
      rank: row.rank,
    });
    $("#add_academic_discipline").modal("show");
  }

  openModal() {
    this.formTitle = "Add Academic Discipline";
    $("#add_academic_discipline").modal("show");
    this.initializeForm();
  }

  closeModal() {
    $("#add_academic_discipline").modal("hide");
  }

  delete() {
    let payload;
    if (this.selectedId) {
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
      this.selectedId = this.disciplines.map((item) => {
        return item.id;
      });
    } else {
      this.selectedId = [];
    }
  }
}
