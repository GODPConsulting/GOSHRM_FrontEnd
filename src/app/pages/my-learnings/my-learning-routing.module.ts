import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyLearningComponent } from './components/my-learning/my-learning.component';
import { MyLearningResolver } from './resolvers/my-learning.resolver';

const routes: Routes = [
  { 
    path: '', 
    component:  MyLearningComponent,
    resolve: {resolveData: MyLearningResolver}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyLearningRoutingModule {}
