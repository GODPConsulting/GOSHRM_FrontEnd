import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot
} from '@angular/router';
import { HelperService } from '@core/services/healper.service';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartWhilst } from '../models/learning.model';
import { MyLearningService } from '../services/my-learning.service';

@Injectable({
  providedIn: 'root'
})
export class MyLearningResolver implements Resolve<boolean> {
  constructor(
    private _helper: HelperService,
    private _myLearning: MyLearningService
  ) {}
 public loggedInUser: any;
  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    const myLearningCourses = this._myLearning.getMyLearningCourses();
    const carts = this._myLearning.getCartAndWhilst(CartWhilst.cart);
    const whilst = this._myLearning.getCartAndWhilst(CartWhilst.whilst);
    this._helper.startSpinner();
    return forkJoin([myLearningCourses, carts, whilst]).pipe(
      map(response => {
        this._helper.stopSpinner();
        return {
          myLearningCourses: response[0],
          carts: response[1],
          whilst: response[2],
        };
      })
    );
  }
}

