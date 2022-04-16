import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CourseOutlineDialogComponent } from './dialogs/course-outline-dialog/course-outline-dialog.component';
import { NgRatingBarModule } from 'ng-rating-bar';
import { ParticipantDialogComponent } from './dialogs/participant-dialog/participant-dialog.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { CourseSectionComponent } from './components/course-section/course-section.component';
import { CourseSectionDialogComponent } from './dialogs/course-section-dialog/course-section-dialog.component';
import { SceduleClassDialogComponent } from './dialogs/scedule-class-dialog/scedule-class-dialog.component';
import { AddParticipantComponent } from './dialogs/add-participant/add-participant.component';


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
    CompetenceAssessmentDialogComponent,
    CourseOutlineDialogComponent,
    ParticipantDialogComponent,
    CourseSectionComponent,
    CourseSectionDialogComponent,
    SceduleClassDialogComponent,
    AddParticipantComponent
  ],
  imports: [
    CommonModule,
    CourseCreationRoutingModule,
    MatDialogModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    NgRatingBarModule,
    AngularEditorModule
  ],
  providers: [
    DatePipe
  ]
})
export class CourseCreationModule { }
