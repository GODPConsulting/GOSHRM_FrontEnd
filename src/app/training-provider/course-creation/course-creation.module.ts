import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseCreationComponent } from './components/course-creation/course-creation.component';
import { CourseCreationRoutingModule } from './course-creation-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AddCourseComponent } from './components/add-course/add-course.component';
import { CourseOutlineComponent } from './components/course-outline/course-outline.component';
import { CourseParticipantsComponent } from './components/course-participants/course-participants.component';
import { CourseAssessmentComponent } from './components/course-assessment/course-assessment.component';
import { CreateCourseAssessmentComponent } from './components/create-course-assessment/create-course-assessment.component';
import { CompetenceAssessmentComponent } from './components/competence-assessment/competence-assessment.component';
import { LearningAssessmentComponent } from './components/learning-assessment/learning-assessment.component';
import { CreateLearningAssessmentComponent } from './components/create-learning-assessment/create-learning-assessment.component';
import { CompetenceAssessmentDialogComponent } from './dialogs/competence-assessment-dialog/competence-assessment-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    CourseCreationComponent,
    AddCourseComponent,
    CourseOutlineComponent,
    CourseParticipantsComponent,
    CourseAssessmentComponent,
    CreateCourseAssessmentComponent,
    CompetenceAssessmentComponent,
    LearningAssessmentComponent,
    CreateLearningAssessmentComponent,
    CompetenceAssessmentDialogComponent
  ],
  imports: [
    CommonModule,
    CourseCreationRoutingModule,
    MatDialogModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class CourseCreationModule { }
