import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogModel } from '@shared/components/models/dialog.model';
import { ResponseModel } from 'app/models/response.model';
import { Profile } from 'app/personal-details/models/user-profile.model';
import { ProfileService } from 'app/personal-details/services/profile.service';
import { Subscription } from 'rxjs';
import { UploadImageDialogComponent } from '../../dialogs/change-password-dialog/upload-image-dialog.component';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss']
})
export class PersonalDetailsComponent implements OnInit {
  private sub: Subscription = new Subscription();
  public isLoading: boolean = false;
  public isFetchingProfile: boolean = false;
  public updateProfileForm!: FormGroup;
  public profile!: Profile;
  public profileImg: string = "assets/images/profile-img.svg";

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private _profile: ProfileService
  ) { }

  ngOnInit() {
    this.initUpdateProfileForm();
  }

  initUpdateProfileForm() {
    this.updateProfileForm = this.fb.group({
        firstName: [this.profile?.firstName ? this.profile?.firstName  : '' ],
        middleName: [this.profile?.middleName ? this.profile?.middleName  : ''],
        lastName: [this.profile?.lastName ? this.profile?.lastName  : ''],
        phoneNumber1: [this.profile?.phoneNumber1 ? this.profile?.phoneNumber1  : ''],
        phoneNumber2: [this.profile?.phoneNumber2 ? this.profile?.phoneNumber2  : ''],
        email: [this.profile?.email ? this.profile?.email  : ''],
        altEmail: [this.profile?.altEmail ? this.profile?.altEmail  : ''],
        organizationName: [this.profile?.organizationName ? this.profile?.organizationName  : '']
    })
  }

  public getUserProfile(): void {
    this.isFetchingProfile = true;
    this.sub.add(
      this._profile.getProfile(this.profile).subscribe({
        next: (res: any) => {
          this.isFetchingProfile = false;
          this.profile = res?.response;
        },
        error: (error: ResponseModel<null>) => {
          this.isFetchingProfile = false;
          console.log(error);
        },
      })
    );
  }

  public openModal(): void {
    const dialogConfig = new MatDialogConfig();
    // dialogConfig.height = '500px';
    // dialogConfig.width = '600px';
    const dialogRef = this.dialog.open(
      UploadImageDialogComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe((result) => {

    });
  }

  public openDialog(
    payload: { isEditing?: boolean; editObject?: any } | any
  ): void {
    let object: DialogModel<any> = payload;
    const dialogRef = this.dialog.open(UploadImageDialogComponent, {
      data: object,
    });

    dialogRef.componentInstance.event.subscribe(
      (event: DialogModel<any>) => {
          this.profileImg = event?.editObject;
      }
    );
 }



  public submit() {
    this.isLoading = true;
  }

}
