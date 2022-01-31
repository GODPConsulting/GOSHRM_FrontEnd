import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { PersonalDetailsComponent } from './components/persoanl-details/personal-details.component';
import { PersonalDetailsRoutingModule } from './profile-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { EditCompanyInfoDialogComponent } from './dialogs/edit-company-info-dialog/edit-company-info-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';
import { UploadProfileComponent } from './dialogs/upload-profile/upload-profile.component';
import { SocialMediaDialogComponent } from './dialogs/social-media-dialog/social-media-dialog.component';
import { NgRatingBarModule } from 'ng-rating-bar';

@NgModule({
  declarations: [
    PersonalDetailsComponent, 
    EditCompanyInfoDialogComponent, 
    UploadProfileComponent, 
    SocialMediaDialogComponent
  ],
  imports: [
    CommonModule,
    PersonalDetailsRoutingModule,
    MatDialogModule,
    ReactiveFormsModule,
    ImageCropperModule,
    SharedModule,
    NgRatingBarModule
  ],
})
export class PersonalDetailsModule {}
