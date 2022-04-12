import swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';
import { StateService } from 'src/app/services/state.service';
import { CountriesService } from 'src/app/services/countries.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.css']
})
export class StateComponent implements OnInit {
  form: FormGroup;
  formTitle: string = 'Add State Information';
  countryList: any[];
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private stateService: StateService,
    private countryService: CountriesService,
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService
  ) {
    this.form = this.fb.group({
      stateId: [0],
      code: ['', Validators.required],
      name: ['', Validators.required],
      countryId: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      let stateId = params['editstate'];
      if (stateId != null || stateId != undefined) {
        this.editState(stateId);
      }
    });
    this.getAllCountry();
  }

  getAllCountry() {
    this.commonService.getAllCountry().subscribe(
      (data) => {
        this.countryList = data.commonLookups;
      },
      (err) => {}
    );
  }

  editState(stateId) {
    this.formTitle = 'Edit State Information';

    this.commonService.getState(stateId).subscribe((data) => {
      let row = data.commonLookups[0];
      this.form = this.fb.group({
        stateId: row.lookupId,
        code: row.code,
        name: row.lookupName,
        countryId: row.parentId,
      });
    });
  }

  goBack() {
    this.router.navigate(['/setup/state-list']);
  }
  submitStateInfo(formObj) {
    const payload = formObj.value;
    payload.countryId = parseInt(payload.countryId);

    this.commonService.updateState(payload).subscribe(
      (data) => {
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire('GOS FINANCIAL', message, 'success');
          this.router.navigate(['/setup/state-list']);
        } else {
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      },
      (err) => {
        const message = err.status.message.friendlyMessage;
        swal.fire('GOS FINANCIAL', message, 'error');
      }
    );
  }
}
