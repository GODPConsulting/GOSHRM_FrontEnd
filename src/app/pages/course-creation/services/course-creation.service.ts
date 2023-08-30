import { CurrentUserService } from './../../../core/services/current-user.service';
import { environment } from './../../../../environments/environment';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '@shared/services/http.service';
import { ResponseModel } from 'app/models/response.model';
import { Observable } from 'rxjs';
import { CourseAssessment, CourseOutline, Courses } from '../models/course-creation.model';

@Injectable({
  providedIn: 'root',
})

export class CourseCreationService {
  constructor(private http: HttpService, private _current: CurrentUserService) {}

  public getAllCourses(
    companyId: number
  ): Observable<ResponseModel<Courses>> {
    const param = new HttpParams()
    .set('companyId', companyId)
   const endpoint = '/runningcourse/getAllRunningcourse';
   return this.http.getRequestWithParams(endpoint, param);
  }

  public getOneCoursesById(
    courseId: string
  ): Observable<ResponseModel<Courses>> {
   const endpoint = '/coursecreation/get/courseid/coursecreation';
   const params = new HttpParams()
   .set('courseId', courseId)
   return this.http.getRequestWithParams(endpoint, params);
  }

  public UpdateCourse(
    course: Courses
  ): Observable<ResponseModel<Courses>> {
    const endpoint = '/coursecreation/add/update/coursecreation';
    return this.http.makeRequestWithData('post', endpoint, {}, course);
  }

  public getAllCourseOutline(
    courseid: string
  ): Observable<ResponseModel<CourseOutline>> {
   const endpoint = '/courseoutline/get/byId/courseoutline';
   const params = new HttpParams()
   .set('courseId', courseid)
   return this.http.getRequestWithParams(endpoint, params);
  }

  public getCourseOutlineById(
    courseid: string
  ): Observable<ResponseModel<CourseOutline>> {
   const endpoint = '/courseoutline/get/byId/courseoutline';
   const params = new HttpParams()
   .set('courseId', courseid)
   return this.http.getRequestWithParams(endpoint, params);
  }

  public getAllCourseSection(
    courseid: string, courseOutlineId: string
  ): Observable<ResponseModel<CourseOutline>> {
   const endpoint = '/course/getCourseSection';
   const params = new HttpParams()
   .set('courseId', courseid)
   .set('courseOutlineId', courseOutlineId);
   return this.http.getRequestWithParams(endpoint, params);
  }

  public UpdateCourseOutline(
    course: CourseOutline,
  ): Observable<ResponseModel<CourseOutline>> {
    const endpoint = '/courseoutline/add/update/courseoutline';
    return this.http.makeRequestWithData('post', endpoint, {}, course);
  }

  public AddUpdateCourseAssessment(
    course: CourseAssessment
  ): Observable<ResponseModel<CourseAssessment>> {
    const endpoint = '/courseassessment/add/update/courseassessment';
    return this.http.makeRequestWithData('post', endpoint, {}, course);
  }

  public UpdateCourseAssessment(
    course: any
  ): Observable<ResponseModel<CourseAssessment>> {
    const endpoint = '/course/updateCourseQuestionAndAnswer';
    return this.http.makeRequestWithData('post', endpoint, {}, course);
  }

  public deleteCourseAssessment(
    assessmentId: any
  ): Observable<ResponseModel<CourseAssessment>> {
    const endpoint = '/course/deleteCourseAssessment';
    const param = new HttpParams()
    .set('assessmentId', assessmentId)
    return this.http.makeRequestWithData('post', endpoint, param);
  }

  public deleteCourses(
    courseIds: any
  ): Observable<ResponseModel<CourseAssessment>> {
    const endpoint = '/course/deleteCourse';
    return this.http.makeRequestWithData('post', endpoint, {}, courseIds);
  }

  public submitCourse(
    courseId: number
  ) {
    const endpoint = '/course/submitCourse';
    const params = new HttpParams()
    .set('courseId', courseId)
    return this.http.makeRequestWithData('post', endpoint, params);
  }

  public deleteQuestion(
    course: any
  ): Observable<ResponseModel<CourseAssessment>> {
    const endpoint = '/course/deleteCourseQuestionsAndAnswers';
    return this.http.makeRequestWithData('post', endpoint, {}, course);
  }

  public deleteSectionOuline(
    course: any, type: number
  ): Observable<ResponseModel<CourseAssessment>> {
    const endpoint = '/course/deleteCourseOulineAndSection';
    const params = new HttpParams()
   .set('type', type);
    return this.http.makeRequestWithData('post', endpoint, params, course);
  }

  public getAssessments(
    courseId: any, assessmentType: number
  ): Observable<ResponseModel<CourseAssessment>> {
    const params = new HttpParams()
    .set('courseId', courseId)
    .set('type', assessmentType)
    const endpoint = '/courseassessment/get/byId/courseassessment';
    return this.http.getRequestWithParams( endpoint, params);
  }

