import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EmployeeService } from "src/app/services/employee.service";
import { SetupService } from 'src/app/services/setup.service';
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";
declare const $: any;

@Component({
  selector: 'app-career',
  templateUrl: './career.component.html',
  styleUrls: ['./career.component.css']
})
export class CareerComponent implements OnInit {
  employeeDetails: any = {};
  cardFormTitle: string;
  pageLoading: boolean = false; // controls the visibility of the page loader
  spinner: boolean = false;
  currentUser: string[] = []; // contains the data of the current user
  currentUserId: number;
  public selectedId: number[] = [];
  public locationId: number;
  public countryId: number;
  public countries: any[] = []
  public jobGrades: any[] = [];
  public jobTitles: any[] = [];
  @ViewChild("fileInput")
  fileInput: ElementRef;

  @Input() staffId: number;

  // Forms
  careerForm: FormGroup;

  // To hold data for each card
  employeeCareer: any = {};

  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private utilitiesService: UtilitiesService,
    private setupService: SetupService
  ) {}

  ngOnInit(): void {
    console.log(this.staffId);

    this.getEmployeeCareer(this.staffId);
    this.initCareerForm();
    this.getCountry();
    this.getJobGrade();
    this.getJobTitle();
  }

  initCareerForm() {
    this.cardFormTitle = "Add Career";
    this.careerForm = this.formBuilder.group({
      id: [0],
      job_Grade: ["", Validators.required],
      job_title: ["", Validators.required],
      job_type: ["", Validators.required],
      countryId: ["", Validators.required],
      locationId: ["", Validators.required],
      office: ["", Validators.required],
      line_Manager: ["", Validators.required],
      first_Level_Reviewer: ["", Validators.required],
      second_Level_Reviewer: ["", Validators.required],
      start_month: ["", Validators.required],
      start_year: ["", Validators.required],
      end_month: ["", Validators.required],
      end_year: ["", Validators.required],
      approval_status: ["", Validators.required],
      staffId: this.staffId,
      // identicationFile: ["", Validators.required],
    });
    //this.fileInput.nativeElement.value = "";
  }

  getJobGrade() {
    this.pageLoading = true;
    return this.setupService.getData("/hrmsetup/get/all/jobgrades").subscribe(
      (data) => {
        this.pageLoading = false;
        console.log(data);
        this.jobGrades = data.setuplist;
      },
      (err) => {
        this.pageLoading = false;
        console.log(err);
      }
    );
  }
  getJobTitle() {
    this.pageLoading = true;
    return this.setupService.getData("/hrmsetup/get/all/jobtitle").subscribe(
      (data) => {
        this.pageLoading = false;
        console.log(data);
        this.jobTitles = data.setuplist;
      },
      (err) => {
        this.pageLoading = false;
        console.log(err);
      }
    );
  }

  submitCareerForm(form: FormGroup) {
    console.log(form.value);

    if (!form.valid) {
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    const payload = form.value;
    payload.approvalStatus = +payload.approvalStatus;
    payload.countryId = +payload.countryId;
    

    this.spinner = true;
    return this.employeeService.postCareer(payload).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          $("#career_modal").modal("hide");
        }
        this.getEmployeeCareer(this.staffId);
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("Error", message, "error");
      }
    );
  }

  getEmployeeCareer(id: number) {
    this.employeeService.getCareerByStaffId(id).subscribe((data) => {
      if (data.employeeList) {
        this.employeeCareer = data.employeeList;
        console.log(data.employeeList);
      }
    });
  }

  getCountry() {
    return this.utilitiesService.getCountry().subscribe(
      (data) => {
        this.countries = data.commonLookups;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  // Set Values To Edit Modal Form
  edit(row) {
    this.cardFormTitle = "Edit Career";
   
    this.careerForm.patchValue({
      id: row.id,
      jobGrade: row.job_Grade,
      job_title: row.job_title,
      job_type: row.job_type,
      countryId: row.countryId,
      locationId: row.locationId,
      office: row.office,
      line_Manager: row.line_Manager,
      first_Level_Reviewer: row.first_Level_Reviewer,
      second_Level_Reviewer: row.second_Level_Reviewer,
      start_month: row.start_month,
      start_year: row.start_year,
      end_month: row.end_month,
      end_year: row.end_year,
      approval_status_name: row.approval_status_name,
      staffId: this.staffId,
      careerFile: row.careerFile,
    });
    $("#career_modal").modal("show");
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
          return this.employeeService.deleteCareer(payload).subscribe(
            (res) => {
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOSHRM", message, "success").then(() => {
                  this.getEmployeeCareer(this.staffId);
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
      this.selectedId = this.employeeCareer.map((item) => {
        return item.id;
      });
    } else {
      this.selectedId = [];
    }
  }
}
