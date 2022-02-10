import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CurrentUserService } from '@core/services/current-user.service';
import { HelperService } from '@core/services/healper.service';
import { CourseCreationService } from '../../services/course-creation.service';

@Component({
  selector: 'app-create-course-assessment',
  templateUrl: './create-course-assessment.component.html',
  styleUrls: ['./create-course-assessment.component.scss']
})
export class CreateCourseAssessmentComponent implements OnInit {
  public quizQuestioForm!: FormGroup;
  public assessmentFormSubmitted: boolean = false;
  public loggedInUser: any;
  public courseId: any;
  public questionId: any = 0;
  public course_AssessmentId: any = 0;
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
      questions: this.fb.array([this.newQuestion])
    });
  }

  get newQuestion() {
    return this.fb.group({
      question: ['', Validators.required],
      answers: this.fb.array([
        this.fb.group({
          answer: ['', Validators.required],
          answerId: [0],
          isAnswer: [false]
        }),
        this.fb.group({
          answer: ['', Validators.required],
          answerId: [0],
          isAnswer: [false]
        }),
        this.fb.group({
          answer: ['', Validators.required],
          answerId: [0],
          isAnswer: [false]
        }),
        this.fb.group({
          answer: ['', Validators.required],
          answerId: [0],
          isAnswer: [false]
        })
      ])
    });
  }

  get getQuizQuestion(): any {
    return this.quizQuestioForm.get('questions') as FormArray;
  }

  getQuizAnswers(index: any): FormArray {
    // return this.quizForm.get('answers') as FormArray;
    return this.getQuizQuestion[index].get('answers') as FormArray;
  }

  addQuestion() {
    let entry = { ...this.getQuizQuestion };
    let answers: [] = entry.controls[0].get('answers').value;
    //check that there is at least one true value
    const atLeastOne = answers.filter((el: any) => {
      return el.isAnswer;
    });
    // if atLeastOne is equal to one, good
    if (atLeastOne.length == 1) {
      this.getQuizQuestion.push(this.newQuestion);
    } else if (atLeastOne.length < 1) {
      // Swal.fire({
      //   title: 'Error',
      //   icon: 'info',
      //   html:
      //     '<p>You need to select one of the options as the correct answer</p>'
      // });
    } else {
      // Swal.fire({
      //   title: 'Error',
      //   icon: 'info',
      //   html:
      //     '<p>Only one option can be selected as the right answer to a question</p>'
      // });
    }
  }

  removeQuestion(i: number) {
    if (i > 0) this.getQuizQuestion.removeAt(i);
  }

  public submit(): void {
    this.assessmentFormSubmitted = true;
    if (this.quizQuestioForm.valid) {
      this._helper.startSpinner();
      const payload = this.quizQuestioForm.get('questions')?.value[0];
      payload.trainingProviderId = this.loggedInUser.trainingProviderId;
     payload.courseId = 1;
    //  payload.courseId = this.courseId;
     payload.questionId = this.questionId;
     payload.course_AssessmentId = this.course_AssessmentId;
     console.log(payload)
      this._course.AddUpdateCourseAssessment(payload).subscribe({
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
