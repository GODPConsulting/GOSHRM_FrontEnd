import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { ResponseModel } from 'app/models/response.model';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AssessmentType } from '../../models/course-creation.model';
import { CourseCreationService } from '../../services/course-creation.service';

@Component({
  selector: 'app-learning-assessment',
  templateUrl: './learning-assessment.component.html',
  styleUrls: ['./learning-assessment.component.scss']
})
export class LearningAssessmentComponent implements OnInit {
  public sub: Subscription = new Subscription();
  public assessments: any;
  public isFetchingAssessment: boolean = false;
  public courseId: any;
  public allAnswered: any[] = [];
  public isEdit: boolean = false;
  public addNewQuiz: boolean = false;
  public assessmentFormSubmitted: boolean = false;
  public quizQuestionForm!: FormGroup;
  public updateQuestionForm!: FormGroup;
  public question: any;
  public loggedInUser: any;
  public assessmentId!: number;
  public title: string = '';
  public assessmentType = AssessmentType;
  public isUpload: boolean = false;
  public quizImg: any;

  constructor(
    private _helper: HelperService,
    private _course: CourseCreationService,
    private _route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private _current:  CurrentUserService,
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this._current.getUser();
    this.courseId = this._route.snapshot.paramMap.get('id');
    this.getCourseAssessment();
    this.initUpdateQuestion();
    this.initQuestionForm();
  }

  initUpdateQuestion() {
    this.updateQuestionForm = this.fb.group({
      questionId: [0],
      question_Varaible: [''],
      pictureUrl: [''],
      photoId: [''],
      photo: [''],
      course_Answers: this.fb.array([
        this.fb.group({
          answerId: [0],
          assessmentId: [0],
          answer_Varaibles: [''],
          isAnswer: false
        })
      ])
    })
  }

  get getOptions(): any {
    return this.updateQuestionForm.get('course_Answers') as FormArray;
  }

  initQuestionForm() {
    this.quizQuestionForm = this.fb.group({
      course_AssessmentId: [0],
      courseId: [+this.courseId],
      trainingInstructorId: [+this.loggedInUser.trainingInstructorId],
      trainingProviderId: [+this.loggedInUser.trainingProviderId],
      companyId: [+this.loggedInUser.companyId],
      assessmentType: [this.assessmentType.LearningAssessment],
      question: this.fb.array([this.newQuestion])
    });
  }

  get newQuestion() {
    return this.fb.group({
      questionId: [0],
      question_Varaible: ['', Validators.required],
      photo: [''],
      course_Answers: this.fb.array([
        this.fb.group({
          answer_Varaibles: ['', Validators.required],
          answerId: [0],
          isAnswer: [false]
        }),
        this.fb.group({
          answer_Varaibles: ['', Validators.required],
          answerId: [0],
          isAnswer: [false]
        }),
        this.fb.group({
          answer_Varaibles: [''],
          answerId: [0],
          isAnswer: [false]
        }),
        this.fb.group({
          answer_Varaibles: [''],
          answerId: [0],
          isAnswer: [false]
        })
      ])
    });
  }

  get getQuizQuestion(): any {
    return this.quizQuestionForm.get('question') as FormArray;
  }

  addNewQuestion(){
    this.addNewQuiz = !this.addNewQuiz
  }

  addQuestion() {
    let entry = { ...this.getQuizQuestion };
    let answers: [] = entry.controls[0].get('course_Answers').value;
    //check that there is at least one true value
    const atLeastOne = answers.filter((el: any) => {
      return el.isAnswer;
    });
    // if atLeastOne is equal to one, good
    if (atLeastOne.length == 1) {
      this.getQuizQuestion.push(this.newQuestion);
    } else if (atLeastOne.length < 1) {
      Swal.fire({
        title: 'Error',
        icon: 'info',
        html:
          '<p>You need to select one of the options as the correct answer</p>'
      });
    } else {
      Swal.fire({
        title: 'Error',
        icon: 'info',
        html:
          '<p>Only one option can be selected as the right answer to a question</p>'
      });
    }
  }

  removeQuestion(i: number) {
    if (i > 0) this.getQuizQuestion.removeAt(i);
  }

  goTo() {
    this.router.navigate(['/training-instructor/course-creation/create-learning-assessment', {courseId: this.courseId}])
  }
  

  public getCourseAssessment(): void {
    this._helper.startSpinner();
    this.isFetchingAssessment = true;
    this.sub.add(
      this._course.getAssessments(this.courseId, this.assessmentType.LearningAssessment).subscribe({
        next: (res: any) => {
          this._helper.stopSpinner();
          this.isFetchingAssessment = false;
          // console.log(res)
          this.title = res.course_AssessmentSetupTypes[0]?.title
          this.assessmentId = res.course_AssessmentSetupTypes[0]?.course_AssessmentId
          this.assessments = res?.course_AssessmentSetupTypes[0]?.question;
          this.initQuestionForm();
        },
        error: (error: ResponseModel<null>) => {
          this._helper.stopSpinner();
          this.isFetchingAssessment = false;
          console.log(error);
        },
      })
    );
  }

  public toggleEdit(question: any, id: any) {
    this.isEdit = !this.isEdit;
    this.question = question;
    let assessment = document.getElementById(`assessment${id}`);
    let editAssessment = document.getElementById(`editAssessment${id}`);
    if(editAssessment?.classList.contains('d-none')) {
      assessment?.classList.add('d-none');
      editAssessment?.classList.remove('d-none');
    } else {
      assessment?.classList.remove('d-none');
      editAssessment?.classList.add('d-none');
    }
    this.updateQuestionForm = this.fb.group({
      questionId: this.question.questionId,
      question_Varaible: this.question.question_Varaible,
      pictureUrl: this.question.pictureUrl,
      photoId: this.question.photoId,
      photo: this.question.photo,
      course_Answers: this.fb.array([
        this.fb.group({
          answerId: this.question.course_Answers[0].answerId,
          assessmentId: this.question.course_Answers[0].assessmentId,
          answer_Varaibles: this.question.course_Answers[0].answer_Varaibles,
          isAnswer: this.question.course_Answers[0].isAnswer
        }),
        this.fb.group({
          answerId: this.question.course_Answers[1].answerId,
          assessmentId: this.question.course_Answers[1].assessmentId,
          answer_Varaibles: this.question.course_Answers[1].answer_Varaibles,
          isAnswer: this.question.course_Answers[1].isAnswer
        }),
        this.fb.group({
          answerId: this.question.course_Answers[2].answerId,
          assessmentId: this.question.course_Answers[2].assessmentId,
          answer_Varaibles: this.question.course_Answers[2].answer_Varaibles,
          isAnswer: this.question.course_Answers[2].isAnswer
        }),
        this.fb.group({
          answerId: this.question.course_Answers[3].answerId,
          assessmentId: this.question.course_Answers[3].assessmentId,
          answer_Varaibles: this.question.course_Answers[3].answer_Varaibles,
          isAnswer: this.question.course_Answers[3].isAnswer
        }),
      ])
    })
    console.log(this.question)
  }

  public checked(questionId: any, answerId: any) {
    // console.log(questionId, answerId)
    return this.allAnswered.some(
      (answer: any) => answer.questionId == questionId && answer.answerId == answerId
    );
  }

  getBase64(event: any) {
    this.isUpload = !this.isUpload;
    let me = this;
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      // console.log(reader.result);
      me.quizImg = reader.result;
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  public updateQuestion(question: any, i: any): void {
    this.assessmentFormSubmitted = true;
    if (this.updateQuestionForm.valid) {
      this._helper.startSpinner();
      const payload = this.updateQuestionForm.value;
      if(this.quizImg != null) {
        const imageUrl = this.quizImg.split(",");
        payload.pictureUrl = imageUrl[1];
      }
     console.log(payload)
      this._course.UpdateCourseAssessment(payload).subscribe({
        next: (res: any) => {
         if(res.status.isSuccessful) {
          this._helper.stopSpinner();
          // console.log(res)
          this.toggleEdit(question, i)
          this._helper.triggerSucessAlert('Course created successfully!!!')
          this.getCourseAssessment();
         } else {
           this._helper.stopSpinner();
           this._helper.triggerErrorAlert(res?.status?.message?.friendlyMessage)
         }
        },
        error: (error: HttpErrorResponse) => {
          this._helper.stopSpinner();
          console.log(error);
          this.assessmentFormSubmitted = false;
        },
      });
    }
  }

  public submit(): void {
    this.assessmentFormSubmitted = true;
    if (this.quizQuestionForm.valid) {
      this._helper.startSpinner();
      const payload = this.quizQuestionForm.value;
     payload.course_AssessmentId = this.assessmentId;
     console.log(payload)
      this._course.AddUpdateCourseAssessment(payload).subscribe({
        next: (res: any) => {
         if(res.status.isSuccessful) {
          this._helper.stopSpinner();
          console.log(res)
          this.addNewQuiz = false;
          this._helper.triggerSucessAlert('Course created successfully!!!')
          this.getCourseAssessment();
         } else {
           this._helper.stopSpinner();
           this._helper.triggerErrorAlert(res?.status?.message?.friendlyMessage)
         }
        },
        error: (error: HttpErrorResponse) => {
          this._helper.stopSpinner();
          console.log(error);
          this.assessmentFormSubmitted = false;
        },
      });
    }
  }

  public deleteQuestion(questionId: any): void {
    const payload = {
      questionIds: [questionId]
    }
    if (payload.questionIds.length > 0) {
      this._helper.startSpinner();
     console.log(payload)
      this._course.deleteQuestion(payload).subscribe({
        next: (res: any) => {
         if(res.status.isSuccessful) {
          this._helper.stopSpinner();
          console.log(res)
          this.isEdit = false;
          this._helper.triggerSucessAlert('Course created successfully!!!')
          this.getCourseAssessment();
         } else {
           this._helper.stopSpinner();
           this._helper.triggerErrorAlert(res?.status?.message?.friendlyMessage)
         }
        },
        error: (error: HttpErrorResponse) => {
          this._helper.stopSpinner();
          console.log(error);
          this.assessmentFormSubmitted = false;
        },
      });
    }
  }

  public deleteAssessment(): void {
      this._helper.startSpinner();
      this._course.deleteCourseAssessment(this.assessmentId).subscribe({
        next: (res: any) => {
         if(res.status.isSuccessful) {
          this._helper.stopSpinner();
          console.log(res)
          this.isEdit = false;
          this._helper.triggerSucessAlert('Course created successfully!!!')
          this.getCourseAssessment();
         } else {
           this._helper.stopSpinner();
           this._helper.triggerErrorAlert(res?.status?.message?.friendlyMessage)
         }
        },
        error: (error: HttpErrorResponse) => {
          this._helper.stopSpinner();
          console.log(error);
          this.assessmentFormSubmitted = false;
        },
      });
  }

}

