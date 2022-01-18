import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { PersonalDetailsComponent } from './components/persoanl-details/personal-details.component';
import { PersonalDetailsRoutingModule } from './profile-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { UploadImageDialogComponent } from './dialogs/change-password-dialog/upload-image-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  declarations: [PersonalDetailsComponent, UploadImageDialogComponent],
  imports: [
    CommonModule,
    PersonalDetailsRoutingModule,
    MatDialogModule,
    ReactiveFormsModule,
    ImageCropperModule,
    SharedModule
  ],
})
export class PersonalDetailsModule {}
