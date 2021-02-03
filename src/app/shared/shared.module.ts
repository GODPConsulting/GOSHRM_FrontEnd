import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoadingComponent } from "./loading/loading.component";
import { MainLayoutComponent } from "./main-layout/main-layout.component";
import { AppMenuComponent, AppSubMenuComponent } from "./app.menu.component";
import { RouterModule } from "@angular/router";
import { NgSelectModule } from "@ng-select/ng-select";
import { ImageCropperModule } from "ngx-image-cropper";
import {RatingModule} from 'ngx-bootstrap/rating';

@NgModule({
  declarations: [LoadingComponent, AppMenuComponent, AppSubMenuComponent],
  imports: [
    CommonModule,
    RouterModule,
    ImageCropperModule,
    RatingModule
    // NgSelectModule
  ],
  exports: [
    LoadingComponent,
    AppMenuComponent,
    AppSubMenuComponent,
    ImageCropperModule,
    RatingModule
  ],
})
export class SharedModule {}
