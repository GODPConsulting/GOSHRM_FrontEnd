import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { DataService } from "src/app/services/data.service";
import { PerformanceManagementService } from "src/app/services/performance-management.service";
import { LoadingService } from "../../../../services/loading.service";

declare const $: any;

@Component({
  selector: "app-appraisal-objectives",
  templateUrl: "./appraisal-objectives.component.html",
  styleUrls: ["./appraisal-objectives.component.css"],
})
export class AppraisalObjectivesComponent implements OnInit {
  appraisalObjectives: FormGroup;
  objectives: any[] = [];
  selectedId: number[] = [];
  staffId: any;
  user: any;
  targetDate: any[] = [];
  kpiWeight: any;
  dtOptions: any;

  constructor(
    private formbuilder: FormBuilder,
    private performanceManagementService: PerformanceManagementService,
    private router: Router,
    private dataService: DataService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem("userDetails"));
    if (user) {
      this.staffId = user.staffId;
    }
    this.initializeForm();
    this.getAppraisalObjectives(this.staffId);
    this.getTargetDate();
    this.dtOptions = {
      drawCallback(setting) {
        console.log("setting is  ", setting);
        const api = this.api();
        const rows = api.rows({ page: "current" }).nodes();
        console.log("rows is ", rows);
        let last = null;
        const columIndex = 0;
        api
          .column(columIndex, { page: "current" })
          .data()
          .each(function (group, i) {
            if (last !== group) {
              $(rows)
                .eq(i)
                .before(
                  '<tr style="color: crimson !important;background-color: blanchedalmond;" class="groupColumns"><td style="display: none;"></td><td>' +
                    "        " +
                    group +
                    "</td><td></td></tr>"
                );
              last = group;
            }
          });
      },
    };
  }
  initializeForm() {
    this.appraisalObjectives = this.formbuilder.group({
      id: [0],
      kpIsNameList: [""],
      endDate: [""],
      weight: [0],
    });
  }

  getAppraisalObjectives(id) {
    this.loadingService.show();
    return this.performanceManagementService
      .getAppraisalObjectives(id)
      .subscribe(
        (data) => {
          this.loadingService.hide();
          this.objectives = data.empNotPermitedList[0].kpIsNameList;
          this.kpiWeight = data.empNotPermitedList[0].weight;
        },
        (err) => {
          this.loadingService.hide();
        }
      );
  }
  getTargetDate() {
    return this.performanceManagementService
      .getAppraisalCycleByStatus()
      .subscribe(
        (data) => {
          this.targetDate = data.setupList[0].endDate;
        },
        (err) => {}
      );
  }

  closeAppraisalObjectivesModal() {
    $("#appraisal_Objectives_modal").modal("hide");
  }

  addItemId($event: Event, id: any) {}
}
