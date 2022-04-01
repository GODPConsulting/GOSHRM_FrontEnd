import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot
} from '@angular/router';
import { CreatedByType } from '@core/models/creation-type.model';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { CourseCreationService } from 'app/training-instructor/course-creation/services/course-creation.service';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProfileService } from '../services/profile.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileResolver implements Resolve<boolean> {
  profile: any;
  createdBy = CreatedByType;
  constructor(
    private _profile: ProfileService,
    private _courses: CourseCreationService,
    // private _runningCourse: RunningCoursesService,
    private _current: CurrentUserService,
    private _helper: HelperService
  ) {}
 public loggedInUser: any;
  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    this.loggedInUser = this._current.getUser()
    const payload = {
      searchParams: "",
      id: this.loggedInUser?.trainingInstructorId,
      type: this.createdBy.instructor
    }
    let trainingInstructorId = this.loggedInUser.trainingInstructorId;
    const profile = this._profile.getProfile(trainingInstructorId);
    const socialMedia = this._profile.getSocialMedia();
    const runningCourse = this._courses.getAllCourses(payload);
    this._helper.startSpinner();
    return forkJoin([profile, socialMedia, runningCourse]).pipe(
      map(response => {
        this._helper.stopSpinner();
        return {
          profile: response[0],
          socialMedia: response[1],
          runningCourse: response[2],
        };
      })
    );
  }
}
