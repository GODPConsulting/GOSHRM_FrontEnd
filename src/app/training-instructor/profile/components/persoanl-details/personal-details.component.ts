import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CurrentUserService } from '@core/services/current-user.service';
import { DialogModel } from '@shared/components/models/dialog.model';
// import { ResponseModel } from 'app/models/response.model';
import { Payout } from 'app/training-provider/payout/models/payout.model';
// import { PayoutService } from 'app/training-provider/payout/services/payout.service';
import { RunningCourses } from 'app/training-provider/running-courses/models/running-course.model';
// import { RunningCoursesService } from 'app/training-provider/running-courses/services/running-courses.service';
import { Subscription } from 'rxjs';
import { EditCompanyInfoDialogComponent } from '../../dialogs/edit-company-info-dialog/edit-company-info-dialog.component';
import { SocialMediaDialogComponent } from '../../dialogs/social-media-dialog/social-media-dialog.component';
import { UploadProfileComponent } from '../../dialogs/upload-profile/upload-profile.component';
// import { ProfileService } from '../../services/profile.service';
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
  public profileImg: string = "assets/images/profile.png";
  public socialMediaInfo!: SocialMedia;
  public websites!: Website;
  public payouts: Payout[] = [];
  public runningCourses: RunningCourses[] = [];
  public loggedInUser: any;

  constructor(
    public dialog: MatDialog,
    // private _profile: ProfileService,
    // private _payout: PayoutService,
    // private _runningCourseService: RunningCoursesService,
    private _currentService: CurrentUserService,
    private activateRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loggedInUser = this._currentService.getUser();
    this.getResolvedData();
    // this.getUserProfile();
    // this.getWebsiteUrls();
    // this.getSocialmedia();
    // this.getRunningCourses();
    // this.getPayouts();
  }

  getResolvedData() {
    this.sub.add(
      this.activateRoute.data.subscribe((data: any) => {
        console.log(data);
        this.profile = data?.resolveData?.profile?.training_InstructorSetupTypes[0];
        this.websites = data?.resolveData?.website?.websiteSetupTypes[0];
        this.socialMediaInfo = data?.resolveData?.socialMedia?.socialMediaSetupTypes[0];
        this.payouts = data?.resolveData?.payout?.payoutSetupTypes;
        this.runningCourses = data?.resolveData?.runningCourse?.coursesSetupTypes;
        // console.log(this.runningCourses)
      })
    );
  }

  // public getUserProfile(): void {
  //   this.isFetchingProfile = true;
  //   this.sub.add(
  //     this._profile.getProfile(this.loggedInUser?.trainingProviderId).subscribe({
  //       next: (res: any) => {
  //         this.isFetchingProfile = false;
  //         this.profile = res['trainingProviderObjs'][0];
  //         // console.log(res, this.profile)
  //       },
  //       error: (error: ResponseModel<null>) => {
  //         this.isFetchingProfile = false;
  //         console.log(error);
  //       },
  //     })
  //   );
  // }

  // public getSocialmedia(): void {
  //   this.isFetchingSocialMedia = true;
  //   this.sub.add(
  //     this._profile.getSocialMedia(this.loggedInUser?.trainingProviderId).subscribe({
  //       next: (res: any) => {
  //         this.isFetchingSocialMedia = false;
  //         this.socialMediaInfo = res['socialMediaSetupTypes'][0];
  //         // console.log(res, this.socialMediaInfo)
  //       },
  //       error: (error: ResponseModel<null>) => {
  //         this.isFetchingSocialMedia = false;
  //         console.log(error);
  //       },
  //     })
  //   );
  // }

  // public getWebsiteUrls(): void {
  //   this.isFetchingWebsiteUrl = true;
  //   this.sub.add(
  //     this._profile.getWebsites(this.loggedInUser?.trainingProviderId).subscribe({
  //       next: (res: any) => {
  //         this.isFetchingProfile = false;
  //         this.websites = res['websiteSetupTypes'][0];
  //         // console.log(res, this.websites)
  //       },
  //       error: (error: ResponseModel<null>) => {
  //         this.isFetchingWebsiteUrl = false;
  //         console.log(error);
  //       },
  //     })
  //   );
  // }

  // public getPayouts(): void {
  //   this.isFetchingWebsiteUrl = true;
  //   this.sub.add(
  //     this._payout.getPayout(this.loggedInUser?.trainingProviderId).subscribe({
  //       next: (res: any) => {
  //         this.isFetchingProfile = false;
  //         this.payouts = res['payoutSetupTypes'];
  //         // console.log(res, this.payouts)
  //       },
  //       error: (error: ResponseModel<null>) => {
  //         this.isFetchingWebsiteUrl = false;
  //         console.log(error);
  //       },
  //     })
  //   );
  // }

  // public getRunningCourses(): void {
  //   this.isFetchingWebsiteUrl = true;
  //   this.sub.add(
  //     this._runningCourseService.getRunningCourses(this.loggedInUser.trainingProviderId).subscribe({
  //       next: (res: any) => {
  //         this.isFetchingProfile = false;
  //         this.runningCourses = res['coursesSetupTypes'];
  //         console.log(res, this.runningCourses);
  //       },
  //       error: (error: ResponseModel<null>) => {
  //         this.isFetchingWebsiteUrl = false;
  //         console.log(error);
  //       },
  //     })
  //   );
  // }

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

}