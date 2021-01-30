import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from 'src/app/services/employee.service';
import { SetupService } from 'src/app/services/setup.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import swal from "sweetalert2";
declare const $: any;

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {
  employeeDetails: any = {};
  currentUser: string[] = []; // contains the data of the current user
  currentUserId: number;

  ////
  cardFormTitle: string;
  pageLoading: boolean = false; // controls the visibility of the page loader
  spinner: boolean = false;
  public selectedId: number[] = [];
  public jobTitleId: number;
  skillsForm: FormGroup;
  public jobSkills: any[] = [];
  public jobTitle;
  @ViewChild("fileInput")
  fileInput: ElementRef;

  @Input() staffId: number;
///
 
   // To hold data for each card
   employeeSkills: any = {};
   staffs: any = {};
   
  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private utilitiesService: UtilitiesService,
    private setupService: SetupService,
  ) { }

  ngOnInit(): void {
    //console.log(this.staffId);
    this.getEmployeeSkills(this.staffId);
    this.initSkillsForm();
    this.getSingleStaffById(this.staffId);
    this.getSingleJobTitle(this.jobTitleId) ;
    //console.log(this.jobTitleId);
  }

  initSkillsForm() {
    this.cardFormTitle = "Add Skills";
    this.skillsForm = this.formBuilder.group({
      id: [0],
      skillId: ["", Validators.required],
      expectedScore: ["", Validators.required],
      actualScore: ["", Validators.required],
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
      if (data.employeeList) {
        this.employeeSkills = data.employeeList;
      }
    });
  }

  getSingleStaffById(id: number) {
    this.employeeService.getEmployeeById(id).subscribe((data) => {
      if (data.staff) {
        this.staffs = data.employeeList;
        this.jobTitleId = data.employeeList[0].jobTitle;
        console.log(this.jobTitleId)
      }
    });
  }

  submitSkiilsForm(form: FormGroup) {
    console.log(form.value);

    if (!form.valid) {
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    const payload = form.value;
    payload.approval_status = +payload.approvalStatus;
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
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("Error", message, "error");
      }
    );
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
            this.jobSkills = this.jobTitle.sub_Skills;
            console.log(this.jobSkills);
          }
        },
        (err) => {
          this.pageLoading = false;
          console.log(err);
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

  // Fixes the misleading error message "Cannot find a differ supporting object '[object Object]'"
  hack(val: any[]) {
    return Array.from(val);
  }

  onSelectedFile(event: Event, form: FormGroup) {
    this.utilitiesService.patchFile(event, form);
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

  addItemId(event, id: number) {
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
      this.selectedId = this.employeeSkills.map((item) => {
        return item.id;
      });
    } else {
      this.selectedId = [];
    }
  }


}
