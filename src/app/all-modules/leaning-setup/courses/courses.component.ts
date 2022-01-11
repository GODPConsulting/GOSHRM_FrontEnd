import { Component, OnInit } from "@angular/core";
declare const $: any;

@Component({
  selector: "app-courses",
  templateUrl: "./courses.component.html",
  styleUrls: ["./courses.component.css"],
})

export class CoursesComponent implements OnInit {
   public spinner: boolean = false;
   public showCurrentPassword: boolean = false;

  constructor() {
  }

  ngOnInit(): void {}
  
}
