import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { Subscription } from 'rxjs';
import { CourseCreationService } from '../../services/course-creation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-learning-assessment',
  templateUrl: './create-learning-assessment.component.html',
  styleUrls: ['./create-learning-assessment.component.scss']
})
export class CreateLearningAssessmentComponent implements OnInit {
  public sub: Subscription = new Subscription();
  public quizQuestioForm!: FormGroup;
  public assessmentFormSubmitted: boolean = false;
  public loggedInUser: any;
  public courseId: any;
  public questionId: any = 0;
  public course_AssessmentId: any = 0;
  public assessments: any[] = [];
  public isFetchingAssessment: boolean = false;

  constructor(
    private fb: FormBuilder,
    private _helper: HelperService,
    private _course: CourseCreationService,
    private _current:  CurrentUserService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this._current.getUser();
    this.courseId = this._route.snapshot.paramMap.get('courseId');
    if (this._route.snapshot.paramMap.get('questionId')) {
      this.questionId = this._route.snapshot.paramMap.get('questionId');
    }
    this.initQuizQuestionForm();
  }


  initQuizQuestionForm() {
    this.quizQuestioForm = this.fb.group({
      assessment_Title: ['', Validators.required],
      question: this.fb.array([this.newQuestion])
    });
  }

  get newQuestion() {
    return this.fb.group({
      questionId: [0],
      question_Varaible: ['', Validators.required],
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

  addOption() {
    return this.fb.group({
      answer_Varaibles: [''],
      answerId: [0],
      isAnswer: [false]
    })
  }

  get getQuizQuestion(): any {
    return this.quizQuestioForm.get('question') as FormArray;
  }

  getQuizAnswers(index: any): FormArray {
    return this.getQuizQuestion[index].get('course_Answers') as FormArray;
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

  public submit(): void {
    this.assessmentFormSubmitted = true;
    if (this.quizQuestioForm.valid) {
      this._helper.startSpinner();
      const payload = this.quizQuestioForm.value;
      payload.trainingInstructorId = this.loggedInUser.trainingProviderId;
     payload.courseId = +this.courseId;
     payload.course_AssessmentId = this.course_AssessmentId;
     console.log(payload)
      this._course.AddUpdateLearningAssessment(payload).subscribe({
        next: (res: any) => {
         if(res.status.isSuccessful) {
          this._helper.stopSpinner();
          console.log(res)
          this._helper.triggerSucessAlert('Course created successfully!!!')
          this.quizQuestioForm.reset();
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

}
