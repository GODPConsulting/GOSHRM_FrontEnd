import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-course-assessment',
  templateUrl: './create-course-assessment.component.html',
  styleUrls: ['./create-course-assessment.component.scss']
})
export class CreateCourseAssessmentComponent implements OnInit {
  public addCourseAssessmentForm!: FormGroup;
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createCourseAssessmentForm();
  }

  public createCourseAssessmentForm() {
    this.addCourseAssessmentForm = this.fb.group({
      questionsIndex: this.fb.array([this.addNewQuestion])
    })
  }

  get addNewQuestion() {
    return this.fb.group({
        question: ['', Validators.required],
        answers: this.fb.array([
          this.fb.group({
              answer: ['', Validators.required],
              isAnswer: [false]
          }),
          this.fb.group({
              answer: ['', Validators.required],
              isAnswer: [false]
          }),
          this.fb.group({
              answer: ['', Validators.required],
              isAnswer: [false]
          }),
          this.fb.group({
              answer: ['', Validators.required],
              isAnswer: [false]
          }),
        ]),
    })
  }

  get QuestionItems(): FormArray {
    return this.addCourseAssessmentForm.get('questionsIndex') as FormArray;
  }

  getQuestionAnswers(index: any): FormArray {
    return this.QuestionItems.get('answers') as FormArray;
  }


  public removeQuestion(i: number) {
    if(i === 0) {return;}
    this.QuestionItems.removeAt(i);
  }


}
