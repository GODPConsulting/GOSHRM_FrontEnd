import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CreatedByType } from '@core/models/creation-type.model';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { ResponseModel } from 'app/models/response.model';
import { Subscription } from 'rxjs';
import { InstructorInformationService } from '../../services/instructor-information.service';
import { DialogModel } from '@shared/components/models/dialog.model';
import { AddDocumentComponent } from '../../dialogs/add-document/add-document.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { BaseComponent } from '@core/base/base/base.component';

@Component({
  selector: 'app-facilitated-courses',
  templateUrl: './facilitated-courses.component.html',
  styleUrls: ['./facilitated-courses.component.scss']
})
export class FacilitatedCoursesComponent implements OnInit {
  public sub: Subscription = new Subscription();
  public facilitatedCourses: any;
  public selectedCourses: any[]= [];
  public isFetchngFacilitatedCourses: boolean = false;
  public loggedInUser: any;
  public instructorId: any;
  public viewHeight: string = '500px';
  public createdBy = CreatedByType;
  public hideElement: boolean = true;

  constructor(
    private _content: InstructorInformationService,
    private _current: CurrentUserService,
    private _helper: HelperService,
    private _route: ActivatedRoute,
    private _base: BaseComponent,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this._current.getUser();
    this.instructorId = this._route.snapshot.paramMap.get('instructorId');
    this.getFacilitatedCourses();
  }

  public getFacilitatedCourses(): void {
    this._helper.startSpinner();
    this.isFetchngFacilitatedCourses = true;
    this.sub.add(
      this._content.getPageBanner(this.loggedInUser.companyId).subscribe({
        next: (res: any) => {
          this._helper.stopSpinner();
          this.isFetchngFacilitatedCourses = false;
          this.facilitatedCourses = res['pageBannerSetupTypes'];
          // console.log(res, this.facilitatedCourses)
        },
        error: (error: ResponseModel<null>) => {
          this._helper.stopSpinner();
          this.isFetchngFacilitatedCourses = false;
          console.log(error);
        },
      })
    );
  }

  public openDialog(
    payload: { isEditing?: boolean; editObject?: any } | any
  ): void {
    let object: DialogModel<any> = payload;
    const dialogRef = this.dialog.open(AddDocumentComponent, {
      data: object,
    });

    dialogRef.componentInstance.event.subscribe(
      (event: DialogModel<any>) => {
       this.getFacilitatedCourses()
      }
    );
  }

  getBase64(event: any, item: number) {
    let me = this;
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      me.uploadImage(reader.result, item);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }


  public uploadImage(fileName: any, pageContentId: number): void {
    this._helper.startSpinner();
    const imageUrl = fileName.split(",");
    const payload  = {
      photoUrl: imageUrl[1],
      pageId: pageContentId,
      pageType: 2,
      companyId: this.loggedInUser.companyId
    };
    if (imageUrl) {
      this._content.uploadContentImage(payload).subscribe({
        next: (res: ResponseModel<any>) => {
          this._helper.stopSpinner();
          // console.log(res);
          this._base.openSnackBar(
            'Great...!!!, Your action was successful',
            'success'
          );
          this.getFacilitatedCourses();
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
          this._helper.stopSpinner();
        },
      });
    }
  }

}
