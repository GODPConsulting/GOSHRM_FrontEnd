import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DataTableDirective } from "angular-datatables";
import { SetupService } from "src/app/services/setup.service";
import swal from "sweetalert2";

declare const $: any;
@Component({
  selector: "app-employment-type",
  templateUrl: "./employment-type.component.html",
  styleUrls: ["./employment-type.component.css", "../setup.component.css"],
})
export class EmploymentTypeComponent implements OnInit {
  formTitle;
  public dtOptions: DataTables.Settings = {};
  @ViewChild('fileInput') fileInput: ElementRef
  public employmentTypeForm: FormGroup;
  public employmentTypes: any[] = [];
  public rows = [];
  public dtElement: DataTableDirective;
  public lstEmployee: any;
  public srch = [];
  pageLoading: boolean;
  
  spinner: boolean = false;
  selectedId: any[] = [];
  public employmentTypeUploadForm: FormGroup;
  file: File;

  constructor(
    private formBuilder: FormBuilder,
    private setupService: SetupService
  ) {}

  ngOnInit(): void {
    $(".floating")
      .on("focus blur", function (e) {
        $(this)
          .parents(".form-focus")
          .toggleClass("focused", e.type === "focus" || this.value.length > 0);
      })
      .trigger("blur");
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
    this.getEmploymentType();
  }

  stopParentEvent(event) {
    event.stopPropagation();
  }

  onSelectedFile(event) {
    this.file = event.target.files[0];
    this.employmentTypeUploadForm.patchValue({
      uploadInput: this.file,
    });
  }

  downloadFile() {
    this.setupService.exportExcelFile("/hrmsetup/download/employmenttypes").subscribe(
      (resp) => {
        //this.blob = resp;
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
            const file = new File([bb], "employmenttype.xlsx", {
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
      (err) => {}
    );
  }

  uploadEmploymentType() {
    const formData = new FormData();
    formData.append(
      "uploadInput",
      this.employmentTypeUploadForm.get("uploadInput").value
    );
    if (!this.file) {
      return swal.fire('Error', 'Select a file', 'error')
    }
    //console.log(formData, this.languageForm.get("uploadInput").value);
   this.spinner = true;
   
    return this.setupService
      .updateData("/hrmsetup/upload/employmenttype", formData)
      .subscribe(
        (res) => {
          this.spinner = false;
          const message = res.status.message.friendlyMessage;
          if (res.status.isSuccessful) {
            swal.fire("Success", message, "success");
            this.initializeForm();
            this.fileInput.nativeElement.value = ''
            $("#upload_employment_type").modal("hide");
          } else {
            swal.fire("Error", message, "error");
          }
          this.getEmploymentType();
        },
        (err) => {
          this.spinner = false;
          const message = err.status.message.friendlyMessage;
          swal.fire("Error", message, "error");
        }
      );
  }

  openUploadModal() {
    $("#upload_employment_type").modal("show");
  }

  initializeForm() {
    this.employmentTypeForm = this.formBuilder.group({
      id: [0],
      employment_type: ["", Validators.required],
      description: ["", Validators.required],
    });
    this.employmentTypeUploadForm = this.formBuilder.group({
      uploadInput: [""],
    });
  }

  openModal() {
    this.formTitle = "Add Employment Type";
    $("#add_employment_type").modal("show");
  }

  closeModal() {
    $("#add_employment_type").modal("hide");
    this.initializeForm();
  }

  getEmploymentType() {
    this.pageLoading = true;
    return this.setupService
      .getData("/hrmsetup/get/all/employmenttypes")
      .subscribe(
        (data) => {
          this.pageLoading = false;
          //console.log(data);
          this.employmentTypes = data.setuplist;
          this.rows = this.employmentTypes;
          this.srch = [...this.rows];
        },
        (err) => {
          this.pageLoading = false;
          console.log(err);
        }
      );
  }

  // Add employment via reactive form Modal Api Call
  addEmploymentType(Form: FormGroup) {
    if (!Form.valid) {
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    const payload = Form.value;
    console.log(payload);
    return this.setupService
      .updateData("/hrmsetup/add/update/employmenttype", payload)
      .subscribe(
        (res) => {
          const message = res.status.message.friendlyMessage;
          //console.log(message);

          if (res.status.isSuccessful) {
            swal.fire("Success", message, "success");
            this.initializeForm();
            $("#add_employment_type").modal("hide");
          } else {
            swal.fire("Error", message, "error");
          }
          this.getEmploymentType();
        },
        (err) => {
          const message = err.status.message.friendlyMessage;
          swal.fire("Error", message, "error");
        }
      );
  }

  delete(id: any) {
    let payload;
    if (id) {
      const body = [id];
      //body.push(id);
      //console.log(body);
      payload = {
        itemIds: body,
      };
    } else if (this.selectedId) {
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
            .deleteData("/hrmsetup/delete/employmenttype", payload)
            .subscribe(
              (res) => {
                const message = res.status.message.friendlyMessage;
                if (res.status.isSuccessful) {
                  swal.fire("Success", message, "success").then(() => {
                    this.getEmploymentType();
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
  }

  // To Get The employee Edit Id And Set Values To Edit Modal Form
  edit(row) {
    this.formTitle = "Edit Employment Type";
    this.employmentTypeForm.patchValue({
      id: row.id,
      employment_type: row.employment_type,
      description: row.description,
    });
    $("#add_employment_type").modal("show");
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
      this.selectedId = this.employmentTypes.map((item) => {
        return item.id;
      });
    } else {
      this.selectedId = [];
    }
  }
}
