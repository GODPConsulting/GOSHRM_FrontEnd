import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { SetupService } from "../../../services/setup.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import swal from "sweetalert2";
import { UtilitiesService } from "src/app/services/utilities.service";
import { LoadingService } from "../../../services/loading.service";
import { ISearchColumn } from "../../../interface/interfaces";

declare const $: any;
@Component({
  selector: "app-prof-certification",
  templateUrl: "./prof-certification.component.html",
  styleUrls: ["./prof-certification.component.css", "../setup.component.css"],
})
export class ProfCertificationComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  @ViewChild("fileInput") fileInput: ElementRef;
  public certifications: any[] = [];
  public profCertificationForm: FormGroup;
  public formTitle: string = "Add Professional Certification";
  public spinner: boolean = false;
  public selectedId: number[] = [];
  public profCertUploadForm: FormGroup;
  selectCertifications: any[];
  cols: ISearchColumn[];

  constructor(
    private setupService: SetupService,
    private formBuilder: FormBuilder,
    private utilitiesService: UtilitiesService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.cols = [
      {
        header: "certification",
        field: "certification",
      },
    ];
    this.initializeForm();
    this.getprofCertification();
  }

  downloadFile() {
    this.setupService.downloadProfCert().subscribe(
      (resp) => {
        if (resp) {
          return this.utilitiesService.byteToFile(
            resp,
            "Professional Certification.xlsx"
          );
        } else {
          return this.utilitiesService.showError("Unable to download file");
        }
      },
      (err) => {}
    );
  }

  uploadProfCert() {
    if (!this.profCertUploadForm.get("uploadInput").value) {
      return swal.fire("Error", "Select a file", "error");
    }
    const formData = new FormData();
    formData.append(
      "uploadInput",
      this.profCertUploadForm.get("uploadInput").value
    );
    this.spinner = true;
    return this.setupService.uploadProfCert(formData).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          this.initializeForm();
          $("#upload_prof_certification").modal("hide");
        } else {
          swal.fire("GOSHRM", message, "error");
        }
        this.getprofCertification();
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  openUploadModal() {
    this.fileInput.nativeElement.value = "";
    $("#upload_prof_certification").modal("show");
  }

  initializeForm() {
    this.formTitle = "Add Professional Certificate";
    this.profCertificationForm = this.formBuilder.group({
      id: [0],
      certification: ["", Validators.required],
      description: [""],
      rank: ["", Validators.required],
    });
    this.profCertUploadForm = this.formBuilder.group({
      uploadInput: [""],
    });
  }

  getprofCertification() {
    this.loadingService.show();
    return this.setupService.getProfCerts().subscribe(
      (data) => {
        this.loadingService.hide();
        this.certifications = data.setuplist;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  // Add Professional Certification Api Call
  addProfCertification(form: FormGroup) {
    if (!form.valid) {
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    const payload = form.value;
    payload.rank = parseInt(payload.rank); //continue from here
    this.spinner = true;
    return this.setupService.addProfCert(payload).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          this.initializeForm();
          $("#add-prof-certification").modal("hide");
        } else {
          swal.fire("GOSHRM", message, "error");
        }
        this.getprofCertification();
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
    this.formTitle = "Edit Professional Certification";
    this.profCertificationForm.patchValue({
      id: row.id,
      certification: row.certification,
      description: row.description,
      rank: row.rank,
    });
    $("#add-prof-certification").modal("show");
  }

  openModal() {
    this.initializeForm();
    $("#add-prof-certification").modal("show");
  }

  closeModal() {
    $("#add-prof-certification").modal("hide");
  }

  delete() {
    let payload: object;
    if (this.selectCertifications.length === 0) {
      return swal.fire("Error", "Select items to delete", "error");
    }
    this.selectCertifications.map((item) => {
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
          return this.setupService.deleteProfCert(payload).subscribe(
            (res) => {
              this.loadingService.hide();
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOSHRM", message, "success").then(() => {
                  this.getprofCertification();
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
    this.utilitiesService.deleteArray(event, id, this.selectedId);
  }

  checkAll(event: Event) {
    this.selectedId = this.utilitiesService.checkAllBoxes(
      event,
      this.certifications
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
