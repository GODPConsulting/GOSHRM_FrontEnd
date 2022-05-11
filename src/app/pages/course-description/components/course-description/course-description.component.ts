import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HelperService } from '@core/services/healper.service';
import { ResponseModel } from 'app/models/response.model';
import { Courses } from 'app/pages/course-creation/models/course-creation.model';
import { Subscription } from 'rxjs';
import { CourseDescriptionService } from '../../services/course-description.service';

@Component({
  selector: 'app-course-description',
  templateUrl: './course-description.component.html',
  styleUrls: ['./course-description.component.scss']
})
export class CourseDescriptionComponent implements OnInit {
  public sub: Subscription = new Subscription();
  public course!: Courses;
  public isfetchingCourses: boolean = false;
  public courseId: any;

  constructor(
    private _course: CourseDescriptionService,
    private _helper: HelperService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    window.scroll(0,0);
    this.courseId = this._route.snapshot.paramMap.get('courseId');
    this.getCoursesDetail();
  }

  public getCoursesDetail(): void {
    this._helper.startSpinner();
    this.isfetchingCourses = true;
    this.sub.add(
      this._course.getParticipantCourseById(this.courseId).subscribe({
        next: (res: any) => {
          console.log(res)
          this._helper.stopSpinner();
          this.isfetchingCourses = false;
          this.course = res['participantCourseResponse'];
          console.log(res, this.course)
        },
        error: (error: ResponseModel<null>) => {
          this._helper.stopSpinner();
          this.isfetchingCourses = false;
          console.log(error);
        },
      })
    );
  }

}
