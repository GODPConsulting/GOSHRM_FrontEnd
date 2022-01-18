import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TraningProviderComponent } from './traning-provider.component';

const routes: Routes = [
    { path: '', 
        component: TraningProviderComponent,
        children: [
            {
              path: 'profile',
              loadChildren: () =>
                import('./personal-details/profile.module').then(
                  (m) => m.PersonalDetailsModule
                ),
            },
            {
              path: 'courses',
              loadChildren: () =>
                import('./running-courses/running-courses.module').then(
                  (m) => m.RunningCoursesModule
                ),
            },
            {
              path: 'payout',
              loadChildren: () =>
                import('./payout/payout.module').then(
                  (m) => m.PayoutModule
                ),
            },
        ],
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainingProviderRoutingModule {}
