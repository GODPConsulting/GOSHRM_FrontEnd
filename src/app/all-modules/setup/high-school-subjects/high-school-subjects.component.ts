import { Component, OnInit } from "@angular/core";
import { SetupService } from "../../../services/setup.service";
import { DataTableDirective } from "angular-datatables";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";

declare const $: any;
@Component({
  selector: "app-high-school-subjects",
  templateUrl: "./high-school-subjects.component.html",
  styleUrls: ["./high-school-subjects.component.css", "../setup.component.css"],
})
export class HighSchoolSubjectsComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  public dtElement: DataTableDirective;
  public subjects: any[] = [];

  public highSchoolForm: FormGroup;
  public editEmployeeForm: FormGroup;
  formTitle: string = "Add High School Subject";
  public rows = [];
  public srch = [];
  public statusValue;
  pageLoading: boolean;
  value: any;
  selectedId: any[] = [];
  public highSchoolSubUploadForm: FormGroup;
  file: File;
  constructor(
    private setupService: SetupService,
    private formBuilder: FormBuilder
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
    this.getHighSchoolSub();
  }

  stopParentEvent(event) {
    event.stopPropagation();
  }

  onSelectedFile(event) {
    this.file = event.target.files[0];
    this.highSchoolSubUploadForm.patchValue({
      uploadInput: this.file,
    });
  }

  uploadHighSchoolSub() {
    const formData = new FormData();
    formData.append(
      "uploadInput",
      this.highSchoolSubUploadForm.get("uploadInput").value
    );

    //console.log(formData, this.highSchoolSubUploadForm.get("uploadInput").value);
    return this.setupService
      .updateData("/hrmsetup/upload/highschoolsubject", formData)
      .subscribe(
        (res) => {
          const message = res.status.message.friendlyMessage;
          if (res.status.isSuccessful) {
            swal.fire("Success", message, "success");
            this.initializeForm();
            $("#upload_high_school_subject").modal("hide");
          } else {
            swal.fire("Error", message, "error");
          }
          this.getHighSchoolSub();
        },
        (err) => {
          const message = err.status.message.friendlyMessage;
          swal.fire("Error", message, "error");
        }
      );
  }

  openUploadModal() {
    $("#upload_high_school_subject").modal("show");
  }

  initializeForm() {
    this.highSchoolForm = this.formBuilder.group({
      id: [0],
      subject: ["", Validators.required],
      description: ["", Validators.required],
    });
    this.highSchoolSubUploadForm = this.formBuilder.group({
      uploadInput: [""],
    });
  }

  getHighSchoolSub() {
    this.pageLoading = true;
    return this.setupService
      .getData("/hrmsetup/get/all/highschoolsubjects")
      .subscribe(
        (data) => {
          this.pageLoading = false;
          this.subjects = data.setuplist;
          this.rows = this.subjects;
          this.srch = [...this.rows];
        },
        (err) => {
          this.pageLoading = false;
          console.log(err);
        }
      );
  }

  // Add employee  Modal Api Call
  addHighSchoolSub(Form: FormGroup) {
    if (!Form.valid) {
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }

    const payload = Form.value;
    return this.setupService
      .updateData("/hrmsetup/add/update/highschoolsubject", payload)
      .subscribe(
        (res) => {
          const message = res.status.message.friendlyMessage;
          if (res.status.isSuccessful) {
            swal.fire("Success", message, "success");
            this.initializeForm();
            $("#add_high_school_subject").modal("hide");
          } else {
            swal.fire("Error", message, "error");
          }
          this.getHighSchoolSub();
        },
        (err) => {
          const message = err.status.message.friendlyMessage;
          swal.fire("Error", message, "error");
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

  //search by Id
  searchId(val) {
    this.rows.splice(0, this.rows.length);
    let temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.subject.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }

  //search by name
  searchName(val) {
    this.rows.splice(0, this.rows.length);
    let temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.description.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }

  //search by purchase
  searchByDesignation(val) {
    this.rows.splice(0, this.rows.length);
    let temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.designation.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }

  openModal() {
    this.formTitle = "Add High School Subject";
    $("#add_high_school_subject").modal("show");
  }

  closeModal() {
    $("#add_high_school_subject").modal("hide");
    this.initializeForm();
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
      this.selectedId = this.subjects.map((item) => {
        return item.id;
      });
    } else {
      this.selectedId = [];
    }
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
            .deleteData("/hrmsetup/delete/highschoolsubject", payload)
            .subscribe(
              (res) => {
                const message = res.status.message.friendlyMessage;
                if (res.status.isSuccessful) {
                  swal.fire("Success", message, "success").then(() => {
                    this.getHighSchoolSub();
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
}
