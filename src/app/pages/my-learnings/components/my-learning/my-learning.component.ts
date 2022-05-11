import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HelperService } from '@core/services/healper.service';
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
    private activateRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
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
    this.current_Tab = 'wishlist';
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

}
