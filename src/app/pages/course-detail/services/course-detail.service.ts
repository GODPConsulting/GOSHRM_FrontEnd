import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '@shared/services/http.service';
import { ResponseModel } from 'app/models/response.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class CourseDetailService {
  constructor(private http: HttpService) {}

  public startMyLearningCourse(
    courseId: number
  ): Observable<ResponseModel<any>> {
   const endpoint = '/trainingparticipant/startMyTraining';
   const params = new HttpParams()
   .set('courseId', courseId)
   return this.http.getRequestWithParams(endpoint, params);
  }

  public getCourseNote(
    courseId: number
  ): Observable<ResponseModel<any>> {
   const endpoint = '/trainingparticipant/getParticipantNote';
   const params = new HttpParams()
   .set('courseId', courseId)
   return this.http.getRequestWithParams(endpoint, params);
  }

  public trackVideoProgress(
    payload: any
  ): Observable<ResponseModel<any>> {
   const endpoint = '/courseoutline/update/courseSectionVideo';
   return this.http.makeRequestWithData('post' ,endpoint, {}, payload);
  }

  public AddNote(
    payload: any
  ): Observable<ResponseModel<any>> {
   const endpoint = '/trainingparticipant/addParticipantNote';
   return this.http.makeRequestWithData('post' ,endpoint, {}, payload);
  }

  public deleteNote(
    payload: any
  ): Observable<ResponseModel<any>> {
   const endpoint = '/trainingparticipant/deleteParticipantNote';
   const params = new HttpParams()
   .set('courseId', payload.courseId)
   .set('participantNoteId', payload.participantNoteId);
   return this.http.makeRequestWithData('post' ,endpoint, params);
  }

}