  public getParticipantAssessments(
    courseId: any, assessmentType: number
  ): Observable<ResponseModel<CourseAssessment>> {
    const params = new HttpParams()
    .set('courseId', courseId)
    .set('type', assessmentType)
    const endpoint = '/trainingparticipant/getParticipantAssessmentByCourseID';
    return this.http.getRequestWithParams( endpoint, params);
  }


  public AddUpdateLearningAssessment(
    course: CourseAssessment
  ): Observable<ResponseModel<CourseAssessment>> {
    const endpoint = '/learningassessment/add/update/learningassessment';
    return this.http.makeRequestWithData('post', endpoint, {}, course);
  }

  public MarkAssessment(
    assessment: any
  ): Observable<ResponseModel<CourseAssessment>> {
    const endpoint = '/trainingparticipant/markParticipantAssessment';
    const params = new HttpParams()
    .set('courseId', assessment.courseId)
    .set('assessmentId', assessment.assessmentId)
    .set('assessmentType', assessment.assessmentType)
    return this.http.makeRequestWithData('post', endpoint, params, assessment.answers);
  }

  public getAssessmentScore(
    assessment: any
  ): Observable<ResponseModel<CourseAssessment>> {
    const endpoint = '/trainingparticipant/getParticipantScore';
    const params = new HttpParams()
    .set('courseId', assessment.courseId)
    .set('assessmentId', assessment.assessmentId)
    return this.http.getRequestWithParams( endpoint, params);
  }

  public retakeAssessment(
    assessment: any
  ): Observable<ResponseModel<CourseAssessment>> {
    const endpoint = '/trainingparticipant/retakeParticipantAssessment';
    const params = new HttpParams()
    .set('courseId', assessment.courseId)
    .set('assessmentId', assessment.assessmentId)
    return this.http.makeRequestWithData( 'post', endpoint, params);
  }

  public getLearningAssessments(
    courseId: any
  ): Observable<ResponseModel<CourseAssessment>> {
    const params = new HttpParams()
    .set('courseId', courseId)
    const endpoint = '/learningassessment/get/courseId/learningassessment';
    return this.http.getRequestWithParams( endpoint, params);
  }

  public getCompetencyByCourse(
    courseId: number, searchParams: string
  ): Observable<ResponseModel<Courses>> {
   const endpoint = '/course/getCourseCompetenceAssessment';
   const params = new HttpParams()
   .set('courseId', courseId)
   .set('searchParams', searchParams);
   return this.http.makeRequestWithData('get',endpoint, params);
  }

  public getAllCompetencies(
    searchParams: string
  ): Observable<ResponseModel<Courses>> {
   const endpoint = '/course/getAllCourseCompetenceAssessment';
   const params = new HttpParams()
   .set('searchParams', searchParams);
   return this.http.makeRequestWithData('get',endpoint, params);
  }

  public addUpdateCompetence(
    payload: any
  ): Observable<ResponseModel<any>> {
   const endpoint = '/course/addCourseCompetenceAssessment';
   return this.http.makeRequestWithData('post',endpoint, {}, payload);
  }

  public addCompetenceReviewer(
    payload: any
  ): Observable<ResponseModel<any>> {
   const endpoint = '/trainingparticipant/reviewParticipantCourse';
   const params = new HttpParams()
   .set('courseId', payload.courseId)
   return this.http.makeRequestWithData('post',endpoint, params, payload.reviewers);
  }

  public deleteCompetence(
    payload: any
  ): Observable<ResponseModel<any>> {
   const endpoint = '/course/deleteCourseCompetenceAssessment';
   return this.http.makeRequestWithData('post',endpoint, {}, payload);
  }

  public createScheduleClass(
    payload: any
  ): Observable<ResponseModel<any>> {
   const endpoint = '/contact/scheduleCourse';
   return this.http.makeRequestWithData('post',endpoint, {}, payload);
  }

  public AddcourseParticipant(
    payload: any
  ): Observable<ResponseModel<any>> {
   const endpoint = '/course/addCourseParticipant';
   return this.http.makeRequestWithData('post',endpoint, {}, payload);
  }

  public getcourseParticipant(
    payload: any
  ): Observable<ResponseModel<any>> {
   const endpoint = '/course/getCourseParticipant';
   const params = new HttpParams()
   .set('courseId', payload.courseId)
   .set('searchParams', payload.searchParams);
   return this.http.getRequestWithParams(endpoint, params);
  }

  public participantUpload(path: any, body: any, file: File) {
    return new Promise((resolve, reject) => {
      const url = `${environment.api_url}${path}`;
      const xhr: XMLHttpRequest = new XMLHttpRequest();

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };

      xhr.open('POST', url, true);
      const formData = new FormData();
      formData.append('File', file, file.name);
      formData.append('courseId', body.courseId);

      const token = this._current.getAuthToken();
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.send(formData);
    });
  }

  public UploadParticipants(body: any, file: File): Promise<any> {
    const url = `/course/uploadParticipants`;
    return this.participantUpload(
            url,
            body,
            file
        )
        .then(data => {
            return data;
        });
  }
}
