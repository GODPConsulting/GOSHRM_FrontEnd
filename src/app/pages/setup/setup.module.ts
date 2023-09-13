import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndustryComponent } from './components/industry/industry.component';
import { SpecializationComponent } from './components/specialization/specialization.component';
import { SpecializationDialogComponent } from './dialogs/specialization-dialog/specialization-dialog.component';
import { IndustryDialogComponent } from './dialogs/industry-dialog/industry-dialog.component';
import { SharedModule } from '@shared/shared.module';
import { TableModule } from 'primeng/table';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SetupRoutingModule } from './setup-routing.module';
import { LayoutComponent } from './layout/layout.component';



@NgModule({
  declarations: [
    IndustryComponent,
    SpecializationComponent,
    SpecializationDialogComponent,
    IndustryDialogComponent,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    SetupRoutingModule,
    SharedModule,
    TableModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SetupModule { }
