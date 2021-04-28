import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { SetupService } from "../../../services/setup.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import swal from "sweetalert2";
import { saveAs } from "file-saver";
import { UtilitiesService } from "src/app/services/utilities.service";
import { LoadingService } from "../../../services/loading.service";

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
  public spinner: boolean = false;
  public selectedId: number[] = [];
  public file: File;

  constructor(
    private setupService: SetupService,
    private formBuilder: FormBuilder,
    private utilitiesService: UtilitiesService,
    private loadingService: LoadingService
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

  uploadAcademicDiscipline() {
    if (!this.academicDisciplineUploadForm.get("uploadInput").value) {
      return swal.fire("Error", "Select a file", "error");
    }
    const formData = new FormData();
    formData.append(
      "uploadInput",
      this.academicDisciplineUploadForm.get("uploadInput").value
    );
    this.spinner = true;
    return this.setupService.uploadAcademicDiscipline(formData).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          $("#upload_academic_discipline").modal("hide");
        } else {
          swal.fire("GOSHRM", message, "error");
        }
        this.getAcademicDisplines();
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  downloadFile() {
    this.setupService
      .exportExcelFile("/hrmsetup/download/academic/disciplines")
      .subscribe(
        (resp) => {
          const data = resp;
          this.utilitiesService.byteToFile(data, "Academic Discipline.xlsx", {
            type: "application/vnd.ms-excel",
          });
        },
        () => {}
      );
  }

  openUploadModal() {
    $("#upload_academic_discipline").modal("show");
    this.fileInput.nativeElement.value = "";
  }

  initializeForm() {
    this.formTitle = "Add Academic Discipline";

    this.academicDisciplineForm = this.formBuilder.group({
      id: [0],
      discipline: ["", Validators.required],
      description: [""],
      rank: ["", Validators.required],
    });
    this.academicDisciplineUploadForm = this.formBuilder.group({
      uploadInput: [""],
    });
  }

  getAcademicDisplines() {
    this.loadingService.show();
    return this.setupService.getAcademicDisplines().subscribe(
      (data) => {
        this.loadingService.hide();
        this.disciplines = data.setuplist;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  // Add Academic Discipline  Modal
  addAcademicDiscipline(form: FormGroup) {
    if (!form.valid) {
      swal.fire("Error", "Please complete all fields", "error");
      return;
    }
    const payload: object = form.value;
    this.spinner = true;
    return this.setupService.addAcademicDiscipline(payload).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          this.initializeForm();
          $("#add_academic_discipline").modal("hide");
        } else {
          swal.fire("GOSHRM", message, "error");
        }
        this.getAcademicDisplines();
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
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
    this.initializeForm();

    this.formTitle = "Add Academic Discipline";
    $("#add_academic_discipline").modal("show");
  }

  closeModal() {
    $("#add_academic_discipline").modal("hide");
  }

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
        showLoaderOnConfirm: true,
        preConfirm: (login) => {
          this.loadingService.show();
          return this.setupService.deleteAcademicDiscipline(payload).subscribe(
            (res) => {
              this.loadingService.hide();
              if (res.status.isSuccessful) {
                this.utilitiesService.showMessage(res, "success").then(() => {
                  this.getAcademicDisplines();
                });
                // swal.fire("GOSHRM", message, "success").then(() => {
                //
                // });
              } else {
                this.utilitiesService.showMessage(res, "error");
              }
            },
            (err) => {
              this.loadingService.hide();
              this.utilitiesService.showMessage(err, "error");
            }
          );
        },
      })
      .then((result) => {
        if (result.isConfirmed) {
        }
      });
    this.selectedId = [];
  }

  addItemId(event: Event, id: number) {
    this.utilitiesService.deleteArray(event, id, this.selectedId);
  }

  checkAll(event: Event) {
    this.selectedId = this.utilitiesService.checkAllBoxes(
      event,
      this.disciplines
    );
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
