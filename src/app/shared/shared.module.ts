import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoadingComponent} from "./loading/loading.component";
import { MainLayoutComponent } from './main-layout/main-layout.component';
import {AppMenuComponent, AppSubMenuComponent} from "./app.menu.component";
import {RouterModule} from "@angular/router";
import { NgSelectModule } from '@ng-select/ng-select';
import { ImageCropperModule } from 'ngx-image-cropper';



@NgModule({
  declarations: [LoadingComponent, AppMenuComponent, AppSubMenuComponent],
  imports: [
    CommonModule,
    RouterModule,
    ImageCropperModule
    // NgSelectModule
  ],
  exports: [LoadingComponent, AppMenuComponent, AppSubMenuComponent, ImageCropperModule]
})
export class SharedModule { }
