import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-course-assessment',
  templateUrl: './create-course-assessment.component.html',
  styleUrls: ['./create-course-assessment.component.scss']
})
export class CreateCourseAssessmentComponent implements OnInit {
  public addCoiurseAssessmentForm!: FormGroup;
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createCourseAssessmentForm();
  }

  public createCourseAssessmentForm() {
    this.addCoiurseAssessmentForm = this.fb.group({
      addQuestionIndex: this.fb.array([
        this.fb.group({
            question_Title: [''],
            option1: [''],
            option2: [''],
            // option3: [''],
            // option4: [''],
        })
      ])
    })
  }

  get facilitatorItems() {
    return this.addCoiurseAssessmentForm.get('addQuestionIndex') as FormArray;
  }

  public addNewQuestion() {
    this.facilitatorItems.push(this.fb.group({
        question_Title: [''],
        option1: [''],
        option2: [''],
        // option3: [''],
        // option4: [''],
    }))
  }

  public removeQuestion(i: number) {
    if(i === 0) {return;}
    this.facilitatorItems.removeAt(i);
  }


}
