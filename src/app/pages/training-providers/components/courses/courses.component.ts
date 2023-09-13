import { Component, OnInit } from '@angular/core';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { ResponseModel } from 'app/models/response.model';
import { Subscription } from 'rxjs';
import { RunningCourses } from '../../models/running-course.model';
import { RunningCoursesService } from '../../services/running-courses.service';
import { UtilityService } from '@shared/services/utility.service';
import { ActionsService } from '@shared/services/action.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BaseComponent } from '@core/base/base/base.component';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  public sub: Subscription = new Subscription();
  public actionSub: Subscription = new Subscription();
  public runningCourses: RunningCourses[] = [];
  public selectedCourses: RunningCourses[] = [];
  public isfetchingCourses: boolean = false;
  public loggedInUser: any;
  public viewHeight: string = '500px';

  constructor(
    private _runningCourses: RunningCoursesService,
    private _currentService: CurrentUserService,
    private _helper: HelperService,
    private utilitiesService: UtilityService,
    private _action: ActionsService,
    private _base: BaseComponent
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this._currentService.getUser();
    this.actionSub = this._action.downloadEvent.subscribe(() => {
      this.downloadProviders();
    });
    this.getRunningCourses();
  }

  public getRunningCourses(): void {
    this._helper.startSpinner();
    this.isfetchingCourses = true;
    this.sub.add(
      this._runningCourses.getAllTrainers(this.loggedInUser.companyId).subscribe({
        next: (res: any) => {
          console.log(res)
          this._helper.stopSpinner();
          this.isfetchingCourses = false;
          this.runningCourses = res['trainingProviderObjs'];
          console.log(res, this.runningCourses)
        },
        error: (error: ResponseModel<null>) => {
          this._helper.stopSpinner();
          this.isfetchingCourses = false;
          console.log(error);
        },
      })
    );
  }

  public downloadProviders(): void {
    this._helper.startSpinner();
    this.sub.add(
      this._runningCourses.downloadProviders().subscribe({
        next: (res: any) => {
          this._helper.stopSpinner();
          this.utilitiesService.byteToFile(res, "providers.xlsx");
        },
        error: (error: ResponseModel<null>) => {
          this._helper.stopSpinner();
          console.log(error);
        },
      })
    );
  }

  public suspendprovider(id: number): void {
    this._helper.startSpinner();
    this._runningCourses.suspendProvider(id).subscribe({
      next: (res: any) => {
        if(res == true) {
          this._helper.stopSpinner();
          // console.log(res)
          this._base.openSnackBar(
            'Great...!!!, Your action was successful',
            'success'
          );
          this.getRunningCourses();
        } else {
          this._helper.stopSpinner();
          this._helper.triggerErrorAlert(res.status?.message?.friendlyMessage)
        }
      },
      error: (error: HttpErrorResponse) => {
        this._helper.stopSpinner();
        console.log(error);
        this._base.openSnackBar(
          error.error,
          'error'
        );
        // this.error_message = error?.error?.Id[0];
      },
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.actionSub.unsubscribe();
  }

}
