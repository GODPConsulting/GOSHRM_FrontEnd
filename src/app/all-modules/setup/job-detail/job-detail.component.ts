import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SetupService } from "src/app/services/setup.service";
import swal from "sweetalert2";

declare const $: any;
@Component({
  selector: "app-job-detail",
  templateUrl: "./job-detail.component.html",
  styleUrls: ["./job-detail.component.css"],
})
export class JobDetailComponent implements OnInit {
  public jobDetails: any[] = [];
  public rows = [];
  public srch = [];
  pageLoading: boolean;
  public formTitle = "Add Job Details";
  public jobDetailForm: FormGroup;
  selectedId: any[] = [];

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
    this.getJobDetail();
    this.initializeForm();
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
    this.jobDetailForm = this.formBuilder.group({
      id: [0],
      job_title: ["", Validators.required],
      job_description: ["", Validators.required],
      sub_Skills: this.formBuilder.array([
        this.formBuilder.group({
          job_details_Id: [0],
          skill: ["", Validators.required],
          description: ["", Validators.required],
          weight: ["", Validators.required],
        }),
      ]),
    });
  }

  getJobDetail() {
    this.pageLoading = true;
    return this.setupService.getData("/hrmsetup/get/all/jobdetails").subscribe(
      (data) => {
        this.pageLoading = false;
        console.log(data);
        this.jobDetails = data.setuplist;
        this.rows = this.jobDetails;
        this.srch = [...this.rows];
      },
      (err) => {
        this.pageLoading = false;
        console.log(err);
      }
    );
  }

  openModal() {
    $("#add_job_detail").modal("show");
  }

  closeModal() {
    $("#add_job_detail").modal("hide");
    this.initializeForm();
  }

  // Add employee  Modal Api Call
  addJobDetail(Form: FormGroup) {
    const payload = Form.value;
    console.log(payload);
    return this.setupService
      .updateData("/hrmsetup/add/update/jobdetail", payload)
      .subscribe(
        (res) => {
          const message = res.status.message.friendlyMessage;
          //console.log(message);

          if (res.status.isSuccessful) {
            swal.fire("Success", message, "success");
            this.initializeForm();
            $("#add_job_detail").modal("hide");
          } else {
            swal.fire("Error", message, "error");
          }
          this.getJobDetail();
        },
        (err) => {
          const message = err.status.message.friendlyMessage;
          swal.fire("Error", message, "error");
        }
      );
  }

  // To Get The employee Edit Id And Set Values To Edit Modal Form
  editJobDetail(row) {
    this.formTitle = "Edit Job Detail";
    this.jobDetailForm.patchValue({
      id: row.id,
      job_title: row.job_title,
      job_description: row.job_description,
      sub_Skills: row.sub_Skills,
      job_details_Id: row.job_details_Id,
      skill: row.skill,
      description: row.description,
      weight: row.weight,
    });
    $("#add_job_detail").modal("show");
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
            .deleteData("/hrmsetup/delete/hmo", payload)
            .subscribe(
              (res) => {
                const message = res.status.message.friendlyMessage;
                if (res.status.isSuccessful) {
                  swal.fire("Success", message, "success").then(() => {
                    this.getJobDetail();
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
      this.selectedId = this.jobDetails.map((item) => {
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
