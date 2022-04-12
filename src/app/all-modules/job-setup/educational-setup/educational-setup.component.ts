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
    private setupService: SetupService,
    private utilitiesService: UtilitiesService,
    private loadingService: LoadingService,
    private rmsService: RmsEducationalSetupService,
  ) {
    this.certificationForm = this.fb.group({
      id: [0],
      certification: ["", Validators.required],
      description: ["", Validators.required],
    });
    this.professionalForm = this.fb.group({
      id: [0],
      professional_membership: ["", Validators.required],
      description: ["", Validators.required],
    });
    this.qualificationForm = this.fb.group({
      id: [0],
      qualification: ["", Validators.required],
      description: ["", Validators.required],
      rank: [0],
    });
    this.qualificationGradeForm = this.fb.group({
      id: [0],
      grade: ["", Validators.required],
      description: [""],
      rank: [0],
    });
    this.languagesForm = this.fb.group({
      id: [0],
      language: ["", Validators.required],
      excelLineNumber: ["", Validators.required],
      description: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    // $('table').dataTable({searching: false, paging: true, info: true, bFilter: false});

    this.current_tab = 'Certification',
    this.getAllCertifications();
    this.getAllProfessions();
    this.getAllQualificatinGrade();
    this.getAllQualification();
    this.getAllLanguages();
    this.initializeForm(this.current_tab);
  }

  getAllCertifications() {
    this.loadingService.show();
    return this.setupService.getProfCerts().subscribe(
      (data) => {
        console.log(data);
        this.loadingService.hide();
        this.certifications = data.setuplist;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  getAllProfessions() {
    this.loadingService.show();
    return this.setupService.getProfMems().subscribe(
      (data) => {
        console.log(data);
        this.loadingService.hide();
        this.professions = data.setuplist;
        this.dtTrigger.next();
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  getAllQualificatinGrade() {
    this.loadingService.show();
    return this.setupService.getAcademicGrade().subscribe(
      (data) => {
        this.loadingService.hide();
        this.qualificationGrades = data.setuplist;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  getAllQualification() {
     this.loadingService.show();
     return this.setupService.getAcademicQualification().subscribe(
      (data) => {
        this.loadingService.hide();
        this.qualifications = data.setuplist;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  getAllLanguages() {
    this.loadingService.show();
    return this.setupService.getLanguage().subscribe(
      (data) => {
        // this.loadingService.hide();
        console.log(data);
        this.languages = data.setuplist;
        this.dtTrigger.next();
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
    $("#upload_modal").modal("show");
  }

  openModal(isEdit: boolean, data?: any) {
    this.initializeForm(this.current_tab);
    this.isEditing = isEdit;
    $("#add_job_grade").modal("show");
    this.modalData.isEditing = isEdit;
    if (isEdit == true) {
      if(this.current_tab == 'Certification') {
        this.certificationForm = this.fb.group({
          id: [data?.id],
          certification: [data?.certification],
          description: [data?.description],
        });
      } else if(this.current_tab == 'Professional Membership') {
        this.professionalForm = this.fb.group({
          id: [data?.professionalMembershipId],
          professional_membership: [data?.professionalMembershipName],
          description: [data?.professionalMembershipDescription],
        });
      } else if(this.current_tab == 'Qualification') {
        this.qualificationForm = this.fb.group({
          id: [data?.id],
          qualification: [data?.qualification],
          description: [data?.description],
          rank: [data?.rank],
        });
      } else if(this.current_tab == 'Qualification Grade') {
        this.qualificationGradeForm = this.fb.group({
          id: [data?.id],
          grade: [data?.grade],
          description: [data?.description],
          rank: [data?.rank],
        });
      } else {
        this.languagesForm = this.fb.group({
          id: [data?.id],
          language: [data?.language],
          excelLineNumber: [data?.excelLineNumber],
          description: [data?.description],
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
    const payload = this.certificationForm.value
    this.setupService.addProfCert(payload).subscribe(
        data => {
          console.log(data);
          let message = data.status.message.friendlyMessage;
          swal.fire("GOS FINANCIAL", message, "success");
          if(this.isEditing) {
            const index = this.certifications.findIndex((certification: any) => {
              return certification.id == form.get('id').value;
            });
            this.certifications[index] = form.value;
          } else {
            this.certifications.push(payload);
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
    const payload = this.languagesForm.value;
    payload.excelLineNumber = +payload.excelLineNumber
    this.spinner = true;
    return this.setupService.addLanguage(payload).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          if(this.isEditing) {
            const index = this.certifications.findIndex((language: any) => {
              return language.id == form.get('id').value;
            });
            this.languages[index] = form.value;
          } else {
            this.languages.push(payload);
          }
          this.languagesForm.reset();
          this.closeModal();
        } else {
          swal.fire("GOSHRM", message, "error");
        }
        // this.getLanguages();
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
    // this.setupService.addLanguage(payload).subscribe(
    //     data => {
    //       console.log(data);
    //       let message = data.status.message.friendlyMessage;
    //       swal.fire("GOS FINANCIAL", message, "success");
    //       if(this.isEditing) {
    //         const index = this.languages.findIndex((language: any) => {
    //           return language.id == form.get('id').value;
    //         });
    //         this.languages[index] = form.value;
    //       } else {
    //         this.languages.push(data.language);
    //       }
    //       this.languagesForm.reset();
    //       this.closeModal();
    //     },
    //     err => {
    //         let message = err.status.message.friendlyMessage;
    //         swal.fire("GOS FINANCIAL", message, "error");
    //     }
    // );
  }

  submitProfession(form: FormGroup) {
    const payload = this.professionalForm.value;
    this.spinner = true;
    return this.setupService.addProfMem(payload).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          if(this.isEditing) {
            const index = this.certifications.findIndex((profession: any) => {
              return profession.id == form.get('id').value;
            });
            this.professions[index] = form.value;
          } else {
            this.professions.push(payload);
          }
          this.professionalForm.reset();
          this.closeModal();
        } else {
          swal.fire("GOSHRM", message, "error");
        }
        // this.getProfMembershipForm();
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
    // this.rmsService.addupdateProfessionalMembership(form.value).subscribe(
    //     data => {
    //       console.log(data);
    //       let message = data.status.message.friendlyMessage;
    //       swal.fire("GOS FINANCIAL", message, "success");
    //       if(this.isEditing) {
    //         const index = this.professions.findIndex((profession: any) => {
    //           return profession.professionalMembershipId == form.get('professionalMembershipId').value;
    //         });
    //         this.professions[index] = form.value;
    //       } else {
    //         this.professions.push(data.professionalMembership);
    //       }
    //       this.professionalForm.reset();
    //       this.closeModal();
    //     },
    //     err => {
    //         let message = err.status.message.friendlyMessage;
    //         swal.fire("GOS FINANCIAL", message, "error");
    //     }
    // );
  }

  submitQualificationGrade(form: FormGroup) {
    const payload = this.qualificationGradeForm.value;
    payload.rank = +payload.rank;
    console.log(payload);
    this.loadingService.show();
    return this.setupService.addAcademicGrade(payload).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;

        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          if(this.isEditing) {
            const index = this.certifications.findIndex((grade: any) => {
              return grade.id == form.get('id').value;
            });
            this.qualificationGrades[index] = form.value;
          } else {
            this.qualificationGrades.push(payload);
          }
          this.qualificationGradeForm.reset();
          this.closeModal();
        } else {
          swal.fire("GOSHRM", message, "error");
        }

        this.getAllQualificatinGrade();
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );

    // this.rmsService.addupdateQualicicationGrade(form.value).subscribe(
    //     data => {
    //       console.log(data);
    //       let message = data.status.message.friendlyMessage;
    //       swal.fire("GOS FINANCIAL", message, "success");
    //       if(this.isEditing) {
    //         const index = this.qualificationGrades.findIndex((qualificationGrade: any) => {
    //           return qualificationGrade.qualificationGradeId == form.get('qualificationGradeId').value;
    //         });
    //         this.qualificationGrades[index] = form.value;
    //       } else {
    //         this.qualificationGrades.push(data.qualificationGrade);
    //       }
    //       this.qualificationGradeForm.reset();
    //       this.closeModal();
    //     },
    //     err => {
    //         let message = err.status.message.friendlyMessage;
    //         swal.fire("GOS FINANCIAL", message, "error");
    //     }
    // );
  }

  submitQualification(form: FormGroup) {
    const payload = this.qualificationForm.value;
    this.spinner = true;
    return this.setupService.addAcademicQualification(payload).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          if(this.isEditing) {
            const index = this.certifications.findIndex((qualification: any) => {
              return qualification.id == form.get('id').value;
            });
            this.qualifications[index] = form.value;
          } else {
            this.qualifications.push(payload);
          }
          this.qualificationForm.reset();
          this.closeModal();
        } else {
          swal.fire("GOSHRM", message, "error");
        }
        // this.getAcademicQualifications();
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );

    // this.rmsService.addupdateQualification(form.value).subscribe(
    //     data => {
    //       console.log(data);
    //       let message = data.status.message.friendlyMessage;
    //       swal.fire("GOS FINANCIAL", message, "success");
    //       if(this.isEditing) {
    //         const index = this.qualifications.findIndex((qualification: any) => {
    //           return qualification.qualificationId == form.get('qualificationId').value;
    //         });
    //         this.qualifications[index] = form.value;
    //       } else {
    //         this.qualifications.push(data.qualification);
    //       }
    //       this.qualificationForm.reset();
    //       this.closeModal();
    //     },
    //     err => {
    //         let message = err.status.message.friendlyMessage;
    //         swal.fire("GOS FINANCIAL", message, "error");
    //     }
    // );
  }

  deleteItem(id) {
    let operation = '';
    let payload = {
      itemIds: [id],
    };
    if(this.current_tab == 'Certification') {
     operation = 'deleteProfCert';
    } else if(this.current_tab == 'Qualification') {
      operation = 'deleteAcademicQualification';
    } else if(this.current_tab == 'Qualicication Grade') {
      operation = 'deleteAcademicGrade';
    } else if(this.current_tab == 'Professional Membership') {
      operation = 'deleteProfMem';
    } else {
      operation = 'deleteLanguage';
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
        this.setupService[operation](payload).subscribe((data) => {
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
    let operation: string;
    let payload: any;
    if (this.selectDeleteitems.length === 0) {
      return swal.fire("Error", "Select items to delete", "error");
    }
    this.selectDeleteitems.map((item) => {
      this.selectedId.push(item.id);
    });
    payload = {
      itemIds: this.selectedId,
    };
    console.log(this.selectDeleteitems)
    if(this.current_tab == 'Certification') {
      operation = 'deleteProfCert';
     } else if(this.current_tab == 'Qualification') {
       operation = 'deleteAcademicQualification';
     } else if(this.current_tab == 'Qualicication Grade') {
       operation = 'deleteAcademicGrade';
     } else if(this.current_tab == 'Professional Membership') {
       operation = 'deleteProfMem';
     } else {
       operation = 'deleteLanguage';
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
        return this.setupService[operation](payload).subscribe(
          (res) => {
            // this.loadingService.hide();
            const message = res.status.message.friendlyMessage;
            if (res.status.isSuccessful) {
              this.selectDeleteitems = [];
              this.utilitiesService.showMessage(res, "success").then(() => {
                this.ngOnInit();
              });
            } else {
              return this.utilitiesService.showMessage(res, "error");
            }
          },
          (err) => {
            // this.loadingService.hide();
            this.utilitiesService.showMessage(err, "error");
          }
        );
      } else {
        swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
      }
    });
  }

  exportList() {
    let operation = '';
    if(this.current_tab == 'Certification') {
     operation = 'downloadProfCert';
    } else if(this.current_tab == 'Qualification') {
      operation = 'downloadAcademicQualification';
    } else if(this.current_tab == 'Qualification Grade') {
      operation = 'downloadAcademicGrade';
    } else if(this.current_tab == 'Professional Membership') {
      operation = 'downloadProfMem';
    } else {
      operation = 'downloadLanguage';
    }
   
    this.setupService[operation]().subscribe(
      (resp) => {
        this.utilitiesService.byteToFile(resp, `${this.current_tab}.xlsx`);
      },
      (err) => {
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
     operation = 'uploadProfCert';
    } else if(this.current_tab == 'Qualification') {
      operation = 'uploadAcademicQualification';
    } else if(this.current_tab == 'Qualicication Grade') {
      operation = 'uploadAcademicGrade';
    } else if(this.current_tab == 'Professional Membership') {
      operation = 'uploadProfMem';
    } else {
      operation = 'uploadLanguage';
    }
    const formData = new FormData();
    formData.append(
      "uploadInput",
      this.fileToUpload
    );
    this.loadingService.show();
    this.spinner = true;
    return this.setupService[operation](formData).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          this.fileToUpload = null;
          $("#upload_academic_grade").modal("hide");
        } else {
          swal.fire("GOSHRM", message, "error");
        }
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
    // await this.setupService[operation](formData)
    //   .subscribe((data) => {
    //     const message = data.status.message.friendlyMessage;
    //     if (data.status.isSuccessful) {
    //       this.fileToUpload = null;
    //       // this.getAllCountry();
    //       this.loadingService.hide();
    //       this.fileInput.nativeElement.value = '';
    //       this.fileToUpload = null
    //       swal.fire('GOS FINANCIAL', message, 'success');
    //     } else {
    //       this.fileToUpload = null;
    //       // this.getAllCountry();
    //       this.loadingService.hide();
    //       this.fileInput.nativeElement.value = '';
    //       swal.fire('GOS FINANCIAL', message, 'error');
    //     }
    //   })
    //   .catch((err) => {
    //     let error = JSON.stringify(err);
    //     this.loadingService.hide();
    //     console.log(error);
    //     // const message = error.status.message.friendlyMessage;
    //     // swal.fire('GOS FINANCIAL', message, 'error');
    //   });
  }

  // Prevents the edit modal from popping up when checkbox is clicked
  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
  }
}

