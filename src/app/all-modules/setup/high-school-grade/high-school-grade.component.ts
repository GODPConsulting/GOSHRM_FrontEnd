import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SetupService } from "src/app/services/setup.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";
import { LoadingService } from "../../../services/loading.service";
import { Subject } from "rxjs";
import { ISearchColumn } from "../../../interface/interfaces";

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
  public spinner: boolean = false;
  public formTitle: string = "Add High School Grade";
  public highSchoolGradeForm: FormGroup;
  public selectedId: number[] = [];
  public highSchoolGradeUploadForm: FormGroup;
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
        header: "grade",
        field: "grade",
      },
    ];
    this.getHighSchoolGrade();
    this.initializeForm();
  }

  downloadFile() {
    this.loadingService.show();
    this.setupService
      .exportExcelFile("/hrmsetup/download/highschoolgrades")
      .subscribe(
        (resp) => {
          this.loadingService.hide();
          this.utilitiesService.byteToFile(resp, "High School Grade.xlsx", {
            type: "application/vnd.ms-excel",
          });
        },
        (err) => {
          this.loadingService.hide();
        }
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
          swal.fire("GOSHRM", message, "error");
        }
        this.getHighSchoolGrade();
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  openUploadModal() {
    // Resets the upload form
    this.fileInput.nativeElement.value = "";
    $("#upload_high_school_grade").modal("show");
  }

  initializeForm() {
    this.formTitle = "Add High School Grade";
    this.highSchoolGradeForm = this.formBuilder.group({
      id: [0],
      grade: ["", Validators.required],
      description: [""],
      rank: ["", Validators.required],
    });
    this.highSchoolGradeUploadForm = this.formBuilder.group({
      uploadInput: [""],
    });
  }

  getHighSchoolGrade() {
    this.loadingService.show();
    return this.setupService.getHighSchoolGrade().subscribe(
      (data) => {
        this.loadingService.hide();
        this.grades = data.setuplist;
      },
      (err) => {
        this.loadingService.hide();
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

        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          this.initializeForm();
          $("#add_high_school_grade").modal("hide");
        } else {
          swal.fire("GOSHRM", message, "error");
        }
        this.getHighSchoolGrade();
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  openModal() {
    this.initializeForm();
    $("#add_high_school_grade").modal("show");
  }

  closeModal() {
    $("#add_high_school_grade").modal("hide");
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
          return this.setupService.deleteHighSchoolGrade(payload).subscribe(
            (res) => {
              this.loadingService.hide();
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOSHRM", message, "success").then(() => {
                  this.getHighSchoolGrade();
                });
              } else {
                swal.fire("GOSHRM", message, "error");
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

  // Prevents the edit modal from popping up when checkbox is clicked
  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
  }

  // Appends a selected file to "uploadInput"
  onSelectedFile(event: Event, form: FormGroup) {
    this.utilitiesService.uploadFileValidator(event, form, "hr");
  }

  checkAll(event: Event) {
    this.selectedId = this.utilitiesService.checkAllBoxes(event, this.grades);
  }

  addItemId(event: Event, id: number) {
    this.utilitiesService.deleteArray(event, id, this.selectedId);
  }
}
