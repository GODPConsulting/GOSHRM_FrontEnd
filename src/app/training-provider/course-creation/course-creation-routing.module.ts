import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCourseComponent } from './components/add-course/add-course.component';
import { CompetenceAssessmentComponent } from './components/competence-assessment/competence-assessment.component';
import { CourseCreationComponent } from './components/course-creation/course-creation.component';
import { CourseOutlineComponent } from './components/course-outline/course-outline.component';
import { CreateLearningAssessmentComponent } from './components/create-learning-assessment/create-learning-assessment.component';

const routes: Routes = [
    { 
        path:'',
        component: CourseCreationComponent,
    },
    {
        path: 'add-course',
        component: AddCourseComponent
    },
    {
        path: 'competence-assessment',
        component: CompetenceAssessmentComponent
    },
    {
        path: 'course-outline',
        component: CourseOutlineComponent
    },
    {
        path: 'create-learning-assessment',
        component: CreateLearningAssessmentComponent
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
