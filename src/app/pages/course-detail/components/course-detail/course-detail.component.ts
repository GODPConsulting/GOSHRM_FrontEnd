import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
  public video: any;
  public videoPlaying: boolean = false;
  public percentage: any;

  constructor(
    private route: ActivatedRoute,
    private activateRoute: ActivatedRoute,
  ) {
   
  }

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('courseId');
    this.getResolvedData();
  }

  getResolvedData() {
    this.sub.add(
      this.activateRoute.data.subscribe((data: any) => {
        // console.log(data);
        this.courseData = data?.resolveData?.courseDetail?.participantCourseResponse;
        this.announcements = data?.resolveData?.announcement?.courseAnnouncementresponse;
        this.questions = data?.resolveData?.questionAndAnswer?.courseQAResponse;
        this.lessons = this.courseData.sections;
        console.log(this.lessons);
        return this.lessons.forEach((item: any) => {
          return item?.outline.forEach((n: any) => {
            let contentType = this.getFileExt(n);
            return n.contentType = contentType
          })
        })
      })
    );
  }

  getFileExt(content: any) {
    return content.outlineUrl.split(/[#?]/)[0].split('.').pop().trim();
  }

  setFilePathAndType(content: any) {
    this.content = content;
    this.contentType = this.getFileExt(content);
    this.filePath = content.outlineUrl;
  }

  public onTimeUpdate(){
    this.video = document.querySelector("video");
    if(!this.videoPlaying){
        // this.video.currentTime = 10;
        this.video.play();
        this.videoPlaying = true;
        this.percentage = (this.video.currentTime / this.video.duration) * 100;
        console.log(this.percentage, this.video.currentTime, this.video.duration )
    }else{
        this.video.pause();
        this.videoPlaying = false;
    }
  }

  formatTime(timeInSeconds: any) {
    const result = new Date(timeInSeconds * 1000).toISOString().substr(11, 8);
  
    return {
      minutes: result.substr(3, 2),
      seconds: result.substr(6, 2),
    };
  };

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
