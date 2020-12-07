import { Component, OnInit } from '@angular/core';
import { SetupService } from 'src/app/services/setup.service';

import swal from 'sweetalert2';

declare const $: any;
@Component({
  selector: 'app-academic-qualification',
  templateUrl: './academic-qualification.component.html',
  styleUrls: ['./academic-qualification.component.css']
})
export class AcademicQualificationComponent implements OnInit {

  formTitle: string;
  selectedId: any[] = [];

  constructor(
    private setupService: SetupService
  ) { }

  ngOnInit(): void {

  }

  addEmploymentLevel() {
    this.formTitle = "Add Academic Qualification";
    $('#add_employment_level').modal('show')
  }

  

}
