import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { SetupService } from "../../../services/setup.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import swal from "sweetalert2";

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
  public pageLoading: boolean;
  public spinner: boolean = false;
  public selectedId: number[] = [];
  public languageForm: FormGroup;

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
      columns: [{ orderable: false }, null, null],
      order: [[1, "asc"]],
    };
    this.initializeForm();
    this.getLanguages();
  }

  // Prevents the edit modal from popping up when checkbox is clicked
  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
  }

  // Appends a selected file to "uploadInput"
  onSelectedFile(event: Event) {
    const file = (<HTMLInputElement>event.target).files[0];
    this.languageUploadForm.patchValue({
      uploadInput: file,
    });
  }

  downloadFile() {
    this.setupService.exportExcelFile("/hrmsetup/download/languages").subscribe(
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
            const file = new File([bb], "Language.xlsx", {
              type: "application/vnd.ms-excel",
            });
            console.log(file, bb);
            saveAs(file);
          } catch (err) {
            const textFileAsBlob = new Blob([bb], {
              type: "application/vnd.ms-excel",
            });
            window.navigator.msSaveBlob(textFileAsBlob, "Language.xlsx");
          }
        } else {
          return swal.fire(`GOS HRM`, "Unable to download data", "error");
        }
      },
      (err) => {}
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
    return this.setupService
      .updateData("/hrmsetup/upload/language", formData)
      .subscribe(
        (res) => {
          this.spinner = false;
          const message = res.status.message.friendlyMessage;

          if (res.status.isSuccessful) {
            swal.fire("Success", message, "success");
            this.initializeForm();
            $("#upload_language").modal("hide");
          } else {
            swal.fire("Error", message, "error");
          }
          this.getLanguages();
        },
        (err) => {
          this.spinner = false;
          const message = err.status.message.friendlyMessage;
          swal.fire("Error", message, "error");
        }
      );
  }

  openUploadModal() {
    this.fileInput.nativeElement.value = "";
    $("#upload_language").modal("show");
  }

  initializeForm() {
    this.languageForm = this.formBuilder.group({
      id: [0],
      language: ["", Validators.required],
      description: ["", Validators.required],
    });
    this.languageUploadForm = this.formBuilder.group({
      uploadInput: [""],
    });
  }

  getLanguages() {
    this.pageLoading = true;
    return this.setupService.getData("/hrmsetup/get/all/languages").subscribe(
      (data) => {
        this.pageLoading = false;
        //console.log(data);
        this.languages = data.setuplist;
      },
      (err) => {
        this.pageLoading = false;
        console.log(err);
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
    return this.setupService
      .updateData("/hrmsetup/add/update/language", payload)
      .subscribe(
        (res) => {
          this.spinner = false;
          const message = res.status.message.friendlyMessage;
          //console.log(message);

          if (res.status.isSuccessful) {
            swal.fire("Success", message, "success");
            //this.initializeForm();
            $("#add_language").modal("hide");
          } else {
            swal.fire("Error", message, "error");
          }
          this.getLanguages();
        },
        (err) => {
          this.spinner = false;
          const message = err.status.message.friendlyMessage;
          swal.fire("Error", message, "error");
        }
      );
  }

  delete() {
    let payload: object;
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
        //console.log(result);

        if (result.value) {
          return this.setupService
            .deleteData("/hrmsetup/delete/language", payload)
            .subscribe(
              (res) => {
                const message = res.status.message.friendlyMessage;
                if (res.status.isSuccessful) {
                  swal.fire("Success", message, "success").then(() => {
                    this.getLanguages();
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

  addItemId(event: Event, id: number) {
    if ((<HTMLInputElement>event.target).checked) {
      if (!this.selectedId.includes(id)) {
        this.selectedId.push(id);
      }
    } else {
      this.selectedId = this.selectedId.filter((_id) => {
        return _id !== id;
      });
    }
  }

  checkAll(event: Event) {
    if ((<HTMLInputElement>event.target).checked) {
      this.selectedId = this.languages.map((item) => {
        return item.id;
      });
    } else {
      this.selectedId = [];
    }
  }
}
