import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '@shared/services/http.service';
import { ResponseModel } from 'app/models/response.model';
import { Courses } from 'app/pages/course-creation/models/course-creation.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class InstructorCommunityService {
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

  public replyMessage(
    message: any
  ): Observable<ResponseModel<any>> {
    const endpoint = '/course/addCourseMessageReply';
    return this.http.makeRequestWithData('post', endpoint, {}, message);
  }

}
