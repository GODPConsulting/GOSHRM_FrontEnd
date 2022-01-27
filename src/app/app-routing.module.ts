import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteGuard } from '@core/guards/route.guard';
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
    canActivate: [RouteGuard],
    children: [
      {
        path: 'training-provider',
        loadChildren: () =>
          import('./training-provider/traning-provider.module').then(
            (m) => m.TraningProviderModule
          ),
      },
      {
        path: 'training-instructor',
        loadChildren: () =>
          import('./traning-instructor/traning-instructor.module').then(
            (m) => m.TraningInstructorModule
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