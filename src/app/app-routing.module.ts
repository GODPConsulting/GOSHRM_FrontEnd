import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '@shared/components/layout/layout.component';
// import { NotFoundComponent } from './not-found/not-found.component';
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
    // canActivate: [RouteGuard],
    children: [
      {
        path: 'profile',
        loadChildren: () =>
          import('./personal-details/profile.module').then(
            (m) => m.PersonalDetailsModule
          ),
      },
    ],
  },
  // {
  //   path: 'offline',
  //   component: OfflineComponent,
  // },

  // {
  //   path: '**',
  //   component: NotFoundComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}