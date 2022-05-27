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
  industryForm: FormGroup;
  jobTypeForm: FormGroup;
  jobCategoryForm: FormGroup;
  levelForm: FormGroup;
  specializationForm: FormGroup;
  locationForm: FormGroup;
  fileToUpload: File;
  public industries: any[] = [];
  public jobTypes: any[] = [];
  public jobCategories: any[] = [];
  public locations: any[] = [];
  public specializations: any[] = [];
  public experienceLevels: any[] = [];
  public selectedId: number[] = [];
  public spinner: boolean = false;
  dtTrigger: Subject<any> = new Subject();
  selectDeleteitems: any[] = [];
  cols: ISearchColumn[];
  modalData = {
    isEditing: false,
    tabName: ''
  };
  current_tab: string;
  constructor(
    private fb: FormBuilder,
    private utilitiesService: UtilitiesService,
    private loadingService: LoadingService,
    private rmsService: RmsSetupService,
  ) {
    this.jobCategoryForm = this.fb.group({
      jobCategoryId: [0],
      jobCategoryName: ["", Validators.required],
      jobCategoryDescription: ["", Validators.required],
    });
    this.jobTypeForm = this.fb.group({
      jobTypeId: [0],
      jobTypeName: ["", Validators.required],
      jobTypeDescription: ["", Validators.required],
    });
    this.levelForm = this.fb.group({
      experienceLevelId: [0],
      experienceLevelName: ["", Validators.required],
      experienceLevelDescription: ["", Validators.required],
    });
    this.locationForm = this.fb.group({
      locationId: [0],
      locationName: ["", Validators.required],
      locationDescription: ["", Validators.required],
    });
    this.industryForm = this.fb.group({
      industryId: [0],
      industryName: ["", Validators.required],
      industryDescription: ["", Validators.required],
    });
    this.specializationForm = this.fb.group({
      specializationId: [0],
      specializationName: ["", Validators.required],
      specializationDescription: ["", Validators.required],
    });
  }

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
    // this.cols = [
    //   {
    //     header: "job_grade",
    //     field: "job_grade",
    //   },
    //   {
    //     header: "job_grade_reporting_to",
    //     field: "job_grade_reporting_to",
    //   },
    //   {
    //     header: "rank",
    //     field: "rank",
    //   },
    //   {
    //     header: "probation_period_in_months",
    //     field: "probation_period_in_months",
    //   },
    // ];
  }

  getAllIndustries() {
    this.rmsService.getAllIndustry().subscribe(
      (data) => {
        // console.log(data)
        this.industries = data.industries;
      },
      (err) => {}
    );
  }

  getAllJobTypes() {
    this.rmsService.getAllJobType().subscribe(
      (data) => {
        // console.log(data)
        this.jobTypes = data.jobTypes;
      },
      (err) => {}
    );
  }

  getAllJobCategories() {
    this.rmsService.getAllJobcategory().subscribe(
      (data) => {
        // console.log(data)
        this.jobCategories = data.jobCategories;
      },
      (err) => {}
    );
  }

  getAllLocations() {
    this.rmsService.getAllLocation().subscribe(
      (data) => {
        // console.log(data)
        this.locations = data.locations;
      },
      (err) => {}
    );
  }

  getAllSpecializations() {
    this.rmsService.getAllSpecialization().subscribe(
      (data) => {
        // console.log(data)
        this.specializations = data.specializations;
      },
      (err) => {}
    );
  }

  getExperiencelevels() {
    this.rmsService.getExperiencelevel().subscribe(
      (data) => {
        // console.log(data)
        this.experienceLevels = data.experienceLevels;
      },
      (err) => {}
    );
  }

  initializeForm(current_tab) {
    this.current_tab = current_tab;
  }

  openUploadModal() {
    // Reset upload form
    this.fileInput.nativeElement.value = "";
    $("#upload_modal").modal("show");
  }

  openModal(isEdit: boolean, data?: any) {
    this.initializeForm(this.current_tab);
    $("#add_job_grade").modal("show");
    this.modalData.isEditing = isEdit;
    if (isEdit == true) {
      if(this.current_tab == 'Job Category') {
        this.jobCategoryForm = this.fb.group({
          jobCategoryId: [data?.jobCategoryId],
          jobCategoryName: [data?.jobCategoryName],
          jobCategoryDescription: [data?.jobCategoryDescription],
        });
      } else if(this.current_tab == 'Job Type') {
        this.jobTypeForm = this.fb.group({
          jobTypeId: [data?.jobTypeId],
          jobTypeName: [data?.jobTypeName],
          jobTypeDescription: [data?.jobTypeDescription],
        });
      } else if(this.current_tab == 'Specialization') {
        this.specializationForm = this.fb.group({
          specializationId: [data?.specializationId],
          specializationName: [data?.specializationName],
          specializationDescription: [data?.specializationDescription],
        });
      } else if(this.current_tab == 'Location') {
        this.locationForm = this.fb.group({
          locationId: [data?.locationId],
          locationName: [data?.locationName],
          locationDescription: [data?.locationDescription],
        });
      } else if(this.current_tab == 'Industry') {
        this.industryForm = this.fb.group({
          industryId: [data?.industryId],
          industryName: [data?.industryName],
          industryDescription: [data?.industryDescription],
        });
      } else {
        this.levelForm = this.fb.group({
          experienceLevelId: [data?.experienceLevelId],
          experienceLevelName: [data?.experienceLevelName],
          experienceLevelDescription: [data?.experienceLevelDescription],
        });
      }
    }
  }

  closeModal() {
    $("#add_job_grade").modal("hide");
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

  submitIndustry(form: FormGroup) {

    this.rmsService.addupdateIndustry(form.value).subscribe(
        data => {
          console.log(data);
          let message = data.status.message.friendlyMessage;
          swal.fire("GOS FINANCIAL", message, "success");
          // const index = this.industries.findIndex((industry) => {
          //   return industry.industryId == data.industry.industryId;
          // })
          // console.log(index)
          // if(index) {
          //   this.industries[index] = form.value;
          // } else {
             this.industries.push(data.industry);
          // }
          this.closeModal();
         
        },
        err => {
            let message = err.status.message.friendlyMessage;
            swal.fire("GOS FINANCIAL", message, "error");
        }
    );
  }

  submitJobType(form: FormGroup) {

    this.rmsService.addupdatejobtype(form.value).subscribe(
        data => {
          console.log(data);
          let message = data.status.message.friendlyMessage;
          swal.fire("GOS FINANCIAL", message, "success");
          this.jobTypes.push(data.jobType);
          this.closeModal();
        },
        err => {
            let message = err.status.message.friendlyMessage;
            swal.fire("GOS FINANCIAL", message, "error");
        }
    );
  }

  submitJobCategory(form: FormGroup) {

    this.rmsService.addupdateJobcategory(form.value).subscribe(
        data => {
          console.log(data);
          let message = data.status.message.friendlyMessage;
          swal.fire("GOS FINANCIAL", message, "success");
          this.jobCategories.push(data.jobCategory);
          this.closeModal();
        },
        err => {
            let message = err.status.message.friendlyMessage;
            swal.fire("GOS FINANCIAL", message, "error");
        }
    );
  }

  submitLocation(form: FormGroup) {

    this.rmsService.addupdateLocation(form.value).subscribe(
        data => {
          console.log(data);
          let message = data.status.message.friendlyMessage;
          swal.fire("GOS FINANCIAL", message, "success");
          this.locations.push(data.location);
          this.closeModal();
        },
        err => {
            let message = err.status.message.friendlyMessage;
            swal.fire("GOS FINANCIAL", message, "error");
        }
    );
  }

  submitLevel(form: FormGroup) {

    this.rmsService.addupdateExperienceLevel(form.value).subscribe(
        data => {
          console.log(data);
          let message = data.status.message.friendlyMessage;
          swal.fire("GOS FINANCIAL", message, "success");
          this.experienceLevels.push(data.experienceLevel);
          this.closeModal();
        },
        err => {
            let message = err.status.message.friendlyMessage;
            swal.fire("GOS FINANCIAL", message, "error");
        }
    );
  }

  submitSpecialization(form: FormGroup) {

    this.rmsService.addupdateSpecialization(form.value).subscribe(
        data => {
          console.log(data);
          let message = data.status.message.friendlyMessage;
          swal.fire("GOS FINANCIAL", message, "success");
          this.specializations.push(data.specialization);
          this.closeModal();
        },
        err => {
            let message = err.status.message.friendlyMessage;
            swal.fire("GOS FINANCIAL", message, "error");
        }
    );
  }

  deleteItem(id) {
    let operation = '';
    let payload
    if(this.current_tab == 'Job Category') {
     operation = 'deleteJobcategory';
     payload = {
      jobCategoryIds: [id]
     }
    } else if(this.current_tab == 'Job Type') {
      operation = 'deleteJobType';
      payload = {
        jobTypeIds: [id]
      }
    } else if(this.current_tab == 'Specialization') {
      operation = 'deleteSpecialization';
      payload = {
        specializationIds:[id]
      }
    } else if(this.current_tab == 'Location') {
      operation = 'deleteLocation';
      payload = {
        locationIds: [id]
      }
    } else if(this.current_tab == 'Industry') {
      operation = 'deleteIndustry';
      payload = {
        industryIds:[id]
      }
    } else {
      operation = 'deleteExperienceLevel';
      payload = {
        experienceLevelIds: [id]
      }
    }
    swal.fire({
      title: '',
      html: `
      <div class="alert alert-danger" role="alert">
        <img src="assets/img/Error.svg" alt="">
        <span class="px-3">Warning: You are about to delete a section of this course outline!</span>
      </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Confirm!',
      cancelButtonText: 'Cancel',
      width: '500px'
    })
    .then((result) => {
      if (result.value) {
        this.rmsService[operation](payload).subscribe((data) => {
          if (data.status.isSuccessful) {
            swal.fire('GOS FINANCIAL', `${this.current_tab} deleted successful.`, 'success');
            this.getAllIndustries();
          } else {
            swal.fire('GOS FINANCIAL', 'Record not deleted', 'error');
          }
        });
      } else {
        swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
      }
    });
  }

  multipleDelete() {
    if (this.selectDeleteitems.length == 0) {
      return swal.fire('GOS FINANCIAL', 'Select item to delete', 'error');
    }
    const tempData = this.selectDeleteitems;
    let operation = '';
    let payload
    console.log(this.selectDeleteitems)
    if(this.current_tab == 'Job Category' && tempData !== undefined) {
     operation = 'deleteJobcategory';
     tempData.forEach((el) => {
        let data = el.jobCategoryId;
        payload= {
          jobCategoryIds: [data]
        }
      });
    } else if(this.current_tab == 'Job Type' && tempData !== undefined) {
      operation = 'deleteJobType';
      tempData.forEach((el) => {
        let data = el.jobTypeId;
        payload = {
          jobTypeIds: [data]
        }
      });
    } else if(this.current_tab == 'Specialization' && tempData !== undefined) {
      operation = 'deleteSpecialization';
      tempData.forEach((el) => {
        let data = el.specializationId;
        payload = {
          specializationIds: [data]
        }
      });
    } else if(this.current_tab == 'Location' && tempData !== undefined) {
      operation = 'deleteLocation';
      tempData.forEach((el) => {
        let data = el.locationId;
        payload = {
          locationIds: [data]
        }
      });
    } else if(this.current_tab == 'Industry' && tempData !== undefined) {
      operation = 'deleteIndustry';
      tempData.forEach((el) => {
        let data = el.industryId;
        payload = {
          industryIds: [data]
        }
      });
    } else {
      operation = 'deleteExperienceLevel';
      tempData.forEach((el) => {
        let data = el.experienceLevelId;
        payload = {
          experienceLevelIds: [data]
        }
      });
    }
    swal.fire({
      title: '',
      html: `
      <div class="alert alert-danger" role="alert">
        <img src="assets/img/Error.svg" alt="">
        <span class="px-3">Warning: You are about to delete a section of this course outline!</span>
      </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Confirm!',
      cancelButtonText: 'Cancel',
      width: '500px'
    })
    .then((result) => {
      if (result.value) {
        this.rmsService[operation](payload).subscribe((data) => {
          if (data.status.isSuccessful) {
            swal.fire('GOS FINANCIAL', `${this.current_tab} deleted successful.`, 'success');
            this.getAllIndustries();
          } else {
            swal.fire('GOS FINANCIAL', 'Record not deleted', 'error');
          }
        });
      } else {
        swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
      }
    });
  }

  exportList() {
    let operation = '';
    if(this.current_tab == 'Job Category') {
     operation = 'exportJobcategory';
    } else if(this.current_tab == 'Job Type') {
      operation = 'exportJobType';
    } else if(this.current_tab == 'Specialization') {
      operation = 'exportSpecialization';
    } else if(this.current_tab == 'Location') {
      operation = 'exportLocation';
    } else if(this.current_tab == 'Industry') {
      operation = 'exportIndustry';
    } else {
      operation = 'exportExperienceLevel';
    }
   
    this.loadingService.show();
    this.rmsService[operation]().subscribe(
      (resp) => {
        this.loadingService.hide();
        this.utilitiesService.byteToFile(resp.export, `${this.current_tab}.xlsx`, {
          type: "application/vnd.ms-excel",
        });
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
    // this.uploadList();
  }

  async uploadList() {
    if (this.fileToUpload == null) {
      swal.fire(
        'GOS FINANCIAL',
        'Please select upload document to continue',
        'error'
      );
      return;
    }
    if (
      this.fileToUpload.type !=
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      return swal.fire('GOS FINANCIAL', 'Only excel files allowed', 'error');
    }
    let operation = '';
    if(this.current_tab == 'Job Category') {
     operation = 'uploadJobcategory';
    } else if(this.current_tab == 'Job Type') {
      operation = 'uploadJobType';
    } else if(this.current_tab == 'Specialization') {
      operation = 'uploadSpecialization';
    } else if(this.current_tab == 'Location') {
      operation = 'uploadLocation';
    } else if(this.current_tab == 'Industry') {
      operation = 'uploadIndustry';
    } else {
      operation = 'uploadExperienceLevel';
    }
    console.log(this.fileToUpload);
    await this.rmsService[operation](this.fileToUpload)
      .then((data) => {
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.fileToUpload = null;
          // this.getAllCountry();
          this.fileInput.nativeElement.value = '';
          swal.fire('GOS FINANCIAL', message, 'success');
        } else {
          this.fileToUpload = null;
          // this.getAllCountry();
          this.fileInput.nativeElement.value = '';
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      })
      .catch((err) => {
        let error = JSON.stringify(err);
        console.log(error);
        // const message = error.status.message.friendlyMessage;
        // swal.fire('GOS FINANCIAL', message, 'error');
      });
  }

  // Prevents the edit modal from popping up when checkbox is clicked
  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
  }
}

