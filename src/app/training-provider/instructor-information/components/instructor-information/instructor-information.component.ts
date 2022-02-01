import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseComponent } from '@core/base/base/base.component';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { ResponseModel } from 'app/models/response.model';
import { Subscription } from 'rxjs';
import { Facilitator } from '../../models/instructor-information.model';
import { InstructorInformationService } from '../../services/instructor-information.service';

@Component({
  selector: 'app-instructor-information',
  templateUrl: './instructor-information.component.html',
  styleUrls: ['./instructor-information.component.scss']
})
export class InstructorInformationComponent implements OnInit {
  public sub: Subscription = new Subscription();
  public FacilitatorForm!: FormGroup;
  public instructor!: Facilitator;
  public isFetchngFacilitatorDetail: boolean = false;
  public facilitatorFormSubmitted: boolean = false;
  public loggedInUser: any;
  
  constructor(
    private _instructor: InstructorInformationService,
    private _currenService: CurrentUserService,
    private _base: BaseComponent,
    private _helper: HelperService
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this._currenService.getUser();
    this.getFacilitator();
  }

  public getFacilitator(): void {
    this._helper.startSpinner();
    this.isFetchngFacilitatorDetail = true;
    this.sub.add(
      this._instructor.getFaciltator(this.loggedInUser.trainingProviderId).subscribe({
        next: (res: any) => {
          this._helper.stopSpinner();
          this.isFetchngFacilitatorDetail = false;
          this.instructor = res['training_InstructorSetupTypes'];
          console.log(res, this.instructor)
        },
        error: (error: ResponseModel<null>) => {
          this._helper.stopSpinner();
          this.isFetchngFacilitatorDetail = false;
          console.log(error);
        },
      })
    );
  }

  public submit(): void {
    this._helper.startSpinner();
    this.facilitatorFormSubmitted = true;
    if (this.FacilitatorForm.valid) {
      const payload = this.FacilitatorForm.value;
      payload.trainingProviderId = this.loggedInUser.trainingProviderId;
      this._instructor.UpdateFaciltator(payload).subscribe({
        next: (res: ResponseModel<Facilitator>) => {
          this._helper.stopSpinner();
          console.log(res)
          
          this._base.openSnackBar(
            'Great...!!!, Your action was successful',
            'success'
          );
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
          this._helper.stopSpinner();
          this.facilitatorFormSubmitted = false;
        },
      });
    }
  }

}
