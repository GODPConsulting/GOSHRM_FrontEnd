import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot
} from '@angular/router';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { AnnouncementType, MessageType } from 'app/pages/communication/models/communication.model';
import { CommunicationService } from 'app/pages/communication/services/communication.service';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CourseDetailService } from '../services/course-detail.service';

@Injectable({
  providedIn: 'root'
})
export class CourseDetailResolver implements Resolve<boolean> {
  public courseId: any;
  public loggedInUser: any;

  constructor(
    private _helper: HelperService,
    private _courseDetail: CourseDetailService,
    private _communication: CommunicationService,
    private _current: CurrentUserService
  ) {}
  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    this.courseId = route.params.courseId;
    this.loggedInUser = this._current.getUser();
    const payload = {
      announcementType: AnnouncementType.Educational,
      senderEmail: this.loggedInUser.userName,
      messageType: MessageType.Inbox
    }
    const courseDetail = this._courseDetail.startMyLearningCourse(this.courseId);
    const announcements = this._communication.getAllAnnoucement(payload);
    const questionAndAnswer = this._communication.getCourseQuestionsAndReply(this.courseId);
    this._helper.startSpinner();
    return forkJoin([courseDetail, announcements, questionAndAnswer]).pipe(
      map(response => {
        this._helper.stopSpinner();
        return {
          courseDetail: response[0],
          announcements: response[1],
          questionAndAnswer: response[2],
        };
      })
    );
  }
}

