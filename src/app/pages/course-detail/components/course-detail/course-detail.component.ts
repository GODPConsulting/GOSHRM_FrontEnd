import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'iq-central-front-end-course-details',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements OnInit {
  public sub: Subscription = new Subscription();
  public courseId: any;
  public courseData: any;
  public announcements: any[] = [];
  public questions: any[] = [];
  public lessons: any;
  public content: any;
  public filePath: any;
  public contentType = null;
  public isfetchingCourse: boolean = false;
  public current_Tab: string = 'overview';

  constructor(
    private route: ActivatedRoute,
    private activateRoute: ActivatedRoute,
    // private sanitizer: DomSanitizer,
  ) {
   
  }

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('courseId');
    this.getResolvedData();
  }

  getResolvedData() {
    this.sub.add(
      this.activateRoute.data.subscribe((data: any) => {
        console.log(data);
        this.courseData = data?.resolveData?.courseDetail?.participantCourseResponse;
        this.announcements = data?.resolveData?.announcement?.courseAnnouncementresponse;
        this.questions = data?.resolveData?.questionAndAnswer?.courseQAResponse;
        this.lessons = this.courseData.sections;
      })
    );
  }

  getFileExt(content: any) {
    return content.outlineUrl.split(/[#?]/)[0].split('.').pop().trim();
  }

  setFilePathAndType(content: any) {
    this.content = content;
    this.contentType = this.getFileExt(content);
    this.filePath = content.outlineUrl
    if (this.contentType === 'pdf') {
      this.filePath = content.outlineUrl
    } else if (this.contentType === 'mp4') {
      this.filePath = content.outlineUrl
    } else {
      this.filePath = content.outlineUrl
    }
  }

  downloadFile(data: Response) {
    // const blob = new Blob([data], { type: 'text/csv' });
    // const url= window.URL.createObjectURL(blob);
    // window.open(url);
  }

  public getOverview() {
    this.current_Tab = 'overview';
  }

  public getNote() {
    this.current_Tab = 'note';
  }

  public getQA() {
    this.current_Tab = 'qa';
  }

  public getTranscript() {
    this.current_Tab = 'transcript';
  }

  public getAnnoucement() {
    this.current_Tab = 'announcement';
  }

}
