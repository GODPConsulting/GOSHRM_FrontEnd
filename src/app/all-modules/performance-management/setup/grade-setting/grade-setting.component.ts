import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { Console } from "console";
import { Subject, Subscription } from "rxjs";
import { PerformanceManagementService } from "src/app/services/performance-management.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";
import { LoadingService } from "../../../../services/loading.service";
import {
  IGradeSettings,
  ISearchColumn,
} from "../../../../interface/interfaces";

declare const $: any;

@Component({
  selector: "app-grade-setting",
  templateUrl: "./grade-setting.component.html",
  styleUrls: ["./grade-setting.component.css"],
})
export class GradeSettingComponent implements OnInit {
  gradeSettingForm: FormGroup;
  loading: boolean;
  gradeSettings: any[] = [];
  selectedId: number[] = [];
  spinner: boolean;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  cols: ISearchColumn[] = [];
  selectedGradeSettings: IGradeSettings[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private performanceManagementService: PerformanceManagementService,
    private router: Router,
    private utilitiesService: UtilitiesService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getSavedGradeSetting();
  }

  initializeForm() {
    this.gradeSettingForm = this.formBuilder.group({
      id: [0],
      minimum: [0],
      maximum: [0],
      grade: [""],
      description: [""],
    });
  }

  addGradeSetting(gradeSettingForm): Subscription {
    const payload = gradeSettingForm.value;
    this.spinner = true;
    return this.performanceManagementService.addGradeSetting(payload).subscribe(
      (res) => {
        this.spinner = false;
        const message = res["status"].message.friendlyMessage;
        if (res["status"].isSuccessful) {
          swal.fire("GOS HRM", message, "success").then(() => {
            $("#add_grade_setting").modal("hide");
            this.initializeForm();
            this.getSavedGradeSetting();
          });
        }
      },
      (err) => {
        this.spinner = false;
        this.utilitiesService.showMessage(err, "error");
        // const message = err.status.message.friendlyMessage;
        // swal.fire('GOS HRM', message, 'success')
      }
    );
  }

  closeGradeSettingModal() {
    $("#add_grade_setting").modal("hide");
  }
  getSavedGradeSetting() {
    this.loadingService.show();
    return this.performanceManagementService.getGradeSettings().subscribe(
      (data) => {
        this.loadingService.hide();
        this.gradeSettings = data.setupList;
        this.dtTrigger.next();
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  checkAllBoxes(event: Event) {
    this.selectedId = this.utilitiesService.checkAllBoxes(
      event,
      this.gradeSettings
    );
  }
  editGradeSetting(gradeSetting) {
    this.gradeSettingForm.patchValue({
      id: gradeSetting.id,
      minimum: gradeSetting.minimum,
      maximum: gradeSetting.maximum,
      grade: gradeSetting.grade,
      description: gradeSetting.description,
    });
    $("#add_grade_setting").modal("show");
  }
  addItemId(event: Event, id: number) {
    this.utilitiesService.deleteArray(event, id, this.selectedId);
  }

  delete() {
    let payload: object;
    if (this.selectedGradeSettings.length === 0) {
      return swal.fire("Error", "Select items to delete", "error");
    }
    this.selectedGradeSettings.map((item) => {
      this.selectedId.push(item.id);
    });
    payload = {
      itemIds: this.selectedId,
    };
    swal
      .fire({
        title: "Are you sure you want to delete this record?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!",
      })
      .then((result) => {
        if (result.value) {
          this.loadingService.show();
          return this.performanceManagementService
            .deleteGradeSetting(payload)
            .subscribe(
              (res) => {
                this.loadingService.hide();
                const message = res.status.message.friendlyMessage;
                if (res.status.isSuccessful) {
                  swal.fire("GOSHRM", message, "success").then(() => {
                    this.getSavedGradeSetting();
                  });
                } else {
                  swal.fire("GOSHRM", message, "error");
                }
              },
              (err) => {
                this.loadingService.hide();
                const message = err.status.message.friendlyMessage;
                swal.fire("GOSHRM", message, "error");
              }
            );
        }
      });
    this.selectedGradeSettings = [];
  }
}
