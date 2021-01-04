import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SetupService } from "src/app/services/setup.service";
import swal from "sweetalert2";

declare const $: any;
@Component({
  selector: 'app-job-sub-skill',
  templateUrl: './job-sub-skill.component.html',
  styleUrls: ['./job-sub-skill.component.css']
})
export class JobSubSkillComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  public subSkill: any[] = [];
  public rows = [];
  public srch = [];
  pageLoading: boolean;
  public formTitle = "Add Job Sub Skill";
  public subSkillForm: FormGroup;
  selectedId: any[] = [];
  public subSkillUploadForm: FormGroup;
  file: File;

  constructor(
    private formBuilder: FormBuilder,
    private setupService: SetupService
  ) { }

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
    columns: [{ orderable: false }, null, null, null],
    order: [[1, "asc"]],
  };
  this.getSubSkill();
  this.initializeForm();
  }

  onSelectedFile(event) {
    this.file = event.target.files[0];
    this.subSkillUploadForm.patchValue({
      uploadInput: this.file,
    });
  }

  stopParentEvent(event) {
    event.stopPropagation();
  }

  uploadSubSkill() {
    const formData = new FormData();
    formData.append(
      "uploadInput",
      this.subSkillUploadForm.get("uploadInput").value
    );

    //console.log(formData, this.jobGradeUploadForm.get("uploadInput").value);
    return this.setupService
      .updateData("/hrmsetup/upload/sub_skill", formData)
      .subscribe(
        (res) => {
          const message = res.status.message.friendlyMessage;
          if (res.status.isSuccessful) {
            swal.fire("Success", message, "success");
            this.initializeForm();
            $("#upload_sub_skill").modal("hide");
          } else {
            swal.fire("Error", message, "error");
          }
          this.getSubSkill();
        },
        (err) => {
          const message = err.status.message.friendlyMessage;
          swal.fire("Error", message, "error");
        }
      );
  }

  openUploadModal() {
    $("#upload_sub_skill").modal("show");
  }

  /*  initializeForm() {
    this.jobDetailForm = this.formBuilder.group({
      id: [0],
      job_title: ["", Validators.required],
      job_description: ["", Validators.required],
      sub_Skills: this.formBuilder.group([
        {
          job_details_Id: 0,
          skill: "",
          description: "",
          weight: "",
        },
        Validators.required,
      ]),
    });
  }
 */

  initializeForm() {
    this.subSkillForm = this.formBuilder.group({
      id: [0],
      Skill: ["", Validators.required],
      Description: ["", Validators.required],
      Weight: ["", Validators.required],
      job_title: ["", Validators.required],

    });
    this.subSkillUploadForm = this.formBuilder.group({
      uploadInput: [""],
    });
  }

  getSubSkill() {
    this.pageLoading = true;
    return this.setupService.getData("/hrmsetup/get/all/sub-skill").subscribe(
      (data) => {
        this.pageLoading = false;
        console.log(data);
        this.subSkill = data.setuplist;
        this.rows = this.subSkill;
        this.srch = [...this.rows];
      },
      (err) => {
        this.pageLoading = false;
        console.log(err);
      }
    );
  }

  openModal() {
    $("#add_sub_skill").modal("show");
  }

  closeModal() {
    $("#add_sub_skill").modal("hide");
    this.initializeForm();
  }

  // Add employee  Modal Api Call
  addSubSkill(Form: FormGroup) {
    const payload = Form.value;
    console.log(payload);
    return this.setupService
      .updateData("/hrmsetup/add/update/sub-skill", payload)
      .subscribe(
        (res) => {
          const message = res.status.message.friendlyMessage;
          //console.log(message);

          if (res.status.isSuccessful) {
            swal.fire("Success", message, "success");
            this.initializeForm();
            $("#add_sub_skill").modal("hide");
          } else {
            swal.fire("Error", message, "error");
          }
          this.getSubSkill();
        },
        (err) => {
          const message = err.status.message.friendlyMessage;
          swal.fire("Error", message, "error");
        }
      );
  }

  // To Get The employee Edit Id And Set Values To Edit Modal Form
  editSubSkill(row) {
    this.formTitle = "Edit Job Sub Skill";
    this.subSkillForm.patchValue({
      id: row.id,
      skill: row.skill,
      description: row.description,
      weight: row.weight,
      job_title: row.job_title,
    });
    $("#add_sub_skill").modal("show");
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
            .deleteData("/hrmsetup/delete/sub-skill", payload)
            .subscribe(
              (res) => {
                const message = res.status.message.friendlyMessage;
                if (res.status.isSuccessful) {
                  swal.fire("Success", message, "success").then(() => {
                    this.getSubSkill();
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

  checkAll(event) {
    if (event.target.checked) {
      this.selectedId = this.subSkill.map((item) => {
        return item.id;
      });
    } else {
      this.selectedId = [];
    }
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

}
