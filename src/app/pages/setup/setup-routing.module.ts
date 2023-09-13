import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndustryComponent } from './components/industry/industry.component';
import { SpecializationComponent } from './components/specialization/specialization.component';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'industry', pathMatch: 'full', },
      { path: 'industry', component:  IndustryComponent},
      { path: 'specialization', component:  SpecializationComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetupRoutingModule {}
