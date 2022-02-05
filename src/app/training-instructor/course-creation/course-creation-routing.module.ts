import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCourseComponent } from './components/add-course/add-course.component';
import { CompetenceAssessmentComponent } from './components/competence-assessment/competence-assessment.component';
import { CourseAssessmentComponent } from './components/course-assessment/course-assessment.component';
import { CourseCreationComponent } from './components/course-creation/course-creation.component';
import { CourseOutlineComponent } from './components/course-outline/course-outline.component';
import { CreateCourseAssessmentComponent } from './components/create-course-assessment/create-course-assessment.component';
import { CreateLearningAssessmentComponent } from './components/create-learning-assessment/create-learning-assessment.component';
import { LearningAssessmentComponent } from './components/learning-assessment/learning-assessment.component';
import { AddCourseResolver } from './resolvers/add-course.resolver';

const routes: Routes = [
    { 
        path:'',
        component: CourseCreationComponent,
    },
    {
        path: 'add-course',
        component: AddCourseComponent,
        resolve: {resolveData: AddCourseResolver}
    },
    {
        path: 'competence-assessment',
        component: CompetenceAssessmentComponent
    },
    {
        path: 'course-outline/:courseId',
        component: CourseOutlineComponent
    },
    {
        path: 'create-learning-assessment',
        component: CreateLearningAssessmentComponent
    },
    {
        path: 'create-course-assessment',
        component: CreateCourseAssessmentComponent
    },
    {
        path: 'course-assessment',
        component: CourseAssessmentComponent
    },
    {
        path: 'learning-assessment',
        component: LearningAssessmentComponent
    },
    {
        path: '',
        redirectTo: 'course-creation',
        pathMatch: 'full',
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourseCreationRoutingModule {}
