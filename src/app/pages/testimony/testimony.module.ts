import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestimonyComponent } from './components/testimony/testimony.component';
import { SharedModule } from '@shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { AddTestimonyDialogComponent } from './dialogs/add-testimony-dialog/add-testimony-dialog.component';
import { TableModule } from 'primeng/table';
import { TestimonyeRoutingModule } from './testimony-routing.module';



@NgModule({
  declarations: [
    TestimonyComponent,
    AddTestimonyDialogComponent
  ],
  imports: [
    CommonModule,
    TestimonyeRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    TableModule
  ]
})
export class TestimonyModule { }
