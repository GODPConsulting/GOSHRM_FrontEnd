import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot
} from '@angular/router';
import { CreatedByType } from '@core/models/creation-type.model';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { CourseCreationService } from 'app/pages/course-creation/services/course-creation.service';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommunicationService } from '../services/communication.service';

@Injectable({
  providedIn: 'root'
})
export class CommunicationResolver implements Resolve<boolean> {
  public createdBy!: number;
  public loggedInId!: number;

  constructor(
    private _communication: CommunicationService,
    private _course: CourseCreationService,
    private _current: CurrentUserService,
    private _helper: HelperService,
  ) {}
 public loggedInUser: any;
  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    this.loggedInUser = this._current.getUser()
    if(this.loggedInUser.customerTypeId == 1) {
      this.createdBy = CreatedByType.provider;
      this.loggedInId = this.loggedInUser.trainingProviderId
    }
    if(this.loggedInUser.customerTypeId == 2) {
      this.createdBy = CreatedByType.instructor;
      this.loggedInId = this.loggedInUser.trainingInstructorId
    }
    const payload = {
      id: this.loggedInId,
      type: this.createdBy
    }

    const questionCourse = this._communication.getAllCourses(payload);
    const courses = this._course.getAllCourses(payload);
    this._helper.startSpinner();
    return forkJoin([questionCourse, courses]).pipe(
      map(response => {
        this._helper.stopSpinner();
        return {
          questionCourse: response[0],
          courses: response[1],
        };
      })
    );
  }
}


