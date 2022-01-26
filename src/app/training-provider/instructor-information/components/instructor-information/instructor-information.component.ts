import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-instructor-information',
  templateUrl: './instructor-information.component.html',
  styleUrls: ['./instructor-information.component.scss']
})
export class InstructorInformationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  // public getUserPayouts(): void {
  //   this.isFetchingPayout = true;
  //   this.sub.add(
  //     this._payout.getPayout('1').subscribe({
  //       next: (res: any) => {
  //         this.isFetchingPayout = false;
  //         this.payouts = res['payoutSetupTypes'];
  //         console.log(res, this.payouts)
  //       },
  //       error: (error: ResponseModel<null>) => {
  //         this.isFetchingPayout = false;
  //         console.log(error);
  //       },
  //     })
  //   );
  // }

}
