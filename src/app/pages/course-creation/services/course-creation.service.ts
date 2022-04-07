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
  constructor(private http: HttpService) {}

  public getAllCourses(
    payload: any
  ): Observable<ResponseModel<Courses>> {
   const endpoint = '/lms/coursecreation/get/byId/coursecreation';
   return this.http.makeRequestWithData('post',endpoint, {}, payload);
  }

  public getOneCoursesById(
    courseId: string
  ): Observable<ResponseModel<Courses>> {
   const endpoint = '/lms/coursecreation/get/courseid/coursecreation';
   const params = new HttpParams()
   .set('courseId', courseId)
   return this.http.getRequestWithParams(endpoint, params);
  }

  public UpdateCourse(
    course: Courses
  ): Observable<ResponseModel<Courses>> {
    const endpoint = '/lms/coursecreation/add/update/coursecreation';
    return this.http.makeRequestWithData('post', endpoint, {}, course);
  }

  public getAllCourseOutline(
    courseid: string
  ): Observable<ResponseModel<CourseOutline>> {
   const endpoint = '/lms/courseoutline/get/byId/courseoutline';
   const params = new HttpParams()
   .set('courseId', courseid)
   return this.http.getRequestWithParams(endpoint, params);
  }

  public getCourseOutlineById(
    courseid: string
  ): Observable<ResponseModel<CourseOutline>> {
   const endpoint = '/lms/courseoutline/get/byId/courseoutline';
   const params = new HttpParams()
   .set('courseId', courseid)
   return this.http.getRequestWithParams(endpoint, params);
  }

  public getAllCourseSection(
    courseid: string, courseOutlineId: string
  ): Observable<ResponseModel<CourseOutline>> {
   const endpoint = '/lms/course/getCourseSection';
   const params = new HttpParams()
   .set('courseId', courseid)
   .set('courseOutlineId', courseOutlineId);
   return this.http.getRequestWithParams(endpoint, params);
  }

  public UpdateCourseOutline(
    course: CourseOutline,
  ): Observable<ResponseModel<CourseOutline>> {
    const endpoint = '/lms/courseoutline/add/update/courseoutline';
    return this.http.makeRequestWithData('post', endpoint, {}, course);
  }

  public AddUpdateCourseAssessment(
    course: CourseAssessment
  ): Observable<ResponseModel<CourseAssessment>> {
    const endpoint = '/lms/courseassessment/add/update/courseassessment';
    return this.http.makeRequestWithData('post', endpoint, {}, course);
  }

  public UpdateCourseAssessment(
    course: any
  ): Observable<ResponseModel<CourseAssessment>> {
    const endpoint = '/lms/course/updateCourseQuestionAndAnswer';
    return this.http.makeRequestWithData('post', endpoint, {}, course);
  }

  public deleteCourseAssessment(
    assessmentId: any
  ): Observable<ResponseModel<CourseAssessment>> {
    const endpoint = '/lms/course/deleteCourseAssessment';
    const param = new HttpParams()
    .set('assessmentId', assessmentId)
    return this.http.makeRequestWithData('post', endpoint, param);
  }

  public deleteCourses(
    courseIds: any
  ): Observable<ResponseModel<CourseAssessment>> {
    const endpoint = '/lms/course/deleteCourse';
    return this.http.makeRequestWithData('post', endpoint, {}, courseIds);
  }

  public deleteQuestion(
    course: any
  ): Observable<ResponseModel<CourseAssessment>> {
    const endpoint = '/lms/course/deleteCourseQuestionsAndAnswers';
    return this.http.makeRequestWithData('post', endpoint, {}, course);
  }

  public deleteSectionOuline(
    course: any, type: number
  ): Observable<ResponseModel<CourseAssessment>> {
    const endpoint = '/lms/course/deleteCourseOulineAndSection';
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
    const endpoint = '/lms/courseassessment/get/byId/courseassessment';
    return this.http.getRequestWithParams( endpoint, params);
  }

  public AddUpdateLearningAssessment(
    course: CourseAssessment
  ): Observable<ResponseModel<CourseAssessment>> {
    const endpoint = '/lms/learningassessment/add/update/learningassessment';
    return this.http.makeRequestWithData('post', endpoint, {}, course);
  }

  public getLearningAssessments(
    courseId: any
  ): Observable<ResponseModel<CourseAssessment>> {
    const params = new HttpParams()
    .set('courseId', courseId)
    const endpoint = '/lms/learningassessment/get/courseId/learningassessment';
    return this.http.getRequestWithParams( endpoint, params);
  }

  public getCompetencyByCourse(
    courseId: number, searchParams: string
  ): Observable<ResponseModel<Courses>> {
   const endpoint = '/lms/course/getCourseCompetenceAssessment';
   const params = new HttpParams()
   .set('courseId', courseId)
   .set('searchParams', searchParams);
   return this.http.makeRequestWithData('get',endpoint, params);
  }

  public getAllCompetencies(
    searchParams: string
  ): Observable<ResponseModel<Courses>> {
   const endpoint = '/lms/course/getAllCourseCompetenceAssessment';
   const params = new HttpParams()
   .set('searchParams', searchParams);
   return this.http.makeRequestWithData('get',endpoint, params);
  }

  public addUpdateCompetence(
    payload: any
  ): Observable<ResponseModel<Courses>> {
   const endpoint = '/lms/course/addCourseCompetenceAssessment';
   return this.http.makeRequestWithData('post',endpoint, {}, payload);
  }

  public deleteCompetence(
    payload: any
  ): Observable<ResponseModel<Courses>> {
   const endpoint = '/lms/course/deleteCourseCompetenceAssessment';
   return this.http.makeRequestWithData('post',endpoint, {}, payload);
  }
}
