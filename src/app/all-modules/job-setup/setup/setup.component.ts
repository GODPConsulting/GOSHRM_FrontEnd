import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SetupService } from "src/app/services/setup.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";
import { LoadingService } from "../../../services/loading.service";
import { Subject } from "rxjs";
import { ISearchColumn } from "../../../interface/interfaces";
import { RmsSetupService } from "src/app/services/rms-setup.service";

declare const $: any;
@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {
  // public formTitle: string = "Add Job Grade";
  public dtOptions: DataTables.Settings = {};
  @ViewChild("fileInput") fileInput: ElementRef;
  jobGradeForm: FormGroup;
  public industries: any[] = [];
  public jobTypes: any[] = [];
  public jobCategories: any[] = [];
  public locations: any[] = [];
  public specializations: any[] = [];
  public experienceLevels: any[] = [];
  public selectedId: number[] = [];
  public spinner: boolean = false;
  dtTrigger: Subject<any> = new Subject();
  selectJobGrades: any[];
  cols: ISearchColumn[];
  modalData = {
    isEditing: false,
    tabName: ''
  };
  current_tab: string;
  constructor(
    private formBuilder: FormBuilder,
    private setupService: SetupService,
    private utilitiesService: UtilitiesService,
    private loadingService: LoadingService,
    private rmsService: RmsSetupService
  ) {}

  ngOnInit(): void {
    // $('table').dataTable({searching: false, paging: true, info: true, bFilter: false});

    this.current_tab = 'Job Category',
    this.getAllIndustries();
    this.getAllJobCategories();
    this.getAllJobTypes();
    this.getAllLocations();
    this.getAllSpecializations();
    this.getExperiencelevels();
    this.initializeForm(this.current_tab);
    this.cols = [
      {
        header: "job_grade",
        field: "job_grade",
      },
      {
        header: "job_grade_reporting_to",
        field: "job_grade_reporting_to",
      },
      {
        header: "rank",
        field: "rank",
      },
      {
        header: "probation_period_in_months",
        field: "probation_period_in_months",
      },
    ];
  }

  getAllIndustries() {
    this.rmsService.getAllIndustry().subscribe(
      (data) => {
        console.log(data)
        this.industries = data.industries;
      },
      (err) => {}
    );
  }
  getAllJobTypes() {
    this.rmsService.getAllJobType().subscribe(
      (data) => {
        console.log(data)
        this.jobTypes = data.jobTypes;
      },
      (err) => {}
    );
  }
  getAllJobCategories() {
    this.rmsService.getAllJobcategory().subscribe(
      (data) => {
        console.log(data)
        this.jobCategories = data.jobCategories;
      },
      (err) => {}
    );
  }
  getAllLocations() {
    this.rmsService.getAllLocation().subscribe(
      (data) => {
        console.log(data)
        this.locations = data.locations;
      },
      (err) => {}
    );
  }
  getAllSpecializations() {
    this.rmsService.getAllSpecialization().subscribe(
      (data) => {
        console.log(data)
        this.specializations = data.specializations;
      },
      (err) => {}
    );
  }
  getExperiencelevels() {
    this.rmsService.getExperiencelevel().subscribe(
      (data) => {
        console.log(data)
        this.experienceLevels = data.experienceLevels;
      },
      (err) => {}
    );
  }

  downloadFile() {
    // this.loadingService.show();
    this.setupService.exportExcelFile("/hrmsetup/download/jobgrade").subscribe(
      (resp) => {
        // this.loadingService.hide();
        this.utilitiesService.byteToFile(resp, "Job Grade.xlsx", {
          type: "application/vnd.ms-excel",
        });
      },
      (err) => {
        // this.loadingService.hide();
      }
    );
  }

  initializeForm(current_tab) {
    this.current_tab = current_tab;
  }

  openUploadModal() {
    // Reset upload form
    this.fileInput.nativeElement.value = "";
    $("#upload_job_grade").modal("show");
  }

  openModal(isEdit) {
    this.initializeForm(this.current_tab);
    $("#add_job_grade").modal("show");
    this.modalData.isEditing = isEdit;
  }

  openDeleteModal() {
    this.initializeForm(this.current_tab);
    $("#delete_item").modal("show");
    console.log('Hello')
  }

  closeModal() {
    $("#add_job_grade").modal("hide");
  }

  closeDeleteModal() {
    $("#delete_item").modal("hide");
  }


  addItemId(event: Event, id: number) {
    this.utilitiesService.deleteArray(event, id, this.selectedId);
  }

  checkAll(event: Event) {
    this.selectedId = this.utilitiesService.checkAllBoxes(
      event,
      this.industries
    );
  }



  getCurrentTab(tabName) {
    this.current_tab = tabName;
  }

  // Prevents the edit modal from popping up when checkbox is clicked
  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
  }
}

