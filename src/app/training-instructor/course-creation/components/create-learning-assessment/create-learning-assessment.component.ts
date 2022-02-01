import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-learning-assessment',
  templateUrl: './create-learning-assessment.component.html',
  styleUrls: ['./create-learning-assessment.component.scss']
})
export class CreateLearningAssessmentComponent implements OnInit {
  public addLearningAssessmentForm!: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createLearningAssessmentForm();
  }

  public createLearningAssessmentForm() {
    this.addLearningAssessmentForm = this.fb.group({
      assessment_Title: ['', Validators.required],
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
    return this.addLearningAssessmentForm.get('addQuestionIndex') as FormArray;
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
