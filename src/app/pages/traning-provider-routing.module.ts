import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TraningProviderComponent } from './traning-provider.component';

const routes: Routes = [
    { path: '',
        component: TraningProviderComponent,
        children: [
            {
                path: '',
                redirectTo: 'profile',
                pathMatch: 'full',
            },
            {
              path: 'profile',
              loadChildren: () =>
                import('./personal-details/profile.module').then(
                  (m) => m.PersonalDetailsModule
                ),
            },
            {
              path: 'training-providers',
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
            {
              path: 'settings',
              loadChildren: () =>
                import('./account-settings/account-settings.module').then(
                  (m) => m.AccountSettingsModule
                ),
            },
            {
              path: 'security',
              loadChildren: () =>
                import('./security/security.module').then(
                  (m) => m.SecurityModule
                ),
            },
            {
              path: 'courses',
              loadChildren: () =>
                import('./course-creation/course-creation.module').then(
                  (m) => m.CourseCreationModule
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
