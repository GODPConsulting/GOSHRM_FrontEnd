import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "./guards/auth.guard";

const routes: Routes = [
  // {
  //   path: "auth",
  //   loadChildren: () => import("./auth/auth.module").then((m) => m.AuthModule),
  // },
  {
    path: "login",
    loadChildren: () =>
      import(`./login/login.module`).then((m) => m.LoginModule),
  },
  /* { path: 'sign-up', loadChildren: () => import(`./sign-up/sign-up.module`).then(m => m.SignUpModule) },
  { path: 'error', loadChildren: () => import(`./errorpages/errorpages.module`).then(m => m.ErrorpagesModule) }, */
  {
    path: "",
    loadChildren: () =>
      import(`./all-modules/all-modules.module`).then(
        (m) => m.AllModulesModule
      ),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
  },
  {
    path: "**",
    loadChildren: () =>
      import(`./login/login.module`).then((m) => m.LoginModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      relativeLinkResolution: "legacy",
      onSameUrlNavigation: "reload",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
