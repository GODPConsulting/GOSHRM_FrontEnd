import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HelperService } from '@core/services/healper.service';
import { ResponseModel } from 'app/models/response.model';
import { LandingPageService } from 'app/pages/landing-page/services/landing-page.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-my-learning',
  templateUrl: './my-learning.component.html',
  styleUrls: ['./my-learning.component.scss']
})
export class MyLearningComponent implements OnInit {
  public sub: Subscription = new Subscription();
  public courses: any[] = [];
  public myLearnings: any[] = [];
  public carts: any[] = [];
  public whilst: any[] = [];
  public current_Tab: string = 'learning';
  public isLearning: boolean = true;
  public banner: string = 'learning-bg';
  
  constructor(
    public _helper: HelperService,
    private activateRoute: ActivatedRoute,
    private _landing: LandingPageService,
    private router: Router,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this._route.queryParams.subscribe(params => {
      const route = params.q;
      console.log(route)
      if(route != undefined) {
        this.current_Tab = route;
      }
    });
    this.getResolvedData();
  }

  getResolvedData() {
    this.sub.add(
      this.activateRoute.data.subscribe((data: any) => {
        console.log(data);
        this.myLearnings = data?.resolveData?.myLearningCourses?.participantMyLearning;
        this.carts = data?.resolveData?.carts?.participantCourseResponse;
        this.whilst = data?.resolveData?.whilst?.participantCourseResponse;
        this.courses = this.myLearnings;
      })
    );
  }

  public getLearning() {
    this.current_Tab = 'learning';
    this.isLearning = true;
    this.banner = 'learning-bg';
    this.courses = this.myLearnings;
  }

  public getWishlist() {
    this.current_Tab = 'wihlist';
    this.banner = 'learning-bg';
    this.courses = this.whilst;
  }

  public getCarts() {
    this.current_Tab = 'carts';
    this.banner = 'learning-bg';
    this.courses = this.carts;
  }

  public getApprovedCourses() {
    this.current_Tab = 'approved';
    this.isLearning = false;
    this.banner = 'approve-bg';
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
          this._helper.triggerSucessAlert('Course added to cart successfully!')
        },
        error: (error: ResponseModel<null>) => {
          this._helper.stopSpinner();
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
          this._helper.triggerSucessAlert('Course added to whilst successfully!');
        },
        error: (error: ResponseModel<null>) => {
          this._helper.stopSpinner();
          this._helper.triggerErrorAlert('An error occured!');
          console.log(error);
        },
      })
    );
  }

}
