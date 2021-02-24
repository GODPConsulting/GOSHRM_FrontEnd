import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PerformanceManagementService } from 'src/app/services/performance-management.service';
import swal from 'sweetalert2'

@Component({
  selector: 'app-appraisal-preference',
  templateUrl: './appraisal-preference.component.html',
  styleUrls: ['./appraisal-preference.component.css']
})
export class AppraisalPreferenceComponent implements OnInit {
  appraisalPreferenceForm: FormGroup;
  loading:boolean;
  pageLoading:boolean;
  companies:any[] = [];
  cycles:any[] = [];
  


 

  constructor(
    private formBuilder: FormBuilder,
    private performanceManagementService:PerformanceManagementService,
 

    ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.getCompanies();
    
    
  }

  initializeForm(){
    this.appraisalPreferenceForm=this.formBuilder.group({
      id: [0],
      company: [0],
      appraisalCircle: [0],
      reviewerOneCommentVisibility: [0],
      reviewerTwoCommentVisibility: [0],
      reviewerThreeCommentVisibility: [0],
      status: [0],
      coachPerformanceVisibility: [0],
      
    })
  }

  addAppraisalPreference(appraisalPreferenceForm) {
    const payload = appraisalPreferenceForm.value;
    payload.company = +payload.company;
    payload.appraisalCircle = +payload.appraisalCircle;
    payload.reviewerOneCommentVisibility = +payload.reviewerOneCommentVisibility;
    payload.reviewerTwoCommentVisibility = +payload.reviewerTwoCommentVisibility;
    payload.reviewerThreeCommentVisibility = +payload.reviewerThreeCommentVisibility;
    payload.status = +payload.status;
    payload.coachPerformanceVisibility = +payload.coachPerformanceVisibility;
    
    this.loading = true;
    this.performanceManagementService.addAppraisalPreference(payload).subscribe(
      (data) => {
        this.loading = false;
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("Success", message, "success");
          this.initializeForm();
        } else {
          swal.fire("GOSHRM", message, "error");
        }
      },
      (err) => {
        this.loading = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );

  }

  getCompanies(){
    this.pageLoading = true;
    return this.performanceManagementService.getCompanies().
    subscribe(
    (data) => {
          this.pageLoading = false;
          this.companies= data.companyStructures;
        },
        (err) => {
          this.pageLoading = false;
        }
      );
  }
  getAppraisalCycleByCompanyId(id) {
    this.pageLoading=true;
    return this.performanceManagementService.getAppraisalCycleByCompanyId(id).subscribe(
    (data) => {
      this.pageLoading= false;
          this.cycles = data.setupList;
        },
        (err) => {
          this.pageLoading = false;
        }
      );
  }

}
