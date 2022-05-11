import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '@shared/services/http.service';
import { ResponseModel } from 'app/models/response.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class CourseDescriptionService {
  constructor(private http: HttpService) {}

  public getParticipantCourseById(
    courseId: number
  ): Observable<ResponseModel<any>> {
   const endpoint = '/trainingparticipant/getParticipantCourseById';
   const params = new HttpParams()
   .set('courseId', courseId)
   return this.http.getRequestWithParams(endpoint, params);
  }

}
