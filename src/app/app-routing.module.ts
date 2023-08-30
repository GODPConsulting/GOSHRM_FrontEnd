import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteGuard } from '@core/guards/route.guard';
import { LayoutComponent } from '@shared/components/layout/layout.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { OfflineComponent } from './offline/offline.component';
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
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./pages/personal-details/profile.module').then(
            (m) => m.PersonalDetailsModule
          ),
      },
      {
        path: 'training-providers',
        loadChildren: () =>
          import('./pages/training-providers/running-courses.module').then(
            (m) => m.RunningCoursesModule
          ),
      },
      {
        path: 'payout',
        loadChildren: () =>
          import('./pages/payout/payout.module').then(
            (m) => m.PayoutModule
          ),
      },
      {
        path: 'courses',
        loadChildren: () =>
          import('./pages/running-courses/course-creation.module').then(
            (m) => m.CourseCreationModule
          ),
      },
      {
        path: 'email-setup',
        loadChildren: () =>
          import('./pages/email-setup/course-approval.module').then(
            (m) => m.CourseApprovalModule
          ),
      },
      {
        path: 'page-setup',
        loadChildren: () =>
          import('./pages/page-setup/instructor-information.module').then(
            (m) => m.InstructorInformationModule
          ),
      },
      {
        path: 'privacy-policy',
        loadChildren: () =>
          import('./pages/privacy-policy/faq-help.module').then(
            (m) => m.FaqHelpModule
          ),
      },
      {
        path: 'admins',
        loadChildren: () =>
          import('./pages/admins/course-description.module').then(
            (m) => m.CourseDescriptionModule
          ),
      },
      {
        path: 'running-courses',
        loadChildren: () =>
          import('./pages/running-courses/course-creation.module').then(
            (m) => m.CourseCreationModule
          ),
      },
    ],
  },
  {
    path: 'offline',
    component: OfflineComponent,
  },

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
