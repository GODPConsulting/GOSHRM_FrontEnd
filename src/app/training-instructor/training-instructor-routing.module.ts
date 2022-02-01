import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrainingInstructorComponent } from './training-instructor.component';

const routes: Routes = [
    { path: '', 
        component: TrainingInstructorComponent,
        children: [
            {
                path: '',
                redirectTo: 'profile',
                pathMatch: 'full',
            },
            {
              path: 'profile',
              loadChildren: () =>
                import('./profile/profile.module').then(
                  (m) => m.ProfileModule
                ),
            },
          
        ],
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainingInstructorRoutingModule {}
