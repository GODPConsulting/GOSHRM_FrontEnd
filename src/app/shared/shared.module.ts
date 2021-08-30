import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoadingComponent } from "./loading/loading.component";
import { MainLayoutComponent } from "./main-layout/main-layout.component";
import { AppMenuComponent, AppSubMenuComponent } from "./app.menu.component";
import { RouterModule } from "@angular/router";
import { ImageCropperModule } from "ngx-image-cropper";
import { RatingModule } from "ngx-bootstrap/rating";
import { TableModule } from "primeng/table";
import { TreeTableModule } from "primeng/treetable";
import { CustomDatePipe } from "../pipes/custom-date.pipe";
import { ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { TabPanel, TabViewModule } from "primeng/tabview";
import { TooltipModule } from "primeng/tooltip";

@NgModule({
  declarations: [
    LoadingComponent,
    AppMenuComponent,
    AppSubMenuComponent,
    CustomDatePipe,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ImageCropperModule,
    RatingModule,
    TableModule,
    TreeTableModule,
    ReactiveFormsModule,
    NgSelectModule,
    CKEditorModule,
    TabViewModule,
    TooltipModule,
  ],
  exports: [
    LoadingComponent,
    AppMenuComponent,
    AppSubMenuComponent,
    ImageCropperModule,
    RatingModule,
    TableModule,
    TreeTableModule,
    CustomDatePipe,
    NgSelectModule,
    CKEditorModule,
    TabPanel,
    TabViewModule,
    TooltipModule,
  ],
})
export class SharedModule {}
