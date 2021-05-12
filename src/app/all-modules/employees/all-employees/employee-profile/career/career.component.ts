import { Component, OnInit, ViewChild, ElementRef, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EmployeeService } from "src/app/services/employee.service";
import { SetupService } from "src/app/services/setup.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";
import { LoadingService } from "../../../../../services/loading.service";
<<<<<<< HEAD
import { CommonService } from "../../../../../services/common.service";
=======
import { Subject } from "rxjs";
>>>>>>> work
declare const $: any;

@Component({
  selector: "app-career",
  templateUrl: "./career.component.html",
  styleUrls: ["./career.component.css"],
})
export class CareerComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};

  employeeDetails: any = {};
  cardFormTitle: string;
  spinner: boolean = false;
  currentUser: string[] = []; // contains the data of the current user
  currentUserId: number;
  public selectedId: number[] = [];
  public locationId: number;
  public countryId: number;
  public locations: any[] = [];
  public countries: any[] = [];
  public jobGrades: any[] = [];
  public jobTitles: any[] = [];
  public offices: any[] = [];
  public employmentTypes: any[] = [];
  public employeesList: any = [];
  @ViewChild("fileInput")
  fileInput: ElementRef;

  @Input() dataFromParent: any;

  // Forms
  careerForm: FormGroup;

  // To hold data for each card
  employeeCareer: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private utilitiesService: UtilitiesService,
    private setupService: SetupService,
    private loadingService: LoadingService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    // Determines the structure of the table (Angular Datatables)
    this.dtOptions = {
      dom:
        "<'row'<'col-sm-8 col-md-5'f><'col-sm-4 col-md-6 align-self-end'l>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Start typing to search by any field",
      },

      columns: [
        { orderable: false },
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ],
      order: [[1, "asc"]],
    };
    this.getEmployeeCareer(this.dataFromParent.user.staffId);
    this.initCareerForm();
    this.getCountry();
    this.getJobGrade();
    this.getJobTitle();
    this.getLocation();
    this.getStaffDepartments();
    this.loadEmployees();
    this.getEmploymentType();

    this.getJobTitle();
  }
  //this.setupService.getData
  // Get All Employees

  initCareerForm() {
    this.cardFormTitle = "Add Career";
    this.careerForm = this.formBuilder.group({
      id: [0],
      job_GradeId: ["", Validators.required],
      job_titleId: ["", Validators.required],
      job_type: ["", Validators.required],
      countryId: ["", Validators.required],
      locationId: ["", Validators.required],
      officeId: ["", Validators.required],
      line_ManagerId: ["", Validators.required],
      first_Level_ReviewerId: ["", Validators.required],
      second_Level_ReviewerId: ["", Validators.required],
      third_Level_ReviewerId: ["", Validators.required],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      approval_status: [
        { value: "2", disabled: !this.dataFromParent.isHr },
        Validators.required,
      ],
      staffId: this.dataFromParent.user.staffId,
    });
    //this.fileInput.nativeElement.value = "";
  }

  getJobGrade() {
    this.loadingService.show();
    return this.commonService.getJobGrades().subscribe(
      (data) => {
        this.loadingService.hide();

        this.jobGrades = data.setuplist;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  getJobTitle() {
    this.loadingService.show();
    return this.setupService.getJobTitle().subscribe(
      (data) => {
        this.loadingService.hide();

        this.jobTitles = data.setuplist;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  getEmploymentType() {
    this.loadingService.show();
    return this.setupService.getEmploymentType().subscribe(
      (data) => {
        this.loadingService.hide();

        this.employmentTypes = data.setuplist;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  loadEmployees() {
    this.loadingService.show();
    this.employeeService.getEmployees().subscribe(
      (data) => {
        this.loadingService.hide();

        this.employeesList = data.employeeList;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  submitCareerForm(form: FormGroup) {
    form.get("approval_status").enable();

    if (!form.valid) {
      form.get("approval_status").disable();
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    const payload = form.value;
    payload.approval_status = +payload.approval_status;
    payload.countryId = +payload.countryId;
    payload.locationId = +payload.locationId;
    payload.job_GradeId = +payload.job_GradeId;
    payload.job_titleId = +payload.job_titleId;
    payload.officeId = +payload.officeId;
    payload.line_ManagerId = +payload.line_ManagerId;
    payload.first_Level_ReviewerId = +payload.first_Level_ReviewerId;
    payload.second_Level_ReviewerId = +payload.second_Level_ReviewerId;
    payload.third_Level_ReviewerId = +payload.third_Level_ReviewerId;
    form.get("approval_status").disable();

    this.spinner = true;
    return this.employeeService.postCareer(payload).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          $("#career_modal").modal("hide");
        }
        this.getEmployeeCareer(this.dataFromParent.user.staffId);
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  getEmployeeCareer(id: number) {
    this.employeeService.getCareerByStaffId(id).subscribe((data) => {
      if (data.employeeList) {
        this.employeeCareer = data.employeeList;
        this.dtTrigger.next();
      }
    });
  }

  getCountry() {
    return this.utilitiesService.getCountry().subscribe(
      (data) => {
        this.countries = data.commonLookups;
      },
      (err) => {}
    );
  }

  getLocation() {
    return this.setupService.getLocation().subscribe(
      (data) => {
        this.locations = data.setuplist;
      },
      (err) => {}
    );
  }

  getStaffDepartments() {
    this.loadingService.show();
    return this.commonService.getCompanyStructures().subscribe(
      (data) => {
        this.loadingService.hide();
        this.offices = data.companyStructures;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  // Set Values To Edit Modal Form
  edit(row) {
    this.cardFormTitle = "Edit Career";

    this.careerForm.patchValue({
      id: row.id,
      job_GradeId: row.job_GradeId,
      job_titleId: row.job_titleId,
      job_type: row.job_type,
      countryId: row.countryId,
      locationId: row.locationId,
      officeId: row.officeName,
      line_ManagerId: row.line_ManagerName,
      first_Level_ReviewerId: row.first_Level_ReviewerId,
      second_Level_ReviewerId: row.second_Level_ReviewerId,
      third_Level_ReviewerId: row.third_Level_ReviewerId,
      startDate: row.startDate,
      endDate: row.endDate,
      approval_status_name: row.approval_status_name,
      staffId: this.dataFromParent.user.staffId,
      careerFile: row.careerFile,
    });
    $("#career_modal").modal("show");
  }

  // Fixes the misleading error message "Cannot find a differ supporting object '[object Object]'"
  hack(val: any[]) {
    return Array.from(val);
  }

  onSelectedFile(event: Event, form: FormGroup) {
    this.utilitiesService.uploadFileValidator(
      event,
      form,
      this.dataFromParent.user.staffId
    );
  }
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
          return this.employeeService.deleteCareer(payload).subscribe(
            (res) => {
              this.loadingService.hide();
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOSHRM", message, "success").then(() => {
                  this.getEmployeeCareer(this.dataFromParent.user.staffId);
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

  downloadFile() {}
}
