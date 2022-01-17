import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { LmsService } from "src/app/services/lms.service";
declare const $: any;

@Component({
  selector: "app-courses",
  templateUrl: "./courses.component.html",
  styleUrls: ["./courses.component.css"],
})

export class CoursesComponent implements OnInit {
  public sub: Subscription = new Subscription();
   public spinner: boolean = false;
   public isProviderListReady: boolean = false;
   public traineeProviderList: any = {
    "courseId": 0,
    "upload_Date": "",
    "training_Provider": "",
    "course_Title": "",
    "no_Of_Views": 0,
    "ratings": "",
    "createdOn": "2022-01-14T22:09:34.474Z",
  }

  constructor(
    private _lmsService: LmsService
  ) {
  }

  ngOnInit(): void {}

  getTrainingProviders() {
    this.sub.add(
      this._lmsService.getAllTraineeSetup().subscribe({
        next: (res) => {
          this.isProviderListReady = false;
          this.traineeProviderList = res;
          console.log(res);
        },
        error: (error) => {
          this.isProviderListReady = false;
          console.log(error);
        },
      })
    );
  }
  
}
