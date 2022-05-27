import { Component, OnInit } from '@angular/core';
import { WorkforcePlanModel } from '../models/workforce-plan.model';

@Component({
  selector: 'app-workforce-plan',
  templateUrl: './workforce-plan.component.html',
  styleUrls: ['./workforce-plan.component.css']
})
export class WorkforcePlanComponent implements OnInit {

  workfocePlanData: WorkforcePlanModel[] = [
    {
      dateCreated: '21 Sep, 2020',
      office: 'APOLLO Architects & Associates',
      budget: '$ 6000.00',
      completionStatus: 'Ongoing',
      approvalStatus: 'pending'
    },
    {
      dateCreated: '22 Oct, 2020',
      office: 'VTN Architects',
      budget: '$ 526.90',
      completionStatus: 'Ongoing',
      approvalStatus: 'pending'
    },
    {
      dateCreated: '24 May, 2020',
      office: 'M-Arquitectos',
      budget: '$ 57,5944.00',
      completionStatus: 'Completed',
      approvalStatus: 'pending'
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
