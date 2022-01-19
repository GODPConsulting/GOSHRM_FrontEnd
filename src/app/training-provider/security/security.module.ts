import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurityComponent } from './components/security/security.component';
import { securityRoutingModule } from './security-routing.module';



@NgModule({
  declarations: [
    SecurityComponent
  ],
  imports: [
    CommonModule,
    securityRoutingModule
  ]
})
export class SecurityModule { }
