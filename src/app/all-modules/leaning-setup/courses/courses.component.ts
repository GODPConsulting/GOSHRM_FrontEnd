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
  public dtOptions: DataTables.Settings = {};
   public spinner: boolean = false;
   public isProviderListReady: boolean = false;
   profile: any;
  companyId: number;
   public runningCourses: any[] =[];

  constructor(
    private _lmsService: LmsService
  ) {
  }

  ngOnInit(): void {
    this.profile = JSON.parse(localStorage.getItem('userDetails'));
    this.companyId = this.profile.companyId;
    this.getTrainingProviders();
  }

  getTrainingProviders() {
    this.sub.add(
      this._lmsService.getAllRunningCourses(this.companyId).subscribe({
        next: (res) => {
          this.isProviderListReady = false;
          this.runningCourses = res['coursesSetupTypes'];
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
