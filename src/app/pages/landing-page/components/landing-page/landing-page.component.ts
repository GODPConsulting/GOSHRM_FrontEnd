import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { ResponseModel } from 'app/models/response.model';
// import { Courses } from 'app/pages/course-creation/models/course-creation.model';
import { Subscription } from 'rxjs';
import { LandingPageService } from '../../services/landing-page.service';
import { SwalConfig } from '../../../../_config/sweetalert';

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
    const operation = course.isCart ? 'removeCartAndWhilst' : 'addCartAndWhilst'
    this.sub.add(
      this._landing[operation](payload).subscribe({
        next: (res: any) => {
          this.isfetchingCourses = false;
          SwalConfig.fire({
            cancelButtonText: 'No, Add more',
            confirmButtonText: 'Proceed To Cart',
            html:`<p class="alert alert-success">
                      <span class="pe-3">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M22 11.0799V11.9999C21.9988 14.1563 21.3005 16.2545 20.0093 17.9817C18.7182 19.7088 16.9033 20.9723 14.8354 21.5838C12.7674 22.1952 10.5573 22.1218 8.53447 21.3744C6.51168 20.6271 4.78465 19.246 3.61096 17.4369C2.43727 15.6279 1.87979 13.4879 2.02168 11.3362C2.16356 9.18443 2.99721 7.13619 4.39828 5.49694C5.79935 3.85768 7.69279 2.71525 9.79619 2.24001C11.8996 1.76477 14.1003 1.9822 16.07 2.85986" stroke="#219653" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                              <path d="M22 4L12 14.01L9 11.01" stroke="#219653" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>                        
                      </span>
                      <span>Course added to cart successfully!</span> 
                  </p>`,
          }).then((result: any) => { 
            if (result.value) {
              this.router.navigate(['/my-learning'], { queryParams: { q: 'carts' } })
            }
          });
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
    const operation = course.isWishlist ? 'removeCartAndWhilst' : 'addCartAndWhilst'
    this.sub.add(
      this._landing[operation](payload).subscribe({
        next: (res: any) => {
          this.isfetchingCourses = false;
          SwalConfig.fire({
            cancelButtonText: 'No, Add more',
            confirmButtonText: 'Proceed To whilst',
            html:`<p class="alert alert-success">
                      <span class="pe-3">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M22 11.0799V11.9999C21.9988 14.1563 21.3005 16.2545 20.0093 17.9817C18.7182 19.7088 16.9033 20.9723 14.8354 21.5838C12.7674 22.1952 10.5573 22.1218 8.53447 21.3744C6.51168 20.6271 4.78465 19.246 3.61096 17.4369C2.43727 15.6279 1.87979 13.4879 2.02168 11.3362C2.16356 9.18443 2.99721 7.13619 4.39828 5.49694C5.79935 3.85768 7.69279 2.71525 9.79619 2.24001C11.8996 1.76477 14.1003 1.9822 16.07 2.85986" stroke="#219653" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                              <path d="M22 4L12 14.01L9 11.01" stroke="#219653" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>                        
                      </span>
                      <span>Course added to whilst successfully!</span> 
                  </p>`,
          }).then((result: any) => { 
            if (result.value) {
              this.router.navigate(['/my-learning'], { queryParams: { q: 'wihlist' } })
            }
          })
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

