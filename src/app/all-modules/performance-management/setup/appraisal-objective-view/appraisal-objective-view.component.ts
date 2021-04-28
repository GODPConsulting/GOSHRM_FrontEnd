import { Component, OnInit } from "@angular/core";
import { LoadingService } from "../../../../services/loading.service";

@Component({
  selector: "app-appraisal-objective-view",
  templateUrl: "./appraisal-objective-view.component.html",
  styleUrls: ["./appraisal-objective-view.component.css"],
})
export class AppraisalObjectiveViewComponent implements OnInit {
  constructor(private loadingService: LoadingService) {}

  ngOnInit(): void {}
}
