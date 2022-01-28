import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss']
})
export class AddCourseComponent implements OnInit {
  public addCourseForm!: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initAddCourseForm();
  }

  initAddCourseForm() {
    this.addCourseForm = this.fb.group({
      training_Name: [''],
      training_Objective: [''],
      training_Requirements: [''],
      training_Transcript: [''],
      training_Details: [''],
      difficulty_Level: [''],
      expected_Competence: [''],
      category: [''],
      segremented_Participants: [''],
      delivery_Type: [''],
      duration: [''],
      cost: [''],
      facilitator: [''],
      discount_Rate: [''],
      currency: [''],
      welcome_message: [''],
      competence_assessment: [''],
      congration_message: [''],
      images: [''],
      other_Comments: [''],
    })
  }

}
