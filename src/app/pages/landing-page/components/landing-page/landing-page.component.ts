import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { ResponseModel } from 'app/models/response.model';
// import { Courses } from 'app/pages/course-creation/models/course-creation.model';
import { Subscription } from 'rxjs';
import { LandingPageService } from '../../services/landing-page.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  public sub: Subscription = new Subscription();
  public isfetchingCourses: boolean = false;
  public runningCourses: any[] = [];
  public loggedInUser: any;

  constructor(
    private _helper: HelperService,
    private _runningCourses: LandingPageService,
    private _landing: LandingPageService,
    private _current: CurrentUserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this._current.getUser();
    this.getRunningCourses();
  }

  public getRunningCourses(): void {
    this._helper.startSpinner();
    this.isfetchingCourses = true;
    this.sub.add(
      this._runningCourses.getParticipantCourses().subscribe({
        next: (res: any) => {
          console.log(res)
          this._helper.stopSpinner();
          this.isfetchingCourses = false;
          this.runningCourses = res['participantCourseResponse'];
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

  goToCourseDetails(courseId: number) {
    this.router.navigate([`/courses/course-description/${courseId}`])
  }

  addToCart(course: any) {
    const payload = {
      courseId: course.courseId,
      type: 1,
      cartId: course.cartId ? course.cartId : 0
    }
    this.sub.add(
      this._landing.addCartAndWhilst(payload).subscribe({
        next: (res: any) => {
          this.isfetchingCourses = false;
          this._helper.triggerSucessAlert('Course added to cart successfully!')
        },
        error: (error: ResponseModel<null>) => {
          this._helper.stopSpinner();
          this.isfetchingCourses = false;
          this._helper.triggerErrorAlert('An error occured!')
          console.log(error);
        },
      })
    );
  }

  addToWhilst(course: any) {
    const payload = {
      courseId: course.courseId,
      type: 2,
      cartId: course.cartId ? course.cartId : 0
    }
    this.sub.add(
      this._landing.addCartAndWhilst(payload).subscribe({
        next: (res: any) => {
          this.isfetchingCourses = false;
          this._helper.triggerSucessAlert('Course added to whilst successfully!');
        },
        error: (error: ResponseModel<null>) => {
          this._helper.stopSpinner();
          this.isfetchingCourses = false;
          this._helper.triggerErrorAlert('An error occured!');
          console.log(error);
        },
      })
    );
  }

}
