import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { PerformanceManagementService } from 'src/app/services/performance-management.service';


declare const $: any;

@Component({
  selector: 'app-appraisal-objectives',
  templateUrl: './appraisal-objectives.component.html',
  styleUrls: ['./appraisal-objectives.component.css']
})
export class AppraisalObjectivesComponent implements OnInit {
  appraisalObjectives: FormGroup;
  objectives: any[] = [];
  selectedId: number[] = [];
  staffId: any;
  user: any;
  targetDate: any[] =[];
  kpiWeight: any;
  
  constructor(
    private formbuilder:FormBuilder,
    private performanceManagementService:PerformanceManagementService,
    private router:Router,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user'));
    this.staffId = user.staffId;
    console.log(this.staffId);
    this.initializeForm();
    this.getAppraisalObjectives(this.staffId);
    this.getTargetDate();
    
  }
  initializeForm() {
    this.appraisalObjectives = this.formbuilder.group({
      id: [0],
      kpIsNameList:[""],
      endDate:[""],
      weight: [0]
 
    })
  }

  getAppraisalObjectives(id){
    return this.performanceManagementService.getAppraisalObjectives(id).subscribe(
      (data) => {
        this.objectives = data.empNotPermitedList[0].kpIsNameList;
        this.kpiWeight = data.empNotPermitedList[0].weight
      },
      (err) => {}
    )
  }
  getTargetDate(){
    return this.performanceManagementService.getAppraisalCycleByStatus().subscribe(
      (data) => {
        this.targetDate = data.setupList[0].endDate;
      },
      (err) => { }
    );
  }

  closeAppraisalObjectivesModal() {
    $("#appraisal_Objectives_modal").modal("hide");
  }


}
