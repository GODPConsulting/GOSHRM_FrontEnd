import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginRoutingModule } from "./login-routing.module";

import { RegisterComponent } from "./register/register.component";
import { ReactiveFormsModule } from "@angular/forms";
import { AuthService } from "../services/auth.service";
import { LoginComponent } from "./login/login.component";
import { ForgotComponent } from "./forgot/forgot.component";

@NgModule({
  declarations: [LoginComponent, ForgotComponent, RegisterComponent],
  imports: [CommonModule, LoginRoutingModule, ReactiveFormsModule],
  providers: [AuthService],
})
export class LoginModule {}
