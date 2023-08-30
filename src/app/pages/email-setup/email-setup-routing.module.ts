import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseApprovalComponent } from './components/course-approval/course-approval.component';

const routes: Routes = [
    {
        path:'',
        component: CourseApprovalComponent,
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmailSetupRoutingModule {}
