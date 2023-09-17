import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingButtonComponent } from './components/loading-button/loading-button.component';
import { LoaderComponent } from './components/loader/loader.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { DocstreamSkeletonLoaderComponent } from './components/docstream-skeleton-loader/docstream-skeleton-loader.component';
import { ErrorComponent } from './components/error/error.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NoDataComponent } from './components/no-data/no-data.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { LayoutComponent } from './components/layout/layout.component';
import { CardComponent } from './components/card/card.component';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { InfoComponent } from './components/info/info.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { BackButtonComponent } from './components/back-button/back-button.component';
import { UploadDocComponent } from './components/upload-doc/upload-doc.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { FormsModule } from '@angular/forms';
import { RbacAllowDirective } from './directives/rbac-allow.directive';
import { UploadExcelDialogComponent } from './dialogs/upload-excel-dialog/upload-excel-dialog.component';

@NgModule({
  declarations: [
    LoadingButtonComponent,
    LoaderComponent,
    SidebarComponent,
    NavbarComponent,
    LayoutComponent,
    ErrorComponent,
    DocstreamSkeletonLoaderComponent,
    NoDataComponent,
    ConfirmationModalComponent,
    CardComponent,
    SearchbarComponent,
    InfoComponent,
    BackButtonComponent,
    UploadDocComponent,
    RbacAllowDirective,
    UploadExcelDialogComponent,
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    RouterModule,
    NgxSkeletonLoaderModule,
    MatDialogModule,
    NgSelectModule,
    AngularEditorModule,
    FormsModule
  ],
  exports: [
    LoadingButtonComponent,
    LoaderComponent,
    SidebarComponent,
    NavbarComponent,
    LayoutComponent,
    ErrorComponent,
    DocstreamSkeletonLoaderComponent,
    NgxSkeletonLoaderModule,
    NoDataComponent,
    ConfirmationModalComponent,
    CardComponent,
    SearchbarComponent,
    InfoComponent,
    NgSelectModule,
    BackButtonComponent,
    UploadDocComponent,
    RbacAllowDirective,
    UploadExcelDialogComponent
  ],
})
export class SharedModule {}
