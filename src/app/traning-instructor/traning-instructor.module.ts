import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TraningInstructorComponent } from './traning-instructor.component';
import { TrainingProviderRoutingModule } from 'app/training-provider/traning-provider-routing.module';



@NgModule({
  declarations: [
    TraningInstructorComponent
  ],
  imports: [
    CommonModule,
    TrainingProviderRoutingModule
  ]
})
export class TraningInstructorModule { }
