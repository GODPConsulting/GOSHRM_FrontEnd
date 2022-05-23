import { Output, EventEmitter } from '@angular/core';
// import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HelperService } from '@core/services/healper.service';
import { DialogModel } from '@shared/components/models/dialog.model';
import { Subscription } from 'rxjs';
import { CourseCreationService } from '../../services/course-creation.service';

@Component({
  selector: 'app-assessment-score-dialogs',
  templateUrl: './assessment-score-dialogs.component.html',
  styleUrls: ['./assessment-score-dialogs.component.scss']
})
export class AssessmentScoreDialogsComponent implements OnInit {
  @ViewChild('close') close!: ElementRef;
  public sub: Subscription = new Subscription();
  public score: any;
  
  @Output() event: EventEmitter<{
    editObject?: any;
    isEditing: boolean;
  }> = new EventEmitter<{ editObject?: any; isEditing: boolean }>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<any>,
    private _helper: HelperService,
    private _course: CourseCreationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getScore();
  }

  public getScore() {
    const payload = {
      courseId: this.data?.editObject?.courseId,
      assessmentId: this.data?.editObject?.assessmentId
    }
    console.log(payload);
    this.sub.add(
      this._course.getAssessmentScore(payload).subscribe({
        next: (res: any) => {
          console.log(res);
          let obtainableSocre = res.score.obtainableSocre;
          let obtainedScore = res.score.obtainedScore;
          this.score = ((obtainedScore/obtainableSocre)*100)
        },
        error: (error: any) => {
          this._helper.stopSpinner();
          console.log(error);
        },
      })
    );
  }

  public backtocourse() {
    this.router.navigate([`/courses/course-detail/${this.data.editObject.courseId}`]);
  }

  public retakeAssessment() {
    const payload = {
      courseId: this.data?.editObject?.courseId,
      assessmentId: this.data?.editObject?.assessmentId
    }
    console.log(payload);
    this.sub.add(
      this._course.retakeAssessment(payload).subscribe({
        next: (res: any) => {
          console.log(res);
        },
        error: (error: any) => {
          this._helper.stopSpinner();
          console.log(error);
        },
      })
    );
  }

}

