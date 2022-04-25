import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '@shared/services/http.service';
import { ResponseModel } from 'app/models/response.model';
import { Courses } from 'app/pages/course-creation/models/course-creation.model';
import { Observable } from 'rxjs';
import { messageDTO } from '../models/communication.model';

@Injectable({
  providedIn: 'root',
})

export class CommunicationService {
  constructor(private http: HttpService) {}

  public getAllCourses(
    payload: any
  ): Observable<ResponseModel<Courses>> {
   const endpoint = '/course/getCourseQuestionWithQA';
   return this.http.makeRequestWithData('post', endpoint, {}, payload);
  }

  public getCourseQuestionsAndReply(
    courseId: string
  ): Observable<ResponseModel<Courses>> {
   const endpoint = '/course/getCourseQuestionAndReply';
   const params = new HttpParams()
   .set('courseId', courseId)
   return this.http.getRequestWithParams(endpoint, params);
  }

  public getCourseQuestionsAndReplyById(
    payload: any
  ): Observable<ResponseModel<Courses>> {
   const endpoint = '/course/getCourseQuestionAndReplyById';
   const params = new HttpParams()
   .set('courseQAId', payload.courseQAId)
   .set('replyId', payload.replyId);
   return this.http.getRequestWithParams(endpoint, params);
  }

  public AddQuestionAndAnswer(
    course: Courses
  ): Observable<ResponseModel<Courses>> {
    const endpoint = '/course/addCourseQuestionAndAnswer';
    return this.http.makeRequestWithData('post', endpoint, {}, course);
  }

  public LikeQuestionAndAnswer(
    course: Courses
  ): Observable<ResponseModel<Courses>> {
    const endpoint = '/course/likeCourseQuestionAndAnswer';
    return this.http.makeRequestWithData('post', endpoint, {}, course);
  }

  public likeAndDislikeQuestionAndAnswer(
    payload: any
  ): Observable<ResponseModel<any>> {
   const endpoint = '/course/likeCourseQuestionAndAnswer';
   return this.http.makeRequestWithData('post', endpoint, {}, payload);
  }

  public deleteQuestionAndAnswer(
    payload: any
  ): Observable<ResponseModel<any>> {
   const endpoint = '/course/deleteCourseQuestionsAndAnswers';
   return this.http.makeRequestWithData('post', endpoint, {}, payload);
  }

  public getAllMessages(
    payload:any
  ): Observable<ResponseModel<Courses>> {
   const endpoint = '/course/getCourseMessages';
   return this.http.makeRequestWithData('post', endpoint, {}, payload);
  }

  public getMessageById(
    payload: any
  ): Observable<ResponseModel<any>> {
   const endpoint = '/course/getCourseMessageById';
   const params = new HttpParams()
   .set('messageId', payload.messageId)
   .set('courseId', payload.courseId)
   return this.http.getRequestWithParams(endpoint, params);
  }

  public sendNewMessage(
    message: messageDTO
  ): Observable<ResponseModel<messageDTO>> {
    const endpoint = '/course/addCourseMessage';
    return this.http.makeRequestWithData('post', endpoint, {}, message);
  }

  public replyMessage(
    message: any
  ): Observable<ResponseModel<any>> {
    const endpoint = '/course/addCourseMessageReply';
    return this.http.makeRequestWithData('post', endpoint, {}, message);
  }

  public getAllAnnoucement(
    payload:any
  ): Observable<ResponseModel<Courses>> {
   const endpoint = '/course/getCourseAnnouncements';
   return this.http.makeRequestWithData( 'post', endpoint, {}, payload);
  }

  public getAnnouncementById(
    payload: any
  ): Observable<ResponseModel<Courses>> {
   const endpoint = '/course/getCourseAnnouncementById';
   const params = new HttpParams()
   .set('announcementId', payload.announcementId)
   .set('courseId', payload.courseId)
   return this.http.getRequestWithParams(endpoint, params);
  }

  public sendNewAnnouncement(
    announcement: any
  ): Observable<ResponseModel<any>> {
    const endpoint = '/course/addCourseAnnouncement';
    return this.http.makeRequestWithData('post', endpoint, {}, announcement);
  }

  public replyAnnouncement(
    announcement: any
  ): Observable<ResponseModel<any>> {
    const endpoint = '/course/addCourseAnnouncementReply';
    return this.http.makeRequestWithData('post', endpoint, {}, announcement);
  }

  public getAllContactList(
    payload?: any
  ): Observable<ResponseModel<Courses>> {
   const endpoint = '/contactlist/getContactList';
   const params = new HttpParams()
   .set('contactType', payload.contactType)
   .set('providerId', payload.providerId)
   return this.http.getRequestWithParams(endpoint, params);
  }

  public getContactById(
    contactListId: any
  ): Observable<ResponseModel<Courses>> {
   const endpoint = '/contactlist/getContactListById';
   const params = new HttpParams()
   .set('contactListId', contactListId);
   return this.http.getRequestWithParams(endpoint, params);
  }

  public addContactList(
    announcement: any
  ): Observable<ResponseModel<any>> {
    const endpoint = '/contactlist/addContactList';
    return this.http.makeRequestWithData('post', endpoint, {}, announcement);
  }

  public updateContactListDetail(
    announcement: any
  ): Observable<ResponseModel<any>> {
    const endpoint = '/contactlist/updateContactListDetail';
    return this.http.makeRequestWithData('post', endpoint, {}, announcement);
  }

  public deleteContactList(
    payload: any
  ): Observable<ResponseModel<any>> {
    const endpoint = '/contactlist/deleteContactList';
    return this.http.makeRequestWithData('post', endpoint, {}, payload.contactListIds);
  }

  public deleteContactListDetail(
    payload: any
  ): Observable<ResponseModel<any>> {
    const endpoint = '/contactlist/deleteContactListDetails';
    const params = new HttpParams()
    .set('contactListId', payload.contactListId)
    return this.http.makeRequestWithData('post', endpoint, params, payload.contactListIds);
  }

}
