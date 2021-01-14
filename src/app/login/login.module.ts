import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./login/login.component";
import { LoginRoutingModule } from "./login-routing.module";
import { ForgotComponent } from "./forgot/forgot.component";
import { RegisterComponent } from "./register/register.component";
import { ReactiveFormsModule } from "@angular/forms";
import { AuthService } from "../services/auth.service";

@NgModule({
  declarations: [LoginComponent, ForgotComponent, RegisterComponent],
  imports: [CommonModule, LoginRoutingModule, ReactiveFormsModule],
  providers: [AuthService],
})
export class LoginModule {}
