import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogModel } from '@shared/components/models/dialog.model';
import { ResponseModel } from 'app/models/response.model';
import { Subscription } from 'rxjs';
import { EditCompanyInfoDialogComponent } from '../../dialogs/edit-company-info-dialog/edit-company-info-dialog.component';
import { SocialMediaDialogComponent } from '../../dialogs/social-media-dialog/social-media-dialog.component';
import { UploadProfileComponent } from '../../dialogs/upload-profile/upload-profile.component';
import { WebsiteDialogComponent } from '../../dialogs/website-dialog/website-dialog.component';
import { ProfileService } from '../../services/profile.service';
import { Profile, SocialMedia, Website } from './../../models/user-profile.model'

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss']
})
export class PersonalDetailsComponent implements OnInit {
  private sub: Subscription = new Subscription();
  public isLoading: boolean = false;
  public isFetchingProfile: boolean = false;
  public isFetchingSocialMedia: boolean = false;
  public isFetchingWebsiteUrl: boolean = false;
  public profile!: Profile;
  public profileImg: string = "assets/images/profile-img.svg";
  public socialMediaInfo!: SocialMedia;
  public websites!: Website

  constructor(
    public dialog: MatDialog,
    private _profile: ProfileService
  ) { }

  ngOnInit() {
    this.getUserProfile();
    this.getSocialmedia();
    this.getWebsiteUrls();
  }

  public getUserProfile(): void {
    this.isFetchingProfile = true;
    this.sub.add(
      this._profile.getProfile('1').subscribe({
        next: (res: any) => {
          this.isFetchingProfile = false;
          this.profile = res['companySetupTypes'][0];
          // console.log(res, this.profile)
        },
        error: (error: ResponseModel<null>) => {
          this.isFetchingProfile = false;
          console.log(error);
        },
      })
    );
  }

  public getSocialmedia(): void {
    this.isFetchingSocialMedia = true;
    this.sub.add(
      this._profile.getSocialMedia('3').subscribe({
        next: (res: any) => {
          this.isFetchingSocialMedia = false;
          this.socialMediaInfo = res['socialMediaSetupTypes'][0];
          // console.log(res, this.socialMediaInfo)
        },
        error: (error: ResponseModel<null>) => {
          this.isFetchingSocialMedia = false;
          console.log(error);
        },
      })
    );
  }

  public getWebsiteUrls(): void {
    this.isFetchingWebsiteUrl = true;
    this.sub.add(
      this._profile.getWebsites('1').subscribe({
        next: (res: any) => {
          this.isFetchingProfile = false;
          this.websites = res['websiteSetupTypes'][0];
          console.log(res, this.websites)
        },
        error: (error: ResponseModel<null>) => {
          this.isFetchingWebsiteUrl = false;
          console.log(error);
        },
      })
    );
  }

  public openProfileUploadDialog(
    payload: { isEditing?: boolean; editObject?: any } | any
  ): void {
    let object: DialogModel<any> = payload;
    const dialogRef = this.dialog.open(UploadProfileComponent, {
      data: object,
    });
    dialogRef.componentInstance.event.subscribe(
      (event: DialogModel<any>) => {
          this.profileImg = event?.editObject;
      }
    );
  }

  public openEditProfileDialog(
    payload: { isEditing?: boolean; editObject?: any } | any
  ): void {
    let object: DialogModel<Profile> = payload;
    const dialogRef = this.dialog.open(EditCompanyInfoDialogComponent, {
      data: object,
    });
    console.log(payload);
    dialogRef.componentInstance.event.subscribe(
      (event: DialogModel<any>) => {
          this.profile = event?.editObject;
      }
    );
  }

  public openEditSocialMediaDialog(
    payload: { isEditing?: boolean; editObject?: any } | any
  ): void {
    let object: DialogModel<any> = payload;
    const dialogRef = this.dialog.open(SocialMediaDialogComponent, {
      data: object,
    });

    dialogRef.componentInstance.event.subscribe(
      (event: DialogModel<any>) => {
          this.socialMediaInfo = event?.editObject;
      }
    );
  }

  public openWebsiteDialog(
    payload: { isEditing?: boolean; editObject?: any } | any
  ): void {
    let object: DialogModel<any> = payload;
    const dialogRef = this.dialog.open(WebsiteDialogComponent, {
      data: object,
    });

    dialogRef.componentInstance.event.subscribe(
      (event: DialogModel<any>) => {
          this.websites = event?.editObject;
      }
    );
  }

}
