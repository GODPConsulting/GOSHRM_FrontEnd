import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseDetailService } from '../../services/course-detail.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ConversationType, QAType } from 'app/pages/communication/models/communication.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { CommunicationService } from 'app/pages/communication/services/communication.service';
import { HelperService } from '@core/services/healper.service';
import { ResponseModel } from 'app/models/response.model';

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
    private fb: FormBuilder,
    private _helper: HelperService
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

  getFileExt(content: any) {
    return content.outlineUrl.split(/[#?]/)[0].split('.').pop().trim();
  }

  setFilePathAndType(content: any, sectionId: number) {
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

  public showQuestionSubReply(question: any, reply: any, id: any) {
    let res = document.getElementById(`reply${id}`);
    if(res?.classList.contains('d-none')) {
      res?.classList.remove('d-none');
    } else {
      res?.classList.add('d-none');
    }
    this.getResplies(question, reply);
  }

  public getResplies(question: any, reply: any ): void {
    const payload = {
      courseQAId: question.courseQAId,
      replyId: reply.replyId
    }
    this.isFetchingQuestions = true;
    this._helper.startSpinner();
    this.sub.add(
      this._communication.getCourseQuestionsAndReplyById(payload).subscribe({
        next: (res: any) => {
          this._helper.stopSpinner();
          this.isFetchingQuestions = false;
          // this.paginatedResponse = res?.response;
          this.response = res['courseQAReplyResponse'];
          this.replies = res['courseQAReplyResponse'].replies;
          console.log(res, this.replies);
        },
        error: (error: ResponseModel<null>) => {
          this.isFetchingQuestions = false;
          this._helper.stopSpinner();
          console.log(error);
        },
      })
    );
  }

  public replyQuestion(question: any, index:any, reply?: any) {
    this.replyForm = this.fb.group({
      courseQAId: [question?.courseQAId],
      courseId: [+this.courseId],
      parentId: [reply?.replyId ? reply?.replyId : 0],
      qaType: [QAType.Reply],
      createdByType: [this.createdBy],
      questionByName: [this.loggedInUser.full_Name],
      createdBy: [this.userId],
      comment: [this.htmlContent, Validators.required],
      companyId: [+this.loggedInUser.companyId],
      conversationType: [ConversationType.QA],
    });
    const payload = this.replyForm.value;
    if(payload.parentId == 0 ) {
      payload.reply = payload.comment;
      this.questions[index].replies.push(payload);
    } else {
      payload.reply = payload.comment;
      this.replies.push(payload);
    }
    this.submit(index);
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
