import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { SetupService } from "../../../services/setup.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import swal from "sweetalert2";
import { UtilitiesService } from "src/app/services/utilities.service";
import { LoadingService } from "../../../services/loading.service";
import { Subject } from "rxjs";
import { IHighSchool, ISearchColumn } from "../../../interface/interfaces";

declare const $: any;
@Component({
  selector: "app-high-school-subjects",
  templateUrl: "./high-school-subjects.component.html",
  styleUrls: ["./high-school-subjects.component.css", "../setup.component.css"],
})
export class HighSchoolSubjectsComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  @ViewChild("fileInput") fileInput: ElementRef;
  public subjects: any[] = [];
  public highSchoolForm: FormGroup;
  public formTitle = "Add High School Subject";
  public spinner = false;
  public selectedId: number[] = [];
  public highSchoolSubUploadForm: FormGroup;
  dtTrigger: Subject<any> = new Subject();
  selectedSubjects: IHighSchool[] = [];
  cols: ISearchColumn[] = [];
  constructor(
    private setupService: SetupService,
    private formBuilder: FormBuilder,
    private utilitiesService: UtilitiesService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.cols = [
      {
        header: "subject",
        field: "subject",
      },
    ];
    this.dtOptions = {
      dom:
        "<'row'<'col-sm-8 col-md-5'f><'col-sm-4 col-md-6 align-self-end'l>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Start typing to search by any field",
      },
      columns: [{ orderable: false }, null, null],
      order: [[1, "asc"]],
    };
    this.initializeForm();
    this.getHighSchoolSub();
  }

  downloadFile() {
    this.loadingService.show();
    this.setupService
      .exportExcelFile("/hrmsetup/download/highschoolsubjects")
      .subscribe(
        (resp) => {
          this.loadingService.hide();
          this.utilitiesService.byteToFile(resp, "High School Subject.xlsx", {
            type: "application/vnd.ms-excel",
          });
        },
        (err) => {
          this.loadingService.hide();
        }
      );
  }

  uploadHighSchoolSub() {
    if (!this.highSchoolSubUploadForm.get("uploadInput").value) {
      return swal.fire("Error", "Select a file", "error");
    }
    const formData = new FormData();
    formData.append(
      "uploadInput",
      this.highSchoolSubUploadForm.get("uploadInput").value
    );
    this.spinner = true;
    return this.setupService.uploadHighSchoolSub(formData).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          this.initializeForm();
          this.fileInput.nativeElement.value = "";
          $("#upload_high_school_subject").modal("hide");
        } else {
          swal.fire("GOSHRM", message, "error");
        }
        this.getHighSchoolSub();
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  openUploadModal() {
    $("#upload_high_school_subject").modal("show");
  }

  initializeForm() {
    this.formTitle = "Add High School Subject";
    this.highSchoolForm = this.formBuilder.group({
      id: [0],
      subject: ["", Validators.required],
      description: [""],
    });
    this.highSchoolSubUploadForm = this.formBuilder.group({
      uploadInput: [""],
    });
  }

  getHighSchoolSub() {
    this.loadingService.show();
    return this.setupService.getHighSchoolSub().subscribe(
      (data) => {
        this.loadingService.hide();
        this.subjects = data.setuplist;
        this.dtTrigger.next();
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  // Add employee  Modal Api Call
  addHighSchoolSub(form: FormGroup) {
    if (!form.valid) {
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    const payload = form.value;
    this.spinner = true;
    return this.setupService.addHighSchoolSub(payload).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          this.initializeForm();
          this.fileInput.nativeElement.value = "";
          $("#add_high_school_subject").modal("hide");
        } else {
          swal.fire("GOSHRM", message, "error");
        }
        this.getHighSchoolSub();
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  // To Get The employee Edit Id And Set Values To Edit Modal Form
  edit(row) {
    this.formTitle = "Edit High School Subject";
    this.highSchoolForm.patchValue({
      id: row.id,
      subject: row.subject,
      description: row.description,
    });
    $("#add_high_school_subject").modal("show");
  }

  openModal() {
    this.initializeForm();
    this.fileInput.nativeElement.value = "";
    this.formTitle = "Add High School Subject";
    $("#add_high_school_subject").modal("show");
  }

  closeModal() {
    $("#add_high_school_subject").modal("hide");
  }

  delete() {
    let payload: object;
    if (this.selectedSubjects.length === 0) {
      return swal.fire("Error", "Select items to delete", "error");
    }
    this.selectedSubjects.map((item) => {
      this.selectedId.push(item.id);
    });
    payload = {
      itemIds: this.selectedId,
    };
    // console.log(payload);
    // return;
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
          return this.setupService.deleteHighSchoolSub(payload).subscribe(
            (res) => {
              this.loadingService.hide();
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOSHRM", message, "success").then(() => {
                  this.getHighSchoolSub();
                });
              } else {
                swal.fire("GOSHRM", message, "error");
              }
            },
            (err) => {
              this.loadingService.hide();
              const message = err.status.message.friendlyMessage;
              swal.fire("GOSHRM", message, "error");
            }
          );
        }
      });
    this.selectedId = [];
  }

  addItemId(event: Event, id: number) {
    this.utilitiesService.deleteArray(event, id, this.selectedSubjects);
  }

  checkAll(event: Event) {
    this.selectedId = this.utilitiesService.checkAllBoxes(event, this.subjects);
  }
  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
  }

  onSelectedFile(event: Event, form: FormGroup) {
    this.utilitiesService.uploadFileValidator(event, form, "hr");
  }
}
