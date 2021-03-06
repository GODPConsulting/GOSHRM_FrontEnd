import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { SetupService } from "../../../services/setup.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import swal from "sweetalert2";
import { UtilitiesService } from "src/app/services/utilities.service";
import { LoadingService } from "../../../services/loading.service";
import { Subject } from "rxjs";
import { ISearchColumn } from "../../../interface/interfaces";

declare const $: any;
@Component({
  selector: "app-language",
  templateUrl: "./language.component.html",
  styleUrls: ["./language.component.css", "../setup.component.css"],
})
export class LanguageComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  @ViewChild("fileInput")
  fileInput: ElementRef;
  public languages: any[] = [];
  public languageUploadForm: FormGroup;
  public formTitle: string = "Add Language";
  public spinner: boolean = false;
  public selectedId: number[] = [];
  public languageForm: FormGroup;
  dtTrigger: Subject<any> = new Subject();
  selectLanguage: any[];
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
        header: "language",
        field: "language",
      },
    ];
    this.initializeForm();
    this.getLanguages();
  }

  downloadFile() {
    // this.loadingService.show();
    this.setupService.downloadLanguage().subscribe(
      (resp) => {
        // this.loadingService.hide();
        this.utilitiesService.byteToFile(resp, "Language.xlsx", {
          type: "application/vnd.ms-excel",
        });
      },
      (err) => {
        // this.loadingService.hide();
      }
    );
  }

  uploadLanguage() {
    if (!this.languageUploadForm.get("uploadInput").value) {
      return swal.fire("Error", "Select a file", "error");
    }
    const formData = new FormData();
    formData.append(
      "uploadInput",
      this.languageUploadForm.get("uploadInput").value
    );
    this.spinner = true;
    return this.setupService.uploadLanguage(formData).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;

        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          this.initializeForm();
          $("#upload_language").modal("hide");
        } else {
          swal.fire("GOSHRM", message, "error");
        }
        this.getLanguages();
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
    $("#upload_language").modal("show");
  }

  initializeForm() {
    this.formTitle = "Add Language";
    this.languageForm = this.formBuilder.group({
      id: [0],
      language: ["", Validators.required],
      description: [""],
    });
    this.languageUploadForm = this.formBuilder.group({
      uploadInput: [""],
    });
  }

  getLanguages() {
    // this.loadingService.show();
    return this.setupService.getLanguage().subscribe(
      (data) => {
        // this.loadingService.hide();
        this.languages = data.setuplist;
        this.dtTrigger.next();
      },
      (err) => {
        // this.loadingService.hide();
      }
    );
  }

  openModal() {
    this.initializeForm();
    $("#add_language").modal("show");
  }

  closeModal() {
    $("#add_language").modal("hide");
  }

  addLanguage(form: FormGroup) {
    if (!form.valid) {
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    const payload = form.value;
    this.spinner = true;
    return this.setupService.addLanguage(payload).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;

        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          //this.initializeForm();
          $("#add_language").modal("hide");
        } else {
          swal.fire("GOSHRM", message, "error");
        }
        this.getLanguages();
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  delete() {
    let payload: object;
    if (this.selectLanguage.length === 0) {
      return swal.fire("Error", "Select items to delete", "error");
    }
    this.selectLanguage.map((item) => {
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
          // this.loadingService.show();
          return this.setupService.deleteLanguage(payload).subscribe(
            (res) => {
              // this.loadingService.hide();
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOSHRM", message, "success").then(() => {
                  this.getLanguages();
                });
              } else {
                swal.fire("GOSHRM", message, "error");
              }
            },
            (err) => {
              // this.loadingService.hide();
              const message = err.status.message.friendlyMessage;
              swal.fire("GOSHRM", message, "error");
            }
          );
        }
      });
    this.selectedId = [];
  }

  edit(row) {
    this.formTitle = "Edit Language";
    this.languageForm.patchValue({
      id: row.id,
      language: row.language,
      description: row.description,
    });
    $("#add_language").modal("show");
  }

  addItemId(event: Event, id: number) {
    this.utilitiesService.deleteArray(event, id, this.selectedId);
  }

  checkAll(event: Event) {
    this.selectedId = this.utilitiesService.checkAllBoxes(
      event,
      this.languages
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
