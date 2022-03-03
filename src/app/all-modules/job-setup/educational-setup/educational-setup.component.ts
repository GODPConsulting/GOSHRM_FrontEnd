import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SetupService } from "src/app/services/setup.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";
import { LoadingService } from "../../../services/loading.service";
import { Subject } from "rxjs";
import { ISearchColumn } from "../../../interface/interfaces";
import { RmsEducationalSetupService } from "src/app/services/rms-educational-setup.service";

declare const $: any;
@Component({
  selector: 'app-educational-setup',
  templateUrl: './educational-setup.component.html',
  styleUrls: ['./educational-setup.component.css']
})
export class EducationalSetupComponent implements OnInit {
  // public formTitle: string = "Add Job Grade";
  public dtOptions: DataTables.Settings = {};
  @ViewChild("fileInput") fileInput: ElementRef;
  certificationForm: FormGroup;
  professionalForm: FormGroup;
  qualificationForm: FormGroup;
  qualificationGradeForm: FormGroup;
  languagesForm: FormGroup;
  fileToUpload: File;
  isEditing: boolean = false;
  public certifications: any[] = [];
  public professions: any[] = [];
  public qualifications: any[] = [];
  public qualificationGrades: any[] = [];
  public languages: any[] = [];
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
    private rmsService: RmsEducationalSetupService,
  ) {
    this.certificationForm = this.fb.group({
      certificationId: [0],
      certificationName: ["", Validators.required],
      certificationDescription: ["", Validators.required],
    });
    this.professionalForm = this.fb.group({
      professionalMembershipId: [0],
      professionalMembershipName: ["", Validators.required],
      professionalMembershipDescription: ["", Validators.required],
    });
    this.qualificationForm = this.fb.group({
      qualificationId: [0],
      qualificationName: ["", Validators.required],
      qualificationDescription: ["", Validators.required],
    });
    this.qualificationGradeForm = this.fb.group({
      qualificationGradeId: [0],
      qualificationGradeName: ["", Validators.required],
      qualificationGradeRank: ["", Validators.required],
    });
    this.languagesForm = this.fb.group({
      languageId: [0],
      languageName: ["", Validators.required],
      languageLevel: ["", Validators.required],
      languageDescription: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    // $('table').dataTable({searching: false, paging: true, info: true, bFilter: false});

    this.current_tab = 'Job Category',
    this.getAllCertifications();
    this.getAllProfessions();
    this.getAllQualificatinGrade();
    this.getAllQualification();
    this.getAllLanguages();
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

  getAllCertifications() {
    this.rmsService.getAllCertification().subscribe(
      (data) => {
        // console.log(data)
        this.certifications = data.certifications;
      },
      (err) => {}
    );
  }

  getAllProfessions() {
    this.rmsService.getAllProfessionalMembership().subscribe(
      (data) => {
        // console.log(data)
        this.professions = data.professionalMemberships;
      },
      (err) => {}
    );
  }

  getAllQualificatinGrade() {
    this.rmsService.getAllQualicicationGrade().subscribe(
      (data) => {
        // console.log(data)
        this.qualificationGrades = data.qualificationGrades;
      },
      (err) => {}
    );
  }

  getAllQualification() {
    this.rmsService.getAllQualification().subscribe(
      (data) => {
        // console.log(data)
        this.qualifications = data.qualification;
      },
      (err) => {}
    );
  }

  getAllLanguages() {
    this.rmsService.getAllLanguage().subscribe(
      (data) => {
        // console.log(data)
        this.languages = data.languages;
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
    $("#upload_job_grade").modal("show");
  }

  openModal(isEdit: boolean, data?: any) {
    this.initializeForm(this.current_tab);
    this.isEditing = isEdit;
    $("#add_job_grade").modal("show");
    this.modalData.isEditing = isEdit;
    if (isEdit == true) {
      if(this.current_tab == 'Certification') {
        this.certificationForm = this.fb.group({
          certificationId: [data?.certificationId],
          certificationName: [data?.certificationName],
          certificationDescription: [data?.certificationDescription],
        });
      } else if(this.current_tab == 'Professional Membership') {
        this.professionalForm = this.fb.group({
          professionalMembershipId: [data?.professionalMembershipId],
          professionalMembershipName: [data?.professionalMembershipName],
          professionalMembershipDescription: [data?.professionalMembershipDescription],
        });
      } else if(this.current_tab == 'Qualification') {
        this.qualificationForm = this.fb.group({
          qualificationId: [data?.qualificationId],
          qualificationName: [data?.qualificationName],
          qualificationDescription: [data?.qualificationDescription],
        });
      } else if(this.current_tab == 'Qualification Grade') {
        this.qualificationGradeForm = this.fb.group({
          qualificationGradeId: [data?.qualificationGradeId],
          qualificationGradeName: [data?.qualificationGradeName],
          qualificationGradeRank: [data?.qualificationGradeRank],
        });
      } else {
        this.languagesForm = this.fb.group({
          languageId: [data?.languageId],
          languageName: [data?.languageName],
          languageLevel: [data?.languageLevel],
          languageDescription: [data?.languageDescription],
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
      this.certifications
    );
  }

  getCurrentTab(tabName) {
    this.current_tab = tabName;
  }

  submitCertification(form: FormGroup) {

    this.rmsService.addupdateCertification(form.value).subscribe(
        data => {
          console.log(data);
          let message = data.status.message.friendlyMessage;
          swal.fire("GOS FINANCIAL", message, "success");
          if(this.isEditing) {
            const index = this.certifications.findIndex((certification: any) => {
              return certification.certificationId == form.get('certificationId').value;
            });
            this.certifications[index] = form.value;
          } else {
            this.certifications.push(data.certification);
          }
          this.certificationForm.reset();
          this.closeModal();
        },
        err => {
            let message = err.status.message.friendlyMessage;
            swal.fire("GOS FINANCIAL", message, "error");
        }
    );
  }

  submitLanguage(form: FormGroup) {

    this.rmsService.addupdateLanguage(form.value).subscribe(
        data => {
          console.log(data);
          let message = data.status.message.friendlyMessage;
          swal.fire("GOS FINANCIAL", message, "success");
          if(this.isEditing) {
            const index = this.languages.findIndex((language: any) => {
              return language.languageId == form.get('languageId').value;
            });
            this.languages[index] = form.value;
          } else {
            this.languages.push(data.language);
          }
          this.languagesForm.reset();
          this.closeModal();
        },
        err => {
            let message = err.status.message.friendlyMessage;
            swal.fire("GOS FINANCIAL", message, "error");
        }
    );
  }

  submitProfession(form: FormGroup) {

    this.rmsService.addupdateProfessionalMembership(form.value).subscribe(
        data => {
          console.log(data);
          let message = data.status.message.friendlyMessage;
          swal.fire("GOS FINANCIAL", message, "success");
          if(this.isEditing) {
            const index = this.professions.findIndex((profession: any) => {
              return profession.professionalMembershipId == form.get('professionalMembershipId').value;
            });
            this.professions[index] = form.value;
          } else {
            this.professions.push(data.professionalMembership);
          }
          this.professionalForm.reset();
          this.closeModal();
        },
        err => {
            let message = err.status.message.friendlyMessage;
            swal.fire("GOS FINANCIAL", message, "error");
        }
    );
  }

  submitQualificationGrade(form: FormGroup) {

    this.rmsService.addupdateQualicicationGrade(form.value).subscribe(
        data => {
          console.log(data);
          let message = data.status.message.friendlyMessage;
          swal.fire("GOS FINANCIAL", message, "success");
          if(this.isEditing) {
            const index = this.qualificationGrades.findIndex((qualificationGrade: any) => {
              return qualificationGrade.qualificationGradeId == form.get('qualificationGradeId').value;
            });
            this.qualificationGrades[index] = form.value;
          } else {
            this.qualificationGrades.push(data.qualificationGrade);
          }
          this.qualificationGradeForm.reset();
          this.closeModal();
        },
        err => {
            let message = err.status.message.friendlyMessage;
            swal.fire("GOS FINANCIAL", message, "error");
        }
    );
  }

  submitQualification(form: FormGroup) {

    this.rmsService.addupdateQualification(form.value).subscribe(
        data => {
          console.log(data);
          let message = data.status.message.friendlyMessage;
          swal.fire("GOS FINANCIAL", message, "success");
          if(this.isEditing) {
            const index = this.qualifications.findIndex((qualification: any) => {
              return qualification.qualificationId == form.get('qualificationId').value;
            });
            this.qualifications[index] = form.value;
          } else {
            this.qualifications.push(data.qualification);
          }
          this.qualificationForm.reset();
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
    if(this.current_tab == 'Certification') {
     operation = 'deleteCertification';
     payload = {
      certificationIds: [id]
     }
    } else if(this.current_tab == 'Qualification') {
      operation = 'deleteQualification';
      payload = {
        qualificationIds: [id]
      }
    } else if(this.current_tab == 'Qualicication Grade') {
      operation = 'deleteQualicicationGrade';
      payload = {
        qualificationGradeIds:[id]
      }
    } else if(this.current_tab == 'Professional Membership') {
      operation = 'deleteProfessionalMembership';
      payload = {
        professionalMembershipIds: [id]
      }
    } else {
      operation = 'deleteLanguage';
      payload = {
        languageIds: [id]
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
            this.getAllCertifications();
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
    if(this.current_tab == 'Certification' && tempData !== undefined) {
     operation = 'deleteCertification';
     tempData.forEach((el) => {
        let data = el.certificationId;
        payload= {
          certificationIds: [data]
        }
      });
    } else if(this.current_tab == 'Qualification' && tempData !== undefined) {
      operation = 'deleteQualification';
      tempData.forEach((el) => {
        let data = el.qualificationId;
        payload = {
          qualificationIds: [data]
        }
      });
    } else if(this.current_tab == 'Qualicication Grade' && tempData !== undefined) {
      operation = 'deleteQualicication Grade';
      tempData.forEach((el) => {
        let data = el.qualificationGradeId;
        payload = {
          qualificationGradeIds: [data]
        }
      });
    } else if(this.current_tab == 'Professional Membership' && tempData !== undefined) {
      operation = 'deleteProfessional Membership';
      tempData.forEach((el) => {
        let data = el.professionalMembershipId;
        payload = {
          professionalMembershipIds: [data]
        }
      });
    } else {
      operation = 'deleteLanguage';
      tempData.forEach((el) => {
        let data = el.languageId;
        payload = {
          languageIds: [data]
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
            this.getAllCertifications();
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
    if(this.current_tab == 'Certification') {
     operation = 'exportCertification';
    } else if(this.current_tab == 'Qualification') {
      operation = 'exportQualification';
    } else if(this.current_tab == 'Qualification Grade') {
      operation = 'exportQualicicationGrade';
    } else if(this.current_tab == 'Professional Membership') {
      operation = 'exportProfessionalMembership';
    } else {
      operation = 'exportLanguage';
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
    if(this.current_tab == 'Certification') {
     operation = 'uploadCertification';
    } else if(this.current_tab == 'Qualification') {
      operation = 'uploadQualification';
    } else if(this.current_tab == 'Qualicication Grade') {
      operation = 'uploadQualicicationGrade';
    } else if(this.current_tab == 'Professional Membership') {
      operation = 'uploadProfessionalMembership';
    } else {
      operation = 'uploadLanguage';
    }
    console.log(this.fileToUpload);
    this.loadingService.show();
    await this.rmsService[operation](this.fileToUpload)
      .then((data) => {
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.fileToUpload = null;
          // this.getAllCountry();
          this.loadingService.hide();
          this.fileInput.nativeElement.value = '';
          swal.fire('GOS FINANCIAL', message, 'success');
        } else {
          this.fileToUpload = null;
          // this.getAllCountry();
          this.loadingService.hide();
          this.fileInput.nativeElement.value = '';
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      })
      .catch((err) => {
        let error = JSON.stringify(err);
        this.loadingService.hide();
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

