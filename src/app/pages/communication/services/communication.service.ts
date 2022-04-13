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
   const endpoint = '/lms/course/getCourseQuestionWithQA';
   const params = new HttpParams()
   .set('id', payload.id)
   .set('type', payload.type);
   return this.http.getRequestWithParams(endpoint, params);
  }

  public getCourseQuestionsAndReply(
    courseId: string
  ): Observable<ResponseModel<Courses>> {
   const endpoint = '/lms/course/getCourseQuestionAndReply';
   const params = new HttpParams()
   .set('courseId', courseId)
   return this.http.getRequestWithParams(endpoint, params);
  }

  public getCourseQuestionsAndReplyById(
    payload: any
  ): Observable<ResponseModel<Courses>> {
   const endpoint = '/lms/course/getCourseQuestionAndReplyById';
   const params = new HttpParams()
   .set('courseQAId', payload.courseQAId)
   .set('replyId', payload.replyId);
   return this.http.getRequestWithParams(endpoint, params);
  }

  public AddQuestionAndAnswer(
    course: Courses
  ): Observable<ResponseModel<Courses>> {
    const endpoint = '/lms/course/addCourseQuestionAndAnswer';
    return this.http.makeRequestWithData('post', endpoint, {}, course);
  }

  public LikeQuestionAndAnswer(
    course: Courses
  ): Observable<ResponseModel<Courses>> {
    const endpoint = '/lms/course/likeCourseQuestionAndAnswer';
    return this.http.makeRequestWithData('post', endpoint, {}, course);
  }

  public likeAndDislikeQuestionAndAnswer(
    payload: any
  ): Observable<ResponseModel<any>> {
   const endpoint = '/lms/course/likeCourseQuestionAndAnswer';
   return this.http.makeRequestWithData('post', endpoint, {}, payload);
  }

  public deleteQuestionAndAnswer(
    payload: any
  ): Observable<ResponseModel<any>> {
   const endpoint = '/lms/course/deleteCourseQuestionsAndAnswers';
   return this.http.makeRequestWithData('post', endpoint, {}, payload);
  }

  public getAllMessages(
    type:any, courseId: any
  ): Observable<ResponseModel<Courses>> {
   const endpoint = '/lms/course/getCourseMessages';
   const params = new HttpParams()
   .set('type', type)
   .set('courseId', courseId);
   return this.http.getRequestWithParams(endpoint, params);
  }

  public getMessageById(
    messageId: number, courseId: number
  ): Observable<ResponseModel<Courses>> {
   const endpoint = '/lms/course/getCourseMessageById';
   const params = new HttpParams()
   .set('messageId', messageId)
   .set('courseId', courseId)
   return this.http.getRequestWithParams(endpoint, params);
  }

  public sendNewMessage(
    message: messageDTO
  ): Observable<ResponseModel<messageDTO>> {
    const endpoint = '/lms/course/addCourseMessage';
    return this.http.makeRequestWithData('post', endpoint, {}, message);
  }

}
