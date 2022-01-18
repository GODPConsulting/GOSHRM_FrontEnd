import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { AuthenticationSidebarComponent } from './components/authentication-sidebar/authentication-sidebar.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [LayoutComponent, AuthenticationSidebarComponent],
  imports: [CommonModule, MatDialogModule, AuthenticationRoutingModule],
})
export class AuthenticationModule {}
