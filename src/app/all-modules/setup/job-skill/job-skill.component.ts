import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { SetupService } from "src/app/services/setup.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";
import { LoadingService } from "../../../services/loading.service";
import { Subject } from "rxjs";

declare const $: any;
@Component({
  selector: "app-job-skill",
  templateUrl: "./job-skill.component.html",
  styleUrls: ["./job-skill.component.css", "../setup.component.css"],
})
export class JobSkillComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  @ViewChild("fileInput") fileInput: ElementRef;
  public spinner: boolean = false;
  public formTitle: string = "Add Job Sub Skill";
  public jobSkillForm: FormGroup;
  public selectedId: number[] = [];
  public jobSkillUploadForm: FormGroup;
  public jobTitleForm;
  public jobTitleId;
  public jobSkills: any[] = [];
  public jobTitle;
  public jobFormTitle = "Add Job Title";
  dtTrigger: Subject<any> = new Subject<any>();
  constructor(
    private formBuilder: FormBuilder,
    private setupService: SetupService,
    private route: ActivatedRoute,
    private router: Router,
    private utilitiesService: UtilitiesService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
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

    this.initializeForm();
    this.initializeJobTitleForm();
  }

  getSingleJobTitle(id: number) {
    this.loadingService.show();
    return this.setupService.getSingleJobTitleById(id).subscribe(
      (data) => {
        this.loadingService.hide();

        this.jobTitle = data.setuplist[0];
        this.dtTrigger.next();
        //this.rows = this.jobTitle.sub_Skills;
        if (id !== 0) {
          this.jobFormTitle = "Edit Job Title";
          this.jobSkills = this.jobTitle.sub_Skills;

          //this.rerender();

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
        this.loadingService.hide();
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

    this.spinner = true;
    return this.setupService.addJobTitle(payload).subscribe(
      (res) => {
        this.spinner = false;

        this.jobTitleId = res.setup_id;
        const message = res.status.message.friendlyMessage;

        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          // Populate job title form field
          this.jobTitleForm.patchValue({
            id: payload.id,
            job_title: payload.job_title,
            job_description: payload.job_description,
          });
          //$("#add_job_title").modal("hide");
        } else {
          swal.fire("GOSHRM", message, "error");
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
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  downloadFile() {
    this.setupService
      .exportExcelFile(
        `/hrmsetup/download/job_skill?JobTitleId=${this.jobTitleId}`
      )
      .subscribe(
        (resp) => {
          const data = resp;
          this.utilitiesService.byteToFile(data, "Job Skill.xlsx", {
            type: "application/vnd.ms-excel",
          });
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
    return this.setupService.uploadJobSkill(formData).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          this.getSingleJobTitle(this.jobTitleId);
          this.initializeForm();
          $("#upload_sub_skill").modal("hide");
        } else {
          swal.fire("GOSHRM", message, "error");
        }
        //this.getSubSkill();
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
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
    this.formTitle = "Add Job SKill";

    this.jobSkillForm = this.formBuilder.group({
      job_details_Id: [this.jobTitleId],
      id: [0],
      skill: ["", Validators.required],
      description: [""],
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
    this.loadingService.show
    return this.setupService.getData("/hrmsetup/get/all/sub_skill").subscribe(
      (data) => {
        this.loadingService.hide

        this.subSkill = data.setuplist;
        this.rows = this.subSkill;
      },
      (err) => {
        this.loadingService.hide

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
    //this.subSkillForm.get("job_title").enable();
    /* this.jobSkillForm.patchValue({
      job_details_Id: this.jobTitleId,
      job_title: payload.job_title,
    }); */
    if (!form.valid) {
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    this.spinner = true;
    return this.setupService.addJobSkill(payload).subscribe(
      (res) => {
        const message = res.status.message.friendlyMessage;

        this.spinner = false;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          this.initializeForm();
          $("#add_sub_skill").modal("hide");
        } else {
          swal.fire("GOSHRM", message, "error");
        }
        //this.getSubSkill();
        this.getSingleJobTitle(this.jobTitleId);
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
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
        if (result.value) {
          this.loadingService.show();
          return this.setupService.deleteJobSkill(payload).subscribe(
            (res) => {
              this.loadingService.hide();
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOSHRM", message, "success").then(() => {
                  //this.getSubSkill();
                  this.getSingleJobTitle(this.jobTitleId);
                });
              } else {
                swal.fire("GOSHRM", message, "error");
              }
            },
            (err) => {
              this.loadingService.hide();
              this.utilitiesService.showMessage(err, "error");
            }
          );
        }
      });
    this.selectedId = [];
  }

  checkAll(event: Event) {
    this.selectedId = this.utilitiesService.checkAllBoxes(
      event,
      this.jobSkills
    );
  }

  addItemId(event: Event, id: number) {
    this.utilitiesService.deleteArray(event, id, this.selectedId);
  }

  // Appends a selected file to "uploadInput"
  onSelectedFile(event: Event, form: FormGroup) {
    this.utilitiesService.uploadFileValidator(event, form, "hr");
  }
  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
  }
}
