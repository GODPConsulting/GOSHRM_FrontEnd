import { Component, OnInit } from "@angular/core";
import { SetupService } from "../../../services/setup.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import swal from "sweetalert2";

declare const $: any;
@Component({
  selector: "app-employment-level",
  templateUrl: "./employment-level.component.html",
  styleUrls: ["./employment-level.component.css", "../setup.component.css"],
})
export class EmploymentLevelComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  public levels: any[] = [];

  public employmentLevelForm: FormGroup;
  formTitle: string = "Add Employment Level";
  public rows = [];
  public srch = [];
  selectedId: any[] = [];
  pageLoading: boolean;
  loading: boolean = true;
  spinner: boolean = false;
  public employmentLevelUploadForm: FormGroup;
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
    this.getEmploymentLevels();
  }

  stopParentEvent(event) {
    event.stopPropagation();
  }

  onSelectedFile(event) {
    this.file = event.target.files[0];
    this.employmentLevelUploadForm.patchValue({
      uploadInput: this.file,
    });
  }

  uploadEmploymentLevel() {
    const formData = new FormData();
    formData.append(
      "uploadInput",
      this.employmentLevelUploadForm.get("uploadInput").value
    );
    if (!this.file) {
      return swal.fire('Error', 'Select a file', 'error')
    }
    //console.log(formData, this.jobGradeUploadForm.get("uploadInput").value);
    this.spinner = true;
    this.loading = false;
    return this.setupService
      .updateData("/hrmsetup/upload/employmentlevel", formData)
      .subscribe(
        (res) => {
          const message = res.status.message.friendlyMessage;
          if (res.status.isSuccessful) {
            swal.fire("Success", message, "success");
            this.initializeForm();
            $("#upload_employment_level").modal("hide");
          } else {
            swal.fire("Error", message, "error");
          }
          this.getEmploymentLevels();
        },
        (err) => {
          const message = err.status.message.friendlyMessage;
          swal.fire("Error", message, "error");
        }
      );
  }

  openUploadModal() {
    $("#upload_employment_level").modal("show");
  }

  initializeForm() {
    this.employmentLevelForm = this.formBuilder.group({
      id: [0],
      employment_level: ["", Validators.required],
      description: ["", Validators.required],
    });
    this.employmentLevelUploadForm = this.formBuilder.group({
      uploadInput: [""],
    });
  }
  getEmploymentLevels() {
    this.pageLoading = true;
    return this.setupService
      .getData("/hrmsetup/get/all/emplpymentlevels")
      .subscribe(
        (data) => {
          this.pageLoading = false;
          this.levels = data.setuplist;
          this.rows = this.levels;
          this.srch = [...this.rows];
        },
        (err) => {
          console.log(err);
        }
      );
  }
  // Add employee  Modal Api Call
  addData(employmentLevelForm: FormGroup) {
    const payload = employmentLevelForm.value;
    return this.setupService
      .updateData("/hrmsetup/add/update/employmentlevel", payload)
      .subscribe(
        (res) => {
          const message = res.status.message.friendlyMessage;
          if (res.status.isSuccessful) {
            swal.fire("Success", message, "success");
            this.initializeForm();
            $("#add_employment_level").modal("hide");
          } else {
            swal.fire("Error", message, "error");
          }
          this.getEmploymentLevels();
        },
        (err) => {
          const message = err.status.message.friendlyMessage;
          swal.fire("Error", message, "error");
        }
      );
  }

  addEmploymentLevel() {
    this.formTitle = "Add Employment Level";
    $("#add_employment_level").modal("show");
  }

  closeModal() {
    $("#add_employment_level").modal("hide");
    this.initializeForm();
  }

  //search by description
  searchByDescription(val) {
    this.rows.splice(0, this.rows.length);
    let temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.description.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
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
            .deleteData("/hrmsetup/delete/employmentlevel", payload)
            .subscribe(
              (res) => {
                const message = res.status.message.friendlyMessage;
                if (res.status.isSuccessful) {
                  swal.fire("Success", message, "success").then(() => {
                    this.getEmploymentLevels();
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
    this.formTitle = "Edit Employment Level";
    this.employmentLevelForm.patchValue({
      id: row.id,
      employment_level: row.employment_level,
      description: row.description,
    });
    $("#add_employment_level").modal("show");
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
      this.selectedId = this.levels.map((item) => {
        return item.id;
      });
    } else {
      this.selectedId = [];
    }
  }
}
