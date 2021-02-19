import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SetupService } from "src/app/services/setup.service";
import { UtilitiesService } from "src/app/services/utilities.service";
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
    this.getAcademicGrade();
    this.initializeForm();
  }
  getAcademicGrade() {
    this.pageLoading = true;
    return this.setupService.getAcademicGrade().subscribe(
      (data) => {
        this.pageLoading = false;
        this.grades = data.setuplist;
      },
      (err) => {
        this.pageLoading = false;
      }
    );
  }

  downloadFile() {
    this.setupService.downloadAcademicGrade().subscribe(
        (resp) => {
          const data = resp;
          this.utilitiesService.byteToFile(data,"Academicgrade.xlsx")
        },
        (err) => {}
      );
  }

  uploadAcademicGrade() {
    // Checks if a file has been selected
    if (!this.academicGradeUploadForm.get("uploadInput").value) {
      return swal.fire("Error", "Select a file", "error");
    }
    const formData = new FormData();
    formData.append(
      "uploadInput",
      this.academicGradeUploadForm.get("uploadInput").value
    );
    this.spinner = true;
    return this.setupService.uploadAcademicGrade(formData).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          this.initializeForm();
          $("#upload_academic_grade").modal("hide");
        } else {
          swal.fire("GOSHRM", message, "error");
        }
        this.getAcademicGrade();
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  initializeForm() {
    this.formTitle = "Add Academic Grade";

    // Initialize the add modal form
    this.academicGradeForm = this.formBuilder.group({
      id: [0],
      grade: ["", Validators.required],
      description: [""],
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
    this.initializeForm();

    $("#add-academic-grade").modal("show");
  }

  closeModal() {
    $("#add-academic-grade").modal("hide");
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
    return this.setupService.addAcademicGrade(payload).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;

        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          this.initializeForm();
          $("#add-academic-grade").modal("hide");
        } else {
          swal.fire("GOSHRM", message, "error");
        }
        
        this.getAcademicGrade();
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
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
          this.pageLoading = true;
          return this.setupService.deleteAcademicGrade(payload).subscribe(
            (res) => {
              this.pageLoading = false;
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOSHRM", message, "success").then(() => {
                  this.getAcademicGrade();
                });
              } else {
                swal.fire("GOSHRM", message, "error");
              }
            },
            (err) => {}
          );
        }
      });
    this.selectedId = [];
  }

  // Checks all items in table
  checkAll(event: Event) {
    this.selectedId = this.utilitiesService.checkAllBoxes(event, this.grades);
  }

  // Adds selected items to an array for multi delete
  addItemId(event: Event, id: number) {
    this.utilitiesService.deleteArray(event, id, this.selectedId);
  }

  // Prevents the edit modal from popping up when checkbox is clicked
  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
  }

  // Appends a selected file to "uploadInput"
  onSelectedFile(event: Event, form: FormGroup) {
    this.utilitiesService.uploadFileValidator(event, form, "hr");
  }
}
