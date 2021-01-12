import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { SetupService } from "src/app/services/setup.service";
import swal from "sweetalert2";

declare const $: any;
@Component({
  selector: "app-job-sub-skill",
  templateUrl: "./job-sub-skill.component.html",
  styleUrls: ["./job-sub-skill.component.css", "../setup.component.css"],
})
export class JobSubSkillComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  @ViewChild("fileInput") fileInput: ElementRef;
  public subSkill: any[] = [];
  public rows = [];
  public srch = [];
  pageLoading: boolean;

  spinner: boolean = false;
  public formTitle = "Add Job Sub Skill";
  public subSkillForm: FormGroup;
  selectedId: any[] = [];
  public subSkillUploadForm: FormGroup;
  file: File;
  public jobTitles;
  public jobDetailForm;
  public jobTitleId;
  public jobSkills;

  constructor(
    private formBuilder: FormBuilder,
    private setupService: SetupService,
    private route: ActivatedRoute
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
      columns: [{ orderable: false }, null, null, null, null],
      order: [[1, "asc"]],
    };
    this.getSubSkill();
    this.initializeForm();
    this.getJobTitle();
    this.route.paramMap.subscribe((params) => {
      console.log(params.get("id"));
      this.getSingleJobTitle(+params.get("id"));
    });
  }

  getSingleJobTitle(id) {
    return this.setupService
      .getData(`/hrmsetup/get/single/jobtitle?id=${id}`)
      .subscribe(
        (data) => {
          //this.pageLoading = false;
          let arr = 1; //arr should be id too
          console.log(data);
          this.jobTitles = data.setuplist;
          this.rows = this.jobTitles;
          this.jobSkills = this.jobTitles.sub_Skills; // replace in line 105 in template
          //this.srch = [...this.rows];
          this.jobDetailForm.patchValue({
            id: this.rows[arr].id,
            job_title: this.rows[arr].job_title,
            job_description: this.rows[arr].job_description,
          });
        },
        (err) => {
          //this.pageLoading = false;
          console.log(err);
        }
      );
  }

  getJobTitle() {
    // this.pageLoading = true;
    return this.setupService.getData("/hrmsetup/get/all/jobtitle").subscribe(
      (data) => {
        //this.pageLoading = false;
        let arr = 1;
        console.log(data);
        this.jobTitles = data.setuplist;
        this.rows = this.jobTitles;
        this.srch = [...this.rows];
        this.jobDetailForm.patchValue({
          id: this.rows[arr].id,
          job_title: this.rows[arr].job_title,
          job_description: this.rows[arr].job_description,
        });
      },
      (err) => {
        //this.pageLoading = false;
        console.log(err);
      }
    );
  }

  getJobId(event) {
    console.log(event.target.value);
    //console.log(this.jobTitles);
    /* for (const obj of this.jobTitles) {
      if (obj.job_title === event.target.value) {
        this.jobTitleId = obj.id;
        console.log(this.jobTitleId);
      }
    }*/
    this.subSkillForm.patchValue({
      job_details_Id: this.jobTitleId,
    });
  }

  // Add Job Title  Modal Api Call
  addJobDetail(Form: FormGroup) {
    if (!Form.valid) {
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    const payload = Form.value;
    console.log(payload);
    return this.setupService
      .updateData("/hrmsetup/add/update/jobdetail", payload)
      .subscribe(
        (res) => {
          console.log(res.setup_id);
          const message = res.status.message.friendlyMessage;
          //console.log(message);

          if (res.status.isSuccessful) {
            swal.fire("Success", message, "success");
            this.initializeForm();
            $("#add_job_detail").modal("hide");
          } else {
            swal.fire("Error", message, "error");
          }
          // this.getJobDetail();
        },
        (err) => {
          const message = err.status.message.friendlyMessage;
          swal.fire("Error", message, "error");
        }
      );
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

  downloadFile() {
    this.setupService.exportExcelFile("/hrmsetup/download/sub_skill").subscribe(
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
            const file = new File([bb], "Job skills.xlsx", {
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

  uploadSubSkill() {
    const formData = new FormData();
    formData.append(
      "uploadInput",
      this.subSkillUploadForm.get("uploadInput").value
    );
    if (!this.file) {
      return swal.fire("Error", "Select a file", "error");
    }

    //console.log(formData, this.jobGradeUploadForm.get("uploadInput").value);
    this.spinner = true;
    return this.setupService
      .updateData("/hrmsetup/upload/sub_skill", formData)
      .subscribe(
        (res) => {
          this.spinner = false;
          const message = res.status.message.friendlyMessage;
          if (res.status.isSuccessful) {
            swal.fire("Success", message, "success");
            this.initializeForm();
            this.fileInput.nativeElement.value = "";
            $("#upload_sub_skill").modal("hide");
          } else {
            swal.fire("Error", message, "error");
          }
          this.getSubSkill();
        },
        (err) => {
          this.spinner = false;
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
      job_details_Id: [this.jobTitleId],
      id: [0],
      skill: ["", Validators.required],
      description: ["", Validators.required],
      weight: ["", Validators.required],
      job_title: ["", Validators.required],
    });
    this.subSkillUploadForm = this.formBuilder.group({
      uploadInput: [""],
    });
    this.jobDetailForm = this.formBuilder.group({
      id: [0],
      job_title: ["", Validators.required],
      job_description: ["", Validators.required],
    });
  }

  getSubSkill() {
    this.pageLoading = true;
    return this.setupService.getData("/hrmsetup/get/all/sub_skill").subscribe(
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
    this.subSkillForm.get("job_title").enable();
    this.formTitle = "Add Job SKill";
  }

  closeModal() {
    $("#add_sub_skill").modal("hide");
    this.initializeForm();
  }

  // Add employee  Modal Api Call
  addSubSkill(Form: FormGroup) {
    this.subSkillForm.get("job_title").enable();
    if (!Form.valid) {
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    /* if (!Form.valid) {
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    } */
    const payload = Form.value;
    console.log(payload);
    return this.setupService
      .updateData("/hrmsetup/add/update/sub_skill", payload)
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
    this.formTitle = "Edit Job Skill";

    this.subSkillForm.patchValue({
      job_details_Id: this.jobTitleId,
      id: row.id,
      skill: row.skill,
      description: row.description,
      weight: row.weight,
      job_title: row.job_title,
    });
    this.subSkillForm.get("job_title").disable();
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
            .deleteData("/hrmsetup/delete/sub_skill", payload)
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
