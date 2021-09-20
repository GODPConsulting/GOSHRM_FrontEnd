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
import { SentenceCasePipe } from "../pipes/sentence-case.pipe";
import { WindowsComponent } from "./windows/windows.component";
import { PortalModule } from "@angular/cdk/portal";
import { RightNavComponent } from './right-nav/right-nav.component';
import { EventsComponent } from './events/events.component';
import {CalendarCommonModule, CalendarModule} from "angular-calendar";

@NgModule({
  declarations: [
    LoadingComponent,
    AppMenuComponent,
    AppSubMenuComponent,
    CustomDatePipe,
    SentenceCasePipe,
    WindowsComponent,
    RightNavComponent,
    EventsComponent,
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
    PortalModule,
    CalendarModule,
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
    SentenceCasePipe,
    PortalModule,
    WindowsComponent,
    RightNavComponent,
  ],
})
export class SharedModule {}
