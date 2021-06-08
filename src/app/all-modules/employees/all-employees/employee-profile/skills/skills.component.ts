import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EmployeeService } from "src/app/services/employee.service";
import { SetupService } from "src/app/services/setup.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";
import { LoadingService } from "../../../../../services/loading.service";
import { Subject } from "rxjs";
declare const $: any;

@Component({
  selector: "app-skills",
  templateUrl: "./skills.component.html",
  styleUrls: ["./skills.component.css"],
})
export class SkillsComponent implements OnInit {
  cardFormTitle: string;
  spinner: boolean = false;
  selectedId: number[] = [];
  jobTitleId: number;
  jobSkills: any[] = [];
  skillsForm: FormGroup;
  @ViewChild("fileInput")
  fileInput: ElementRef;
  @Input() dataFromParent: any;
  @Input() employeeId: number;
  // To hold data for each card
  employeeSkills: any = {};
  staffs: any = {};
  jobTitle: any;
  dtTrigger: Subject<any> = new Subject();
  public dtOptions: DataTables.Settings = {};
  expectedScore: number;
  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private utilitiesService: UtilitiesService,
    private setupService: SetupService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    console.log(this.dataFromParent);
    this.getEmployeeSkills(this.employeeId);
    this.initSkillsForm();
    this.getSingleStaffById(this.employeeId);
    this.dtOptions = {
      dom:
        "<'row'<'col-sm-8 col-md-5'f><'col-sm-4 col-md-6 align-self-end'l>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Start typing to search by any field",
      },

      columns: [{ orderable: false }, null, null, null, null, null],
      order: [[1, "asc"]],
    };
  }

  downloadFile() {
    if (this.selectedId.length === 0) {
      return swal.fire(`GOS HRM`, "Please select item to download", "error");
    } else if (this.selectedId.length === 1) {
      // Filters out the data of selected file to download
      const idFileToDownload = this.employeeSkills.filter(
        (empId) => empId.id === this.selectedId[0]
      );

      // Gets the file name and extension of the file
      const fileName = idFileToDownload[0].skillName;
      const extension = idFileToDownload[0].proofOfSkillsUrl.split(".")[1];

      this.employeeService.downloadEmployeeSkill(this.selectedId[0]).subscribe(
        (resp) => {
          const data = resp;
          // Converts response to file and downloads it
          this.utilitiesService.byteToFile(data, `${fileName}.${extension}`);
        },
        (err) => {}
      );
    } else {
      return swal.fire(`GOS HRM`, "Unable to download multiple files", "error");
    }
  }

  setWeight(event: Event) {
    let chosenSkill = this.jobSkills.filter(
      (skill) => skill.id == (<HTMLInputElement>event.target).value
    );
    this.expectedScore = chosenSkill[0].weight;
    this.skillsForm.patchValue({
      expectedScore: chosenSkill[0].weight,
    });
    // this.skillsForm.get("expectedScore").setValue(chosenSkill[0].weight);
  }

  initSkillsForm() {
    this.cardFormTitle = "Add Skills";
    this.skillsForm = this.formBuilder.group({
      id: [0],
      skillId: ["", Validators.required],
      expectedScore: [{ value: "", disabled: true }, Validators.required],
      actualScore: [""],
      proofOfSkills: ["", Validators.required],
      approvalStatus: [{ value: "2", disabled: !this.dataFromParent.isHr }],
      staffId: this.employeeId,
      skillFile: ["", Validators.required],
    });
    // Resets the upload input of the add form
    if (this.fileInput) {
      this.fileInput.nativeElement.value = "";
    }
  }

  getEmployeeSkills(id: number) {
    this.employeeService.getSkillByStaffId(id).subscribe((data) => {
      if (data) {
        this.employeeSkills = data.employeeList;
        this.dtTrigger.next();
      }
    });
  }

  getSingleStaffById(id: number) {
    this.employeeService.getEmployeeById(id).subscribe((data) => {
      if (data) {
        this.staffs = data.employeeList;

        this.jobTitleId = data.employeeList[0].jobTitle;

        this.getSingleJobTitle(this.jobTitleId);
      }
    });
  }

  getSingleJobTitle(id: number) {
    this.loadingService.show();
    return this.setupService.getSingleJobTitleById(id).subscribe(
      (data) => {
        this.loadingService.hide();
        this.jobTitle = data.setuplist[0];
        this.jobSkills = this.jobTitle.sub_Skills;
      },
      (err) => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  submitSkillsForm(form: FormGroup) {
    const payload = form.value;
    form.get("approvalStatus").enable();
    form.get("expectedScore").enable();
    // Send mail to HR
    if (!this.dataFromParent.isHr) {
      this.utilitiesService
        .sendToHr(
          "Add Skills",
          this.dataFromParent.user.firstName,
          this.dataFromParent.user.lastName,
          this.dataFromParent.user.email,
          this.dataFromParent.user.userId
        )
        .subscribe();
      if (form.get("approvalStatus").value !== 2) {
        form.get("approvalStatus").setValue(2);
      }
    }
    if (!form.valid) {
      form.get("expectedScore").disable();
      // form.get("approvalStatus").disable();
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    payload.approvalStatus = 2;
    payload.expectedScore = this.expectedScore;
    // console.log(payload);
    // return;
    const formData = new FormData();
    Object.keys(payload).forEach((key) => {
      formData.append(key, payload[key]);
    });
    // const formData = new FormData();
    // for (const key in form.value) {
    //   formData.append(key, this.skillsForm.get(key).value);
    // }
    this.skillsForm.get("expectedScore").disable();
    form.get("approvalStatus").disable();
    this.spinner = true;
    return this.employeeService.addSkill(formData).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success").then(() => {
            this.getEmployeeSkills(this.employeeId);
            $("#skills_modal").modal("hide");
          });
        }
      },
      (err) => {
        this.spinner = false;
        form.get("expectedScore").disable();
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  // Set Values To Edit Modal Form
  edit(row) {
    this.cardFormTitle = "Edit Skills";
    this.skillsForm.patchValue({
      id: row.id,
      skillId: row.skillId,
      expectedScore: row.expectedScore,
      actualScore: row.actualScore,
      proofOfSkills: row.proofOfSkills,
      approvalStatus: row.approvalStatus,
      staffId: this.employeeId,
      skillFile: row.skillFile,
    });
    $("#skills_modal").modal("show");
  }

  // Prevents the edit modal from popping up when checkbox is clicked
  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
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
          return this.employeeService.deleteSkills(payload).subscribe(
            (res) => {
              this.loadingService.hide();
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOSHRM", message, "success").then(() => {
                  this.getEmployeeSkills(this.employeeId);
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

  addItemId(event: Event, id: number) {
    this.utilitiesService.deleteArray(event, id, this.selectedId);
  }

  checkAll(event: Event) {
    this.selectedId = this.utilitiesService.checkAllBoxes(
      event,
      this.jobSkills
    );
  }

  // Fixes the misleading error message "Cannot find a differ supporting object '[object Object]'"
  hack(val: any[]) {
    return Array.from(val);
  }

  onSelectedFile(event: Event, form: FormGroup) {
    this.utilitiesService.uploadFileValidator(event, form, this.employeeId);
  }
}
