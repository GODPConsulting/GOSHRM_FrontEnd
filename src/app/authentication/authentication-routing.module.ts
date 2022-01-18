import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        loadChildren: () =>
          import('../authentication/components/login/login.module').then(
            (m) => m.LoginModule
          ),
      },
      {
        path: 'register',
        loadChildren: () =>
          import('../authentication/components/registration/registration.module').then(
            (m) => m.RegistrationModule
          ),
      },
      {
        path: 'forgot-password',
        loadChildren: () =>
          import('../authentication/components/forgot-password/forgot-password.module').then(
            (m) => m.ForgotPasswordModule
          ),
      },
      {
        path: 'reset-password',
        loadChildren: () =>
          import('../authentication/components/reset-password/reset-password.module').then(
            (m) => m.ResetPasswordModule
          ),
      },
      {
        path: 'confirmation',
        loadChildren: () =>
          import('../authentication/components/confirmation/confirmation.module').then(
            (m) => m.ConfirmationModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule {}
