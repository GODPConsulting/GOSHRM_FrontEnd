import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { HelperService } from '@core/services/healper.service';
import { DialogModel } from '@shared/components/models/dialog.model';
import { ResponseModel } from 'app/models/response.model';
import { Subscription } from 'rxjs';
import { CompetenceAssessmentDialogComponent } from '../../dialogs/competence-assessment-dialog/competence-assessment-dialog.component';
import { CourseCreationService } from '../../services/course-creation.service';

@Component({
  selector: 'app-competence-assessment',
  templateUrl: './competence-assessment.component.html',
  styleUrls: ['./competence-assessment.component.scss']
})
export class CompetenceAssessmentComponent implements OnInit {
  public sub: Subscription = new Subscription();
  public courseId: any;
  public competencies: any[] = [];
  public SelectedCompetencies: any[] = [];
  public isFetchingCompetencies: boolean = false
  
  constructor(
    public dialog: MatDialog,
    private _course: CourseCreationService,
    private _helper: HelperService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.courseId = this._route.snapshot.paramMap.get('courseId');
    this.getAllCompetencies();
  }

  public getAllCompetencies(): void {
    this._helper.startSpinner();
    this.isFetchingCompetencies = true;
    this.sub.add(
      this._course.getCompetencyByCourse(this.courseId, '').subscribe({
        next: (res: any) => {
          this._helper.stopSpinner();
          this.isFetchingCompetencies = false;
          this.competencies = res['courseCompetenceAssessments'];
          console.log(res, this.competencies)
        },
        error: (error: ResponseModel<null>) => {
          this._helper.stopSpinner();
          this.isFetchingCompetencies = false;
          console.log(error);
        },
      })
    );
  }

  public openDialog(
    payload: { isEditing?: boolean; editObject?: any } | any
  ): void {
    let object: DialogModel<any> = payload;
    const dialogRef = this.dialog.open(CompetenceAssessmentDialogComponent, {
      data: object,
    });
    console.log(object)
    dialogRef.componentInstance.event.subscribe(
      (event: DialogModel<any>) => {
        if (event?.isEditing) {
          const index = this.competencies.findIndex((leave: any) => {
            return leave.id == event?.editObject?.competenceId;
          });
          this.competencies[index] = event?.editObject;
        } else {
          this.competencies = [event?.editObject, ...this.competencies];
        }
      }
    );
  }

  public selectDeselectOutline(competence: any) {
    this.SelectedCompetencies.includes(competence)
      ? (this.SelectedCompetencies = this.SelectedCompetencies.filter((c: any) => c!== competence))
      : this.SelectedCompetencies.push(competence);
    console.log(this.SelectedCompetencies)
  }

  public deleteCompentency(SelectedCompetencies: any): void {
    const competenceIds = SelectedCompetencies.map((c: any) => c.competenceId)
    const payload = {
      comepetenceAssement:competenceIds
    };
    console.log(payload);
    if (payload.comepetenceAssement.length > 0) {
      this._helper.startSpinner();
     console.log(payload)
      this._course.deleteCompetence(payload).subscribe({
        next: (res: any) => {
         if(res.status.isSuccessful) {
          this._helper.stopSpinner();
          console.log(res)
          this._helper.triggerSucessAlert('Course created successfully!!!')
          this.getAllCompetencies();
         } else {
           this._helper.stopSpinner();
           this._helper.triggerErrorAlert(res?.status?.message?.friendlyMessage)
         }
        },
        error: (error: HttpErrorResponse) => {
          this._helper.stopSpinner();
          console.log(error);
        },
      });
    }
  }

}
