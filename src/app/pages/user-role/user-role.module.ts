import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoleComponent } from './components/user-role/user-role.component';
import { SharedModule } from '@shared/shared.module';
import { UserRoleRoutingModule } from './user-role-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { UserRoleDialogComponent } from './dialogs/user-role-dialog/user-role-dialog.component';
import { TableModule } from 'primeng/table';



@NgModule({
  declarations: [
    UserRoleComponent,
    UserRoleDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UserRoleRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    TableModule
  ]
})
export class UserRoleModule { }
