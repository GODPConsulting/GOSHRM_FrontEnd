import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PerformanceManagementService } from "src/app/services/performance-management.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";

import { Subject } from "rxjs";
import { LoadingService } from "../../../../services/loading.service";
import { IPointSetting, ISearchColumn } from "../../../../interface/interfaces";
declare const $: any;
@Component({
  selector: "app-point-settings",
  templateUrl: "./point-settings.component.html",
  styleUrls: ["./point-settings.component.css"],
})
export class PointSettingsComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  cardFormTitle: string;
  spinner: boolean = false;
  @ViewChild("fileInput")
  fileInput: ElementRef;
  @Input() staffId: number;
  performancePointSettings: any = {};

  pointSettings: any[] = [];
  selectedId: number[] = [];
  pointName: any;
  point: any;
  description: any;
  pointSettingsForm: FormGroup;
  dtTrigger: Subject<any> = new Subject();
  cols: ISearchColumn[] = [];
  selectedPoints: IPointSetting[] = [];
  file: File;
  constructor(
    private performanceManagementService: PerformanceManagementService,
    private utilitiesService: UtilitiesService,
    private loadingService: LoadingService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.cols = [
      {
        header: "pointName",
        field: "pointName",
      },
      {
        header: "point",
        field: "point",
      },
      {
        header: "description",
        field: "description",
      },
    ];
    this.getPointSettings();
    this.cardFormTitle = "Add Point Settings";
    this.initialiseForm();
  }
  initialiseForm() {
    this.pointSettingsForm = this.fb.group({
      id: [0],
      pointName: [""],
      point: [""],
      description: [""],
    });
  }
  submitPointSettingsForm(form: FormGroup) {
    const payload = form.value;
    this.spinner = true;
    return this.performanceManagementService
      .postPointSettings(payload)
      .subscribe(
        (res) => {
          this.spinner = false;
          const message = res.status.message.friendlyMessage;
          if (res.status.isSuccessful) {
            swal.fire("GOSHRM", message, "success");
            $("#point_settings_modal").modal("hide");
            this.initialiseForm();
          }

          this.getPointSettings();
        },
        (err) => {
          this.spinner = false;
          const message = err.status.message.friendlyMessage;
          swal.fire("GOSHRM", message, "error");
        }
      );
  }

  getPointSettings() {
    // this.loadingService.show();
    this.performanceManagementService.getPointSettings().subscribe(
      (data) => {
        // this.loadingService.hide();
        this.pointSettings = data;
        this.dtTrigger.next();
      },
      (err) => {
        // this.loadingService.hide();
      }
    );
  }

  edit(row) {
    this.cardFormTitle = "Edit Point Settings";
    this.pointSettingsForm.patchValue({
      id: row.id,
      pointName: row.pointName,
      point: row.point,
      description: row.description,
    });
    $("#point_settings_modal").modal("show");
  }
  hack(val: any[]) {
    return Array.from(val);
  }

  onSelectedFile(event: Event, form: FormGroup) {
    this.utilitiesService.uploadFileValidator(event, form, this.staffId);
  }
  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
  }

  delete() {
    let payload: object;
    if (this.selectedPoints.length === 0) {
      return swal.fire("Error", "Select items to delete", "error");
    }
    this.selectedPoints.map((item) => {
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
          // this.loadingService.show();
          return this.performanceManagementService
            .deletePointSettings(payload)
            .subscribe(
              (res) => {
                // this.loadingService.hide();
                const message = res.status.message.friendlyMessage;
                if (res.status.isSuccessful) {
                  swal.fire("GOSHRM", message, "success").then(() => {
                    this.getPointSettings();
                  });
                } else {
                  swal.fire("GOSHRM", message, "error");
                }
              },
              (err) => {
                // this.loadingService.hide();
                const message = err.status.message.friendlyMessage;
                swal.fire("GOSHRM", message, "error");
              }
            );
        }
      });
    this.selectedPoints = [];
  }

  addItemId(event, id: number) {
    if (event.target.checked) {
      if (!this.selectedId.includes(id)) {
        this.selectedId.push(id);
      }
    } else {
      this.selectedId = this.selectedId.filter((_id) => {
        return _id !== id;
      });
    }
  }

  checkAll(event) {
    if (event.target.checked) {
      this.selectedId = this.performancePointSettings.map((item) => {
        return item.id;
      });
    } else {
      this.selectedId = [];
    }
  }

  closeModal() {
    this.initialiseForm();
    $("#point_settings_modal").modal("hide");
  }
  handleFileInput(event) {
    this.file = event.target.files[0];
  }
  uploadPointSettings() {
    if (!this.file) {
      return this.utilitiesService.showError("Select an excel file to upload");
    }
    if (
      this.file.type !=
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      return this.utilitiesService.showError("Only Excel file is allowed");
    }
    const formData = new FormData();
    formData.append("file", this.file, this.file.name);
    console.log(formData);
    return this.performanceManagementService.uploadPoints(formData).subscribe(
      (res) => {
        console.log(res);
        if (res.status.isSuccessful) {
          return this.utilitiesService.showMessage(res, "success").then(() => {
            this.fileInput.nativeElement.value = "";
            this.getPointSettings();
          });
        } else {
          return this.utilitiesService.showMessage(res, "error");
        }
      },
      (err) => {
        console.log(err);
        return this.utilitiesService.showMessage(err, "error");
      }
    );
  }

  downloadPointSettings() {
    return this.performanceManagementService.downloadPointSettings().subscribe(
      (data) => {
        return this.utilitiesService.byteToFile(data, "Point Settings.xlsx");
      },
      (err) => {
        return this.utilitiesService.showMessage(err, "error");
      }
    );
  }
}
