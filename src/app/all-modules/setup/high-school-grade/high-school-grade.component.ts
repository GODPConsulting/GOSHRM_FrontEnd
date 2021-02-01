import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SetupService } from "src/app/services/setup.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";

declare const $: any;
@Component({
  selector: "app-high-school-grade",
  templateUrl: "./high-school-grade.component.html",
  styleUrls: ["./high-school-grade.component.css", "../setup.component.css"],
})
export class HighSchoolGradeComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  @ViewChild("fileInput") fileInput: ElementRef;
  public grades: any[] = [];
  public pageLoading: boolean;
  public spinner: boolean = false;
  public formTitle: string = "Add High School Grade";
  public highSchoolGradeForm: FormGroup;
  public selectedId: number[] = [];
  public highSchoolGradeUploadForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private setupService: SetupService,
    private utilitiesService: UtilitiesService
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
    this.getHighSchoolGrade();
    this.initializeForm();
  }

  downloadFile() {
    this.setupService
      .exportExcelFile("/hrmsetup/download/highschoolgrades")
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
              const file = new File([bb], "High School Grade.xlsx", {
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
                "High School Grade.xlsx"
              );
            }
          } else {
            return swal.fire(`GOS HRM`, "Unable to download data", "error");
          }
        },
        (err) => {}
      );
  }

  uploadHighSchoolGrade() {
    if (!this.highSchoolGradeUploadForm.get("uploadInput").value) {
      return swal.fire("Error", "Select a file", "error");
    }
    const formData = new FormData();
    formData.append(
      "uploadInput",
      this.highSchoolGradeUploadForm.get("uploadInput").value
    );

    this.spinner = true;
    return this.setupService.uploadHighSchoolGrade(formData).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          this.initializeForm();
          $("#upload_high_school_grade").modal("hide");
        } else {
          swal.fire("Error", message, "error");
        }
        this.getHighSchoolGrade();
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("Error", message, "error");
      }
    );
  }

  openUploadModal() {
    // Resets the upload form
    this.fileInput.nativeElement.value = "";
    $("#upload_high_school_grade").modal("show");
  }

  initializeForm() {
    this.highSchoolGradeForm = this.formBuilder.group({
      id: [0],
      grade: ["", Validators.required],
      description: ["", Validators.required],
      rank: ["", Validators.required],
    });
    this.highSchoolGradeUploadForm = this.formBuilder.group({
      uploadInput: [""],
    });
  }

  getHighSchoolGrade() {
    this.pageLoading = true;
    return this.setupService.getHighSchoolGrade().subscribe(
      (data) => {
        this.pageLoading = false;
        //console.log(data);
        this.grades = data.setuplist;
      },
      (err) => {
        this.pageLoading = false;
        console.log(err);
      }
    );
  }

  // Add employee  Modal Api Call
  addHighSchoolGrade(form: FormGroup) {
    if (!form.valid) {
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    const payload = form.value;
    this.spinner = true;
    return this.setupService.addHighSchoolGrade(payload).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        //console.log(message);
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          this.initializeForm();
          $("#add_high_school_grade").modal("hide");
        } else {
          swal.fire("Error", message, "error");
        }
        this.getHighSchoolGrade();
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("Error", message, "error");
      }
    );
  }

  openModal() {
    $("#add_high_school_grade").modal("show");
  }

  closeModal() {
    $("#add_high_school_grade").modal("hide");
    this.initializeForm();
  }

  editHighSchoolGrade(row) {
    this.formTitle = "Edit High School Grade";
    this.highSchoolGradeForm.patchValue({
      id: row.id,
      grade: row.grade,
      rank: row.rank,
      description: row.description,
    });
    $("#add_high_school_grade").modal("show");
  }

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
          return this.setupService.deleteHighSchoolGrade(payload).subscribe(
            (res) => {
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOSHRM", message, "success").then(() => {
                  this.getHighSchoolGrade();
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

  // Prevents the edit modal from popping up when checkbox is clicked
  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
  }

  // Appends a selected file to "uploadInput"
  onSelectedFile(event: Event, form: FormGroup) {
    this.utilitiesService.patchFile(event, form);
  }

  checkAll(event: Event) {
    this.selectedId = this.utilitiesService.checkAllBoxes(event, this.grades);
  }

  addItemId(event: Event, id: number) {
    this.utilitiesService.deleteArray(event, id, this.selectedId);
  }
}
