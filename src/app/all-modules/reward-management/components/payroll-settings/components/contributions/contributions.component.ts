import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContributionsModel, sortByJobGradeModel } from 'src/app/all-modules/reward-management/model/payroll.model';
declare const $: any;

@Component({
  selector: 'app-contributions',
  templateUrl: './contributions.component.html',
  styleUrls: ['./contributions.component.css']
})
export class ContributionsComponent implements OnInit {

  contributionData: ContributionsModel[] = [
    {
      employeeID: 'A0B1C059',
      name: 'Ramazan Yenici',
      unitDept: 'Finance',
      location: 'Kent, Utah',
      contribution: '$100.00'
    },
    {
      employeeID: 'A0B1C065',
      name: 'Abdulkerim Dur',
      unitDept: 'Design',
      location: 'Syracuse, Connecticut',
      contribution: '$260.00'
    },
    {
      employeeID: 'A0B1C014',
      name: 'Imdat Cimsit',
      unitDept: 'Product Management',
      location: 'Portland, Illinois',
      contribution: '$70.00'
    }
  ]
  sortByJobGradeData: sortByJobGradeModel[] = [
    {
    jobGrade: 'JG1',
    employer: 10,
    employee: 15
    },
    {
    jobGrade: 'JG2',
    employer: 10,
    employee: 15
    },
    {
    jobGrade: 'JG3',
    employer: 10,
    employee: 15
    }
  ]
  
  sortBy!: string;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.sortBy = params.sortBy;
    })
  }

  changeFilter(query: string){
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {sortBy: query}
    })
  }

  openModal(id: string) {
    $(id).modal("show");
  }

  closeModal(id: string) {
    $(id).modal("hide");
  }

}
