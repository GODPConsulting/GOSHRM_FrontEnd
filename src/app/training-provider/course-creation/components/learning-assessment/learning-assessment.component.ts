import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HelperService } from '@core/services/healper.service';
import { ResponseModel } from 'app/models/response.model';
import { Subscription } from 'rxjs';
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
  public quizQuestionForm!: FormGroup;
  public question: any;

  constructor(
    private _helper: HelperService,
    private _course: CourseCreationService,
    private _route: ActivatedRoute,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.courseId = this._route.snapshot.paramMap.get('id');
    this.getLearningAssessment();
    this.initQuestionForm();
  }

  initQuestionForm() {
    this.quizQuestionForm = this.fb.group({
      questionId: [this.question?.questionId],
      question_Varaible: [this.question?.question_Varaible, Validators.required],
      course_Answers: this.fb.array([
        this.fb.group({
          answer_Varaibles: [
            this.question?.course_Answers[0]?.answer_Varaibles, 
            Validators.required
          ],
          answerId: [this.question?.course_Answers[0]?.answerId],
          isAnswer: [this.question?.course_Answers[0]?.isAnswer]
        }),
        this.fb.group({
          answer_Varaibles: [
            this.question?.course_Answers[1]?.answer_Varaibles, 
            Validators.required
          ],
          answerId: [this.question?.course_Answers[1]?.answerId],
          isAnswer: [this.question?.course_Answers[1]?.isAnswer]
        }),
        this.fb.group({
          answer_Varaibles: [
            this.question?.course_Answers[2]?.answer_Varaibles, 
            Validators.required
          ],
          answerId: [this.question?.course_Answers[2]?.answerId],
          isAnswer: [this.question?.course_Answers[2]?.isAnswer]
        }),
        this.fb.group({
          answer_Varaibles: [
            this.question?.course_Answers[3]?.answer_Varaibles, 
            Validators.required
          ],
          answerId: [this.question?.course_Answers[3]?.answerId],
          isAnswer: [this.question?.course_Answers[3]?.isAnswer]
        }),
      ])
    })
  }

  get getOptions(): any {
    return this.quizQuestionForm.get('course_Answers') as FormArray;
  }

  

  public getLearningAssessment(): void {
    this._helper.startSpinner();
    this.isFetchingAssessment = true;
    this.sub.add(
      this._course.getLearningAssessments(this.courseId).subscribe({
        next: (res: any) => {
          this._helper.stopSpinner();
          this.isFetchingAssessment = false;
          this.assessments = res['learningAssessment_objs'][0].question;
          console.log(res, this.assessments)
        },
        error: (error: ResponseModel<null>) => {
          this._helper.stopSpinner();
          this.isFetchingAssessment = false;
          console.log(error);
        },
      })
    );
  }

  toggleEdit(question: any, id: any) {
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
    this.initQuestionForm();
    console.log(this.quizQuestionForm.value)
  }

  deleteQuestion(quetionId: number) {
    this.isEdit = !this.isEdit;
  }

  checked(questionId: any, answerId: any) {
    // console.log(questionId, answerId)
    return this.allAnswered.some(
      (answer: any) => answer.questionId == questionId && answer.answerId == answerId
    );
  }


}
