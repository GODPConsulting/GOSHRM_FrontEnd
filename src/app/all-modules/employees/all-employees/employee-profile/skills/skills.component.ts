import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from 'src/app/services/employee.service';
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
  cardFormTitle: string;
  pageLoading: boolean = false; // controls the visibility of the page loader
  spinner: boolean = false;
  currentUser: string[] = []; // contains the data of the current user
  currentUserId: number;
  public selectedId: number[] = [];

  @ViewChild("fileInput")
  fileInput: ElementRef;

  @Input() staffId: number;
  
   // Forms
   skillsForm: FormGroup;

   // To hold data for each card
   employeeSkills: any = {};
   
  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private utilitiesService: UtilitiesService
  ) { }

  ngOnInit(): void {
    console.log(this.staffId);

    this.getEmployeeSkills(this.staffId);
    this.initSkillsForm();
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
    this.fileInput.nativeElement.value = "";
  }

  getEmployeeSkills(id: number) {
    this.employeeService.getSkillByStaffId(id).subscribe((data) => {
      if (data.employeeList) {
        this.employeeSkills = data.employeeList;
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
