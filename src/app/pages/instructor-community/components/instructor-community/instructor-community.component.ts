import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { CreatedByType } from '@core/models/creation-type.model';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { DialogModel } from '@shared/components/models/dialog.model';
import { InitialSearchDTO, ResponseModel, SearchDTO } from 'app/models/response.model';
import { ConversationType, QAType } from 'app/pages/communication/models/communication.model';
import { Subscription } from 'rxjs';
import { QuestionDialogComponent } from '../../dialogs/question-dialog/question-dialog.component';
import { InstructorCommunityService } from '../../services/instructor-community.service';

@Component({
  selector: 'app-instructor-community',
  templateUrl: './instructor-community.component.html',
  styleUrls: ['./instructor-community.component.scss']
})
export class InstructorCommunityComponent implements OnInit {
  public sub: Subscription = new Subscription();
  public showReply: boolean = false;
  public showSubReply: boolean = false;
  public htmlContent = ``;
  public replyForm!: FormGroup;
  public loggedInUser!: any;
  public userId!: string;
  public createdBy!: number;
  public questions: any[] = [];
  public response: any;
  public replies: any[] = [];
  public question: any;
  public isInitialRequest: boolean = true;
  public isFetchingQuestions: boolean = false;
  public isSuccessful: boolean = true;
  public isLoading: boolean = false;
  public searchQuery: SearchDTO = { ...InitialSearchDTO, search: '' };
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
    public dialog: MatDialog,
    public fb: FormBuilder,
    private _current: CurrentUserService,
    private _communication: InstructorCommunityService,
    private _helper: HelperService
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this._current.getUser();
    this.userId = this.loggedInUser.userId
    if(this.loggedInUser.customerTypeId == 1) {
      this.createdBy = CreatedByType.provider;
    }
    if(this.loggedInUser.customerTypeId == 2) {
      this.createdBy = CreatedByType.instructor;
    }
    this.initReplyForm();
    this.getQuestionsAndReplies(true);
  }

  public getQuestionsAndReplies(
    initial: boolean,
    isPagination?: boolean,
    pageEvent?: PageEvent
  ): void {
    if (pageEvent) {
      this.searchQuery = {
        search: this.searchQuery?.search,
        pageNumber: pageEvent?.pageIndex + 1,
        pageSize: pageEvent?.pageSize,
      };
    }
    initial ? (this.isInitialRequest = true) : (this.isInitialRequest = false);
    this.isFetchingQuestions = true;
    this._helper.startSpinner();
    this.sub.add(
      this._communication.getCourseQuestionsAndReply().subscribe({
        next: (res: any) => {
          this._helper.stopSpinner();
          this.isFetchingQuestions = false;
          // this.paginatedResponse = res?.response;
          this.questions = res['courseQAResponse'];
          console.log(this.questions);
          // this.searchQuery.pageNumber = this.paginatedResponse?.pageNumber;
          // this.searchQuery.pageSize = this.paginatedResponse?.pageSize;
        },
        error: (error: ResponseModel<null>) => {
          this.isFetchingQuestions = false;
          this._helper.stopSpinner();
          console.log(error);
        },
      })
    );
  }
  
  getCategory(category: number) {
    let categoryType
    switch (category) {
      case 1:
        categoryType = "Question";
        break;
      case 2:
        categoryType = "Stories and Inspiration";
        break;
      case 3:
        categoryType = "Thought and Recommdendation ";
        break;
      case 4:
        categoryType = "Introduction";
        break;
      default:
        categoryType = ''
    }
    return categoryType

  }

  public getReplies(question: any, reply: any ): void {
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
          // this.searchQuery.pageNumber = this.paginatedResponse?.pageNumber;
          // this.searchQuery.pageSize = this.paginatedResponse?.pageSize;
        },
        error: (error: ResponseModel<null>) => {
          this.isFetchingQuestions = false;
          this._helper.stopSpinner();
          console.log(error);
        },
      })
    );
  }

  public initReplyForm() {
    this.replyForm = this.fb.group({
      courseQAId: [this.question?.courseQAId],
      courseId: [0],
      parentId: [this.question?.replyId ? this.question?.replyId : 0],
      qaType: [QAType.Reply],
      createdByType: [this.createdBy],
      questionByName: [this.loggedInUser.full_Name],
      createdBy: [this.userId],
      comment: [this.question?.comment ? this.question?.comment : '', Validators.required],
      conversationType: [ConversationType.Conversation],
    })
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
    this.getReplies(question, reply);
  }

  public openDialog(
    payload: { isEditing?: boolean; editObject?: any } | any
  ): void {
    let object: DialogModel<any> = payload;
    const dialogRef = this.dialog.open(QuestionDialogComponent, {
      data: object,
    });
    console.log(payload);
    dialogRef.componentInstance.event.subscribe(
      (event: DialogModel<any>) => {
        this.questions.push(event.editObject);
      }
    );
  }

  public replyQuestion(question: any, index:any, reply?: any) {
    this.replyForm = this.fb.group({
      courseQAId: [question?.courseQAId],
      parentId: [reply?.replyId ? reply?.replyId : 0],
      qaType: [QAType.Reply],
      createdByType: [this.createdBy],
      questionByName: [this.loggedInUser.full_Name],
      createdBy: [this.userId],
      comment: [this.htmlContent, Validators.required],
      companyId: [+this.loggedInUser.companyId],
      conversationType: [ConversationType.Conversation],
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

}
