import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseDetailService } from '../../services/course-detail.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { CommunicationService } from 'app/pages/communication/services/communication.service';
import { HelperService } from '@core/services/healper.service';
import { CurrentUserService } from '@core/services/current-user.service';

@Component({
  selector: 'iq-central-front-end-course-details',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements OnInit {
  public sub: Subscription = new Subscription();
  public courseId: any;
  public outlineId: any;
  public sectionId: any;
  public courseData: any;
  public announcements: any[] = [];
  public questions: any[] = [];
  public replies: any[] = [];
  public htmlContent = ``;
  public lessons: any;
  public content: any;
  public filePath: any;
  public contentType = null;
  public isfetchingCourse: boolean = false;
  public current_Tab: string = 'overview';
  public video: any;
  public videoPlaying: boolean = false;
  public percentage: any;
  public replyForm!: FormGroup;
  public loggedInUser!: any;
  public userId!: string;
  public createdBy!: number;
  public isLoading: boolean = false;
  public isSuccessful: boolean = false;
  public showReply: boolean = false;
  public showSubReply: boolean = false;
  public isFetchingQuestions: boolean = false;
  public response: any;
  public config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    // height: '2rem',
    minHeight: '3rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
      ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };

  constructor(
    private route: ActivatedRoute,
    private activateRoute: ActivatedRoute,
    private _course: CourseDetailService,
    private _communication: CommunicationService,
    private _helper: HelperService,
    private _current: CurrentUserService
  ) {
   
  }

  ngOnInit(): void {
    this.loggedInUser = this._current.getUser();
    this.courseId = this.route.snapshot.paramMap.get('courseId');
    this.getResolvedData();
  }

  public getResolvedData() {
    this.sub.add(
      this.activateRoute.data.subscribe((data: any) => {
        console.log(data);
        this.courseData = data?.resolveData?.courseDetail?.participantCourseResponse;
        this.announcements = data?.resolveData?.announcements?.courseAnnouncementresponse;
        this.questions = data?.resolveData?.questionAndAnswer?.courseQAResponse;
        this.lessons = this.courseData.sections;
        console.log(this.announcements);
        return this.lessons.forEach((item: any) => {
          return item?.outline.forEach((n: any) => {
            let contentType = this.getFileExt(n);
            return n.contentType = contentType
          })
        })
      })
    );
  }

  public getFileExt(content: any) {
    return content.outlineUrl.split(/[#?]/)[0].split('.').pop().trim();
  }

  public setFilePathAndType(content: any, sectionId: number) {
    this.content = content;
    this.contentType = this.getFileExt(content);
    this.filePath = content.outlineUrl;
    this.outlineId = content.outlineId;
    this.sectionId = sectionId;
  }

  public onTimeUpdate(){
    this.video = document.querySelector("video");
    if(!this.videoPlaying){
        // this.video.currentTime = 10;
        this.video.play();
        this.videoPlaying = true;
        this.percentage = (this.video.currentTime / this.video.duration) * 100;
        console.log(this.percentage, this.video.currentTime, this.video.duration);
    }else{
        this.video.pause();
        this.videoPlaying = false;
    }
    const payload = {
      sectionId: this.sectionId,
      outlineId: this.outlineId,
      durationOfVideoCompeleted: Math.floor((this.percentage/100))
    }
    setInterval(() => {
      this.trackVideoProgress(payload);
    }, 10000);
  }

  public formatTime(timeInSeconds: any) {
    const result = new Date(timeInSeconds * 1000).toISOString().substr(11, 8);
    return  result.substr(3, 2) + ':' + result.substr(6, 2);
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

  public trackVideoProgress(payload: any): void {
      console.log(payload)
      this._course.trackVideoProgress(payload).subscribe({
        next: (res: any) => {
            console.log(res)
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
        },
      });
  }

  public showQuestionReply(question: any, id: any) {
    this.showReply = !this.showReply;
    let response = document.getElementById(`response${id}`);
    if(response?.classList.contains('d-none')) {
      response?.classList.remove('d-none');
    } else {
      response?.classList.add('d-none');
    }
  }

  public replyAnnoucement(id: number) {
    this._helper.startSpinner();
    const payload = {
      courseAnnouncementId: id,
      courseAnnouncmentReplyId: 0,
      courseId: +this.courseId,
      message: this.htmlContent,
      senderEmail: this.loggedInUser.userName,
      companyId: this.loggedInUser.companyId
    };
    console.log(payload)
      this.sub.add(
        this._communication.replyAnnouncement(payload).subscribe({
          next: (res: any) => {
            console.log(res);
            if(res.status.isSuccessful) {
              this._helper.stopSpinner();
              this._helper.triggerSucessAlert('Course outline created successfully!!!');
            } else {
              this._helper.stopSpinner();
              this._helper.triggerErrorAlert(res?.status?.message?.friendlyMessage)
            }
          },
          error: (error: any) => {
            this._helper.stopSpinner();
            console.log(error);
          },
        })
      );
  }

  public likeAndDislike(
    question: any, 
    index: any, 
    reply?: any,
    replyIndex?: any
  ) {
    const payload = {
      courseQAId: question?.courseQAId,
      likeCourseQAId: question.likeId ? question.likeId : 0,
      qaType: 1,
      replyId: reply?.replyId ? reply?.replyId : 0,
      isLiked: !question.isLiked,
      createdById: this.userId,
    }
    if (payload.replyId != 0) {
      payload.qaType = 2;
      payload.likeCourseQAId = reply?.likedId ? reply?.likedId : 0;
      payload.isLiked = !reply.isLiked
     }
      console.log(reply, payload);
      this.sub.add(
        this._communication.likeAndDislikeQuestionAndAnswer(payload).subscribe({
          next: (res: any) => {
            console.log(res);
            if(res.status.isSuccessful) {
              if(payload.replyId == 0 ) {
                this.questions[index].isLiked = payload.isLiked;
                payload.isLiked == true
                  ? this.questions[index].totalLike++ :
                  this.questions[index].totalLike--;
              } else {
                this.questions[index].replies[replyIndex].isLiked = payload.isLiked;
                payload.isLiked == true
                  ? this.questions[index].replies[replyIndex].totalLike++ :
                  this.questions[index].replies[replyIndex].totalLike--;
              }
            } else {
              this._helper.triggerErrorAlert(res?.status?.message?.friendlyMessage)
            }
          },
          error: (error: any) => {
            console.log(error);
          },
        })
      );
  }

  public submit(index: any) {
    const payload = this.replyForm.value;
    this.isLoading = true;
    if(this.replyForm.valid) {
      console.log(payload);
      this.htmlContent = '';
      this.sub.add(
        this._communication.AddQuestionAndAnswer(this.replyForm.value).subscribe({
          next: (res: any) => {
            if(res.status.isSuccessful) {
              this.isSuccessful = true;
              this.isLoading = false;
            } else {
              this.isSuccessful = false;
              this.isLoading = false;
              // this._helper.triggerErrorAlert(res?.status?.message?.friendlyMessage)
            }
          },
          error: (error: any) => {
            this.isSuccessful = false;
            this.isLoading = false;
            console.log(error);
          },
        })
      );
    }
  }

}
