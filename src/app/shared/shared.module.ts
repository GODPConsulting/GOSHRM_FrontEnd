import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoadingComponent} from "./loading/loading.component";
import { MainLayoutComponent } from './main-layout/main-layout.component';
import {AppMenuComponent, AppSubMenuComponent} from "./app.menu.component";
import {RouterModule} from "@angular/router";



@NgModule({
  declarations: [LoadingComponent, AppMenuComponent, AppSubMenuComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [LoadingComponent, AppMenuComponent, AppSubMenuComponent]
})
export class SharedModule { }
