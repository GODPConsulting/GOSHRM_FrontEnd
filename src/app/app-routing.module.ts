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
            (m) => m.TrainingProvidersModule
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
          import('./pages/running-courses/running-courses.module').then(
            (m) => m.RunningCoursesModule
          ),
      },
      {
        path: 'email-setup',
        loadChildren: () =>
          import('./pages/email-setup/email-setup.module').then(
            (m) => m.EmailSetupModule
          ),
      },
      {
        path: 'page-setup',
        loadChildren: () =>
          import('./pages/page-setup/page-setup.module').then(
            (m) => m.PageSetupModule
          ),
      },
      {
        path: 'setup',
        loadChildren: () =>
          import('./pages/setup/setup.module').then(
            (m) => m.SetupModule
          ),
      },
      {
        path: 'user-role',
        loadChildren: () =>
          import('./pages/user-role/user-role.module').then(
            (m) => m.UserRoleModule
          ),
      },
      {
        path: 'user-activities',
        loadChildren: () =>
          import('./pages/user-activities/user-activities.module').then(
            (m) => m.UserActivitiesModule
          ),
      },
      {
        path: 'privacy-policy',
        loadChildren: () =>
          import('./pages/privacy-policy/privacy-policy.module').then(
            (m) => m.PrivacyPolicyModule
          ),
      },
      {
        path: 'admins',
        loadChildren: () =>
          import('./pages/admins/admins.module').then(
            (m) => m.AdminsModule
          ),
      },
      {
        path: 'running-courses',
        loadChildren: () =>
          import('./pages/running-courses/running-courses.module').then(
            (m) => m.RunningCoursesModule
          ),
      },
      {
        path: 'testimony',
        loadChildren: () =>
          import('./pages/testimony/testimony.module').then(
            (m) => m.TestimonyModule
          ),
      },
      {
        path: 'payment-setup',
        loadChildren: () =>
          import('./pages/payment/payment.module').then(
            (m) => m.PaymentModule
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
