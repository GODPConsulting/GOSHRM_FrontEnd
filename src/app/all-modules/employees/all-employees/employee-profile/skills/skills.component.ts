import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EmployeeService } from "src/app/services/employee.service";
import { SetupService } from "src/app/services/setup.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";
declare const $: any;

@Component({
  selector: "app-skills",
  templateUrl: "./skills.component.html",
  styleUrls: ["./skills.component.css"],
})
export class SkillsComponent implements OnInit {
  cardFormTitle: string;
  pageLoading: boolean = false; // controls the visibility of the page loader
  spinner: boolean = false;
  selectedId: number[] = [];
  jobTitleId: number;
  jobSkills: any[] = [
    { skill: "test", id: 1, weight: 10 },
    { skill: "try", id: 2, weight: 20 },
    { skill: "hmm", id: 3, weight: 30 },
  ];
  skillsForm: FormGroup;
  @ViewChild("fileInput")
  fileInput: ElementRef;
  @Input() staffId: number;

  // To hold data for each card
  employeeSkills: any = {};
  staffs: any = {};
  jobTitle: any;

  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private utilitiesService: UtilitiesService,
    private setupService: SetupService
  ) {}

  ngOnInit(): void {
    //console.log(this.staffId);
    this.getEmployeeSkills(this.staffId);
    this.initSkillsForm();
    this.getSingleStaffById(this.staffId);

    //console.log(this.jobTitleId);
  }

  setWeight(event: Event) {
    let chosenSkill = this.jobSkills.filter(
      (skill) => skill.id == (<HTMLInputElement>event.target).value
    );
    this.skillsForm.get("expectedScore").setValue(chosenSkill[0].weight);
  }

  initSkillsForm() {
    this.cardFormTitle = "Add Skills";
    this.skillsForm = this.formBuilder.group({
      id: [0],
      skillId: ["", Validators.required],
      expectedScore: [{ value: "", disabled: true }, Validators.required],
      actualScore: [""],
      proofOfSkills: ["", Validators.required],
      approvalStatus: ["", Validators.required],
      staffId: this.staffId,
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
      }
    });
  }

  getSingleStaffById(id: number) {
    this.employeeService.getEmployeeById(id).subscribe((data) => {
      if (data) {
        this.staffs = data.employeeList;

        this.jobTitleId = data.employeeList[0].jobTitle;
        console.log(this.jobTitleId);
        this.getSingleJobTitle(this.jobTitleId);
      }
    });
  }

  getSingleJobTitle(id: number) {
    this.pageLoading = true;
    return this.setupService.getSingleJobTitle(id).subscribe(
      (data) => {
        this.pageLoading = false;
        this.jobTitle = data.setuplist[0];
        this.jobSkills = this.jobTitle.sub_Skills;
        console.log(this.jobSkills);
      },
      (err) => {
        this.pageLoading = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("Error", message, "error");
      }
    );
  }

  submitSkillsForm(form: FormGroup) {
    console.log(form.value);

    form.get("expectedScore").enable();
    if (!form.valid) {
      form.get("expectedScore").disable();
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    const formData = new FormData();
    for (const key in form.value) {
      //console.log(key, this.skillsForm.get(key).value);
      formData.append(key, this.skillsForm.get(key).value);
    }

    this.spinner = true;
    return this.employeeService.addSkill(formData).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          $("#skills_modal").modal("hide");
        }
        this.getEmployeeSkills(this.staffId);
      },
      (err) => {
        form.get("expectedScore").disable();
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("Error", message, "error");
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
      staffId: this.staffId,
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
          return this.employeeService.deleteSkills(payload).subscribe(
            (res) => {
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOSHRM", message, "success").then(() => {
                  this.getEmployeeSkills(this.staffId);
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
    this.utilitiesService.patchFile(event, form);
  }
}
