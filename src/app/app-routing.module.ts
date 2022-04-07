import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteGuard } from '@core/guards/route.guard';
import { FAQComponent } from '@shared/components/faq/faq.component';
import { LayoutComponent } from '@shared/components/layout/layout.component';
import { NotFoundComponent } from './not-found/not-found.component';
// import { OfflineComponent } from './offline/offline.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'authentication',
    pathMatch: 'full',
  },
  {
    path: 'authentication',
    loadChildren: () =>
      import('./authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [RouteGuard],
    children: [
      {
          path: '',
          redirectTo: 'profile',
          pathMatch: 'full',
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./training-provider/personal-details/profile.module').then(
            (m) => m.PersonalDetailsModule
          ),
      },
      {
        path: 'running-courses',
        loadChildren: () =>
          import('./training-provider/running-courses/running-courses.module').then(
            (m) => m.RunningCoursesModule
          ),
      },
      {
        path: 'payout',
        loadChildren: () =>
          import('./training-provider/payout/payout.module').then(
            (m) => m.PayoutModule
          ),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./training-provider/account-settings/account-settings.module').then(
            (m) => m.AccountSettingsModule
          ),
      },
      {
        path: 'security',
        loadChildren: () =>
          import('./training-provider/security/security.module').then(
            (m) => m.SecurityModule
          ),
      },
      {
        path: 'setup',
        loadChildren: () =>
          import('./training-provider/instructor-facilitator-setup/instructor-facilitator-setup.module').then(
            (m) => m.InstructorFacilitatorSetupModule
          ),
      },
      {
        path: 'instructor-information/:instructorId',
        loadChildren: () =>
          import('./training-provider/instructor-information/instructor-information.module').then(
            (m) => m.InstructorInformationModule
          ),
      },
      {
        path: 'course-creation',
        loadChildren: () =>
          import('./training-provider/course-creation/course-creation.module').then(
            (m) => m.CourseCreationModule
          ),
      },
      {
        path: 'communication',
        loadChildren: () =>
          import('./training-provider/communication/communication.module').then(
            (m) => m.CommunicationModule
          ),
      },
      {
        path: 'instructor-community',
        loadChildren: () =>
          import('./training-provider/instructor-community/instructor-community.module').then(
            (m) => m.InstructorCommunityModule
          ),
      },
      {
        path: 'course-approval',
        loadChildren: () =>
          import('./training-provider/course-approval/course-approval.module').then(
            (m) => m.CourseApprovalModule
          ),
      },
      {
        path: 'faq',
        component: FAQComponent
      }
    ],
  },
  // {
  //   path: 'offline',
  //   component: OfflineComponent,
  // },

  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}