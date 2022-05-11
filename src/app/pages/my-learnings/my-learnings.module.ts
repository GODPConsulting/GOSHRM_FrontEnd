import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyLearningComponent } from './components/my-learning/my-learning.component';
import { SharedModule } from '@shared/shared.module';
import { MyLearningRoutingModule } from './my-learning-routing.module';
import { NgRatingBarModule } from 'ng-rating-bar';


@NgModule({
  declarations: [MyLearningComponent],
  imports: [
    CommonModule,
    SharedModule,
    MyLearningRoutingModule,
    NgRatingBarModule,
  ]
})
export class MyLearningsModule { }
