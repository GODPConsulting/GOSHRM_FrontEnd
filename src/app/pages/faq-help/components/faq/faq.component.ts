import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HelperService } from '@core/services/healper.service';
import { DialogModel } from '@shared/components/models/dialog.model';
import { ResponseModel } from 'app/models/response.model';
import { Subscription } from 'rxjs';
import { FaqDialogComponent } from '../../dialogs/faq-dialog/faq-dialog.component';
import { FaqDTO } from '../../models/faq.model';
import { FaqHelpService } from '../../services/faq-help.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  public sub: Subscription = new Subscription();
  public isFetchingFaq: boolean = false;
  public faqs: FaqDTO[] = [];

  constructor(
    public dialog: MatDialog,
    private _faq: FaqHelpService,
    private _helper: HelperService
  ) { }

  ngOnInit(): void {
    this.getAllFaqs();
  }

  public getAllFaqs(): void {
    this._helper.startSpinner();
    this.isFetchingFaq = true;
    this.sub.add(
      this._faq.getFaq().subscribe({
        next: (res: any) => {
          this._helper.stopSpinner();
          this.isFetchingFaq = false;
          this.faqs = res['faqs'];
          // console.log(res, this.faqs)
        },
        error: (error: ResponseModel<null>) => {
          this._helper.stopSpinner();
          this.isFetchingFaq = false;
          console.log(error);
        },
      })
    );
  }

  public openDialog(
    payload: { isEditing?: boolean; editObject?: any } | any
  ): void {
    let object: DialogModel<any> = payload;
    const dialogRef = this.dialog.open(FaqDialogComponent, {
      data: object,
    });
    console.log(payload)
    dialogRef.componentInstance.event.subscribe(
      (event: DialogModel<any>) => {
        if (event?.isEditing) {
         
        } else {

        }
      }
    );
  }

}
