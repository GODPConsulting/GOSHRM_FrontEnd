import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  AfterViewInit,
} from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { SetupService } from "src/app/services/setup.service";
import swal from "sweetalert2";

declare const $: any;
@Component({
  selector: "app-job-skill",
  templateUrl: "./job-skill.component.html",
  styleUrls: ["./job-skill.component.css", "../setup.component.css"],
})
export class JobSkillComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  @ViewChild("fileInput") fileInput: ElementRef;
  public jobSkill: any[] = [];
  public pageLoading: boolean;
  public spinner: boolean = false;
  public formTitle = "Add Job Sub Skill";
  public jobSkillForm: FormGroup;
  public selectedId: number[] = [];
  public jobSkillUploadForm: FormGroup;
  public jobTitles;
  public jobTitleForm;
  public jobTitleId;
  public jobSkills: any[] = [];
  public jobTitle;
  public jobFormTitle = "Add Job Title";

  constructor(
    private formBuilder: FormBuilder,
    private setupService: SetupService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      console.log(+params.get("id"));
      this.jobTitleId = +params.get("id");
      this.getSingleJobTitle(+params.get("id"));
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
    });

    //this.getSubSkill();
    this.initializeForm();
    this.initializeJobTitleForm();
    //this.getJobTitle();
  }

  getSingleJobTitle(id: number) {
    this.pageLoading = true;
    return this.setupService
      .getData(`/hrmsetup/get/single/jobtitle?SetupId=${id}`)
      .subscribe(
        (data) => {
          this.pageLoading = false;
          //console.log("id", id);

          //console.log("data", data);
          this.jobTitle = data.setuplist[0];
          //this.rows = this.jobTitle.sub_Skills;
          if (id !== 0) {
            this.jobFormTitle = "Edit Job Title";
            this.jobSkills = this.jobTitle.sub_Skills;

            //this.rerender();
            //console.log(this.jobTitle.job_title);
            this.jobSkillForm.patchValue({
              job_title: this.jobTitle.job_title,
            });
            //this.srch = [...this.rows];
            this.jobTitleForm.patchValue({
              id: this.jobTitle.id,
              job_title: this.jobTitle.job_title,
              job_description: this.jobTitle.job_description,
            });
          }
        },
        (err) => {
          this.pageLoading = false;
          console.log(err);
        }
      );
  }

  // Add Job Title  Modal Api Call
  addJobTitle(form: FormGroup) {
    if (!form.valid) {
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    const payload = form.value;
    this.jobTitle = payload.job_title;
    console.log(this.jobTitle);

    console.log(payload);
    this.spinner = true;
    return this.setupService
      .updateData("/hrmsetup/add/update/jobtitle", payload)
      .subscribe(
        (res) => {
          this.spinner = false;
          console.log(res);
          this.jobTitleId = res.setup_id;
          const message = res.status.message.friendlyMessage;
          //console.log(message);

          if (res.status.isSuccessful) {
            swal.fire("Success", message, "success");
            // Populate job title form field
            this.jobTitleForm.patchValue({
              id: payload.id,
              job_title: payload.job_title,
              job_description: payload.job_description,
            });
            //$("#add_job_title").modal("hide");
          } else {
            swal.fire("Error", message, "error");
          }
          this.router.navigate(["/setup/job-title", this.jobTitleId]);
          // this.getJobDetail();
          /* this.getSingleJobTitle(this.jobTitleId);
          this.jobDetailForm.patchValue({
            id: res.setup_id,
            job_title: payload.job_title,
            job_description: payload.job_description,
          }); */
        },
        (err) => {
          this.spinner = false;
          const message = err.status.message.friendlyMessage;
          swal.fire("Error", message, "error");
        }
      );
  }

  // Appends a selected file to "uploadInput"
  onSelectedFile(event: Event) {
    const file = (<HTMLInputElement>event.target).files[0];
    this.jobSkillUploadForm.patchValue({
      uploadInput: file,
    });
  }

  // Prevents the edit modal from popping up when checkbox is clicked
  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
  }

  downloadFile() {
    this.setupService.exportExcelFile("/hrmsetup/download/sub_skill").subscribe(
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
            const file = new File([bb], "Job skills.xlsx", {
              type: "application/vnd.ms-excel",
            });
            console.log(file, bb);
            saveAs(file);
          } catch (err) {
            const textFileAsBlob = new Blob([bb], {
              type: "application/vnd.ms-excel",
            });
            window.navigator.msSaveBlob(textFileAsBlob, "Job skills.xlsx");
          }
        } else {
          return swal.fire(`GOS HRM`, "Unable to download data", "error");
        }
      },
      (err) => {}
    );
  }

  uploadJobSkill() {
    if (!this.jobSkillUploadForm.get("uploadInput").value) {
      return swal.fire("Error", "Select a file", "error");
    }
    const formData = new FormData();
    formData.append(
      "uploadInput",
      this.jobSkillUploadForm.get("uploadInput").value
    );
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
            $("#upload_sub_skill").modal("hide");
          } else {
            swal.fire("Error", message, "error");
          }
          //this.getSubSkill();
        },
        (err) => {
          this.spinner = false;
          const message = err.status.message.friendlyMessage;
          swal.fire("Error", message, "error");
        }
      );
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
    this.jobSkillForm = this.formBuilder.group({
      job_details_Id: [this.jobTitleId],
      id: [0],
      skill: ["", Validators.required],
      description: ["", Validators.required],
      weight: ["", Validators.required],
      job_title: ["", Validators.required],
    });
    this.jobSkillUploadForm = this.formBuilder.group({
      uploadInput: [""],
    });
  }

  initializeJobTitleForm() {
    this.jobTitleForm = this.formBuilder.group({
      id: [0],
      job_title: ["", Validators.required],
      job_description: ["", Validators.required],
    });
  }
  /* 
  getSubSkill() {
    this.pageLoading = true;
    return this.setupService.getData("/hrmsetup/get/all/sub_skill").subscribe(
      (data) => {
        this.pageLoading = false;
        console.log(data);
        this.subSkill = data.setuplist;
        this.rows = this.subSkill;
      },
      (err) => {
        this.pageLoading = false;
        console.log(err);
      }
    );
  }
 */

  openUploadModal() {
    // Resets the upload form
    this.fileInput.nativeElement.value = "";
    $("#upload_sub_skill").modal("show");
  }

  openModal() {
    this.initializeForm();
    this.formTitle = "Add Job SKill";
    $("#add_sub_skill").modal("show");
    //this.subSkillForm.get("job_title").enable();
    this.jobSkillForm = this.formBuilder.group({
      job_details_Id: [this.jobTitleId],
      id: [0],
      skill: ["", Validators.required],
      description: ["", Validators.required],
      weight: ["", Validators.required],
      job_title: [this.jobTitle.job_title, Validators.required],
    });
    console.log(this.jobSkillForm.value);
  }

  closeUploadModal() {
    $("#add_sub_skill").modal("hide");
  }

  closeModal() {
    $("#add_sub_skill").modal("hide");
  }

  // Add Job Skill  Modal Api Call
  addJobSkill(form: FormGroup) {
    const payload = form.value;
    console.log(payload);
    //this.subSkillForm.get("job_title").enable();
    /* this.jobSkillForm.patchValue({
      job_details_Id: this.jobTitleId,
      job_title: payload.job_title,
    }); */
    console.log(payload);
    if (!form.valid) {
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    this.spinner = true;
    return this.setupService
      .updateData("/hrmsetup/add/update/sub_skill", payload)
      .subscribe(
        (res) => {
          const message = res.status.message.friendlyMessage;
          //console.log(message);
          this.spinner = false;
          if (res.status.isSuccessful) {
            swal.fire("Success", message, "success");
            this.initializeForm();
            $("#add_sub_skill").modal("hide");
          } else {
            swal.fire("Error", message, "error");
          }
          //this.getSubSkill();
          this.getSingleJobTitle(this.jobTitleId);
        },
        (err) => {
          this.spinner = false;
          const message = err.status.message.friendlyMessage;
          swal.fire("Error", message, "error");
        }
      );
  }

  // Set Values To Edit Modal Form
  editJobSkill(row) {
    this.formTitle = "Edit Job Skill";
    this.jobSkillForm.patchValue({
      job_details_Id: row.job_details_Id,
      id: row.id,
      skill: row.skill,
      description: row.description,
      weight: row.weight,
      job_title: this.jobTitle.job_title,
    });
    //console.log(this.jobSkillForm.value);

    //this.subSkillForm.get("job_title").disable();
    $("#add_sub_skill").modal("show");
  }

  delete() {
    let payload: object;
    if (this.selectedId.length === 0) {
      return swal.fire("Error", "Select items to delete", "error");
    } else {
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
                    //this.getSubSkill();
                    this.getSingleJobTitle(this.jobTitleId);
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

  checkAll(event: Event) {
    if ((<HTMLInputElement>event.target).checked) {
      this.selectedId = this.jobSkills.map((item) => {
        return item.id;
      });
    } else {
      this.selectedId = [];
    }
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
}