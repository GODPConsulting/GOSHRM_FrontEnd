import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestimonyComponent } from './components/testimony/testimony.component';

const routes: Routes = [
  // { path: '', redirectTo: '', pathMatch: 'full', },
  { path: '', component:  TestimonyComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestimonyeRoutingModule {}
