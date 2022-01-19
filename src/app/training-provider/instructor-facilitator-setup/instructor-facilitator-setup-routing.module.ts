import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstructorFacilitatorSetupComponent } from './components/instructor-facilitator-setup/instructor-facilitator-setup.component';

const routes: Routes = [{ path: '', component:  InstructorFacilitatorSetupComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InstructorFacilitatorSetupRoutingModule {}
