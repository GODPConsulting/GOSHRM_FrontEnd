import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SetupService } from "src/app/services/setup.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";
import { LoadingService } from "../../../services/loading.service";
import { Subject } from "rxjs";
import { ISearchColumn } from "../../../interface/interfaces";

declare const $: any;
@Component({
  selector: "app-academic-grade",
  templateUrl: "./academic-grade.component.html",
  styleUrls: ["./academic-grade.component.css", "../setup.component.css"],
})
export class AcademicGradeComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  public grades: any[] = [];
  public spinner: boolean = false;
  public formTitle: string = "Add Academic Grade";
  public academicGradeForm: FormGroup;
  public selectedId: number[] = [];
  public academicGradeUploadForm: FormGroup;
  public file: File;
  selectGrades: any[];
  cols: ISearchColumn[];
  constructor(
    private formBuilder: FormBuilder,
    private setupService: SetupService,
    private utilitiesService: UtilitiesService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.cols = [
      {
        header: "",
        field: "",
      },
    ];
    this.getAcademicGrade();
    this.initializeForm();
  }
  getAcademicGrade() {
    this.loadingService.show();
    return this.setupService.getAcademicGrade().subscribe(
      (data) => {
        this.loadingService.hide();
        this.grades = data.setuplist;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  downloadFile() {
    this.loadingService.show();
    this.setupService.downloadAcademicGrade().subscribe(
      (resp) => {
        this.loadingService.hide();
        if (resp) {
          return this.utilitiesService.byteToFile(resp, "Academicgrade.xlsx");
        } else {
          return this.utilitiesService.showError("Unable to download file");
        }
      },
      (err) => {
        this.loadingService.hide();
      }
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
    let payload: any;
    if (this.selectGrades.length === 0) {
      return swal.fire("Error", "Select items to delete", "error");
    }
    this.selectGrades.map((item) => {
      this.selectedId.push(item.id);
    });
    payload = {
      itemIds: this.selectedId,
    };
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
          this.loadingService.show();
          return this.setupService.deleteAcademicGrade(payload).subscribe(
            (res) => {
              this.loadingService.hide();
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                this.utilitiesService.showMessage(res, "success").then(() => {
                  this.getAcademicGrade();
                });
              } else {
                return this.utilitiesService.showMessage(res, "error");
              }
            },
            (err) => {
              this.loadingService.hide();
              this.utilitiesService.showMessage(err, "error");
            }
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
