import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import { ForgotComponent } from "./forgot/forgot.component";

const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "forgot", component: ForgotComponent },
  { path: "register", component: RegisterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginRoutingModule {}
