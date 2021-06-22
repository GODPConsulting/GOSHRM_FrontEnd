import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { PerformanceManagementService } from "src/app/services/performance-management.service";
import { UtilitiesService } from "src/app/services/utilities.service";

import swal from "sweetalert2";
import { LoadingService } from "../../../../services/loading.service";
import { IKpis, ISearchColumn } from "../../../../interface/interfaces";

declare const $: any;

@Component({
  selector: "app-key-performance-indicators",
  templateUrl: "./key-performance-indicators.component.html",
  styleUrls: ["./key-performance-indicators.component.css"],
})
export class KeyPerformanceIndicatorsComponent
  implements OnInit, AfterViewInit {
  keyPerformanceIndicatorForm: FormGroup;
  loading: boolean;
  categories: any[] = [];
  kpIndicators: Array<[]> = [];
  selectedId: number[] = [];
  spinner: boolean = false;
  kpiUploadForm: FormGroup;
  @ViewChild("fileInput") fileInput: ElementRef;
  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject<any>();
  selectedKpis: IKpis[] = [];
  cols: ISearchColumn[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private performanceManagementService: PerformanceManagementService,
    private utilitiesService: UtilitiesService,
    private router: Router,
    private loadingService: LoadingService
  ) {
    this.kpiUploadForm = this.formBuilder.group({
      uploadInput: [""],
    });
  }

  ngOnInit(): void {
    this.initializeForm();
    this.getKpiCategory();
    this.getSavedKPIndicators();
  }

  addKPIndicator(keyPerformanceIndicatorForm) {
    const payload = keyPerformanceIndicatorForm.value;
    payload.kpiCategoryId = +payload.kpiCategoryId;
    payload.resultFromExternal = +payload.resultFromExternal;
    this.loading = true;
    this.performanceManagementService.addKPIndicator(payload).subscribe(
      (data) => {
        this.loading = false;
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("Success", message, "success");
          this.getSavedKPIndicators();
          this.initializeForm();
          $("#kp_indicator_modal").modal("hide");
        } else {
          swal.fire("GOSHRM", message, "error");
        }
      },
      (err) => {
        this.loading = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }
  downloadFile() {
    this.performanceManagementService.downloadKPIndicators().subscribe(
      (res) => {
        const data = res;
        this.utilitiesService.byteToFile(
          data,
          "Key Performance Indicator.xlsx"
        );
      },
      (err) => {}
    );
  }
  uploadKPIndicators() {
    if (!this.kpiUploadForm.get("uploadInput").value) {
      return swal.fire("Error", "Select a file", "error");
    }
    const formData = new FormData();
    formData.append("uploadInput", this.kpiUploadForm.get("uploadInput").value);
    this.spinner = true;
    return this.performanceManagementService
      .uploadKPIndicators(formData)
      .subscribe(
        (res) => {
          this.spinner = false;
          const message = res.status.message.friendlyMessage;

          if (res.status.isSuccessful) {
            swal.fire("GOSHRM", message, "success");
            this.fileInput.nativeElement.value = "";
            $("#upload_kp_indicator").modal("hide");
          } else {
            swal.fire("GOSHRM", message, "error");
          }
        },
        (err) => {
          this.spinner = false;
          const message = err.status.message.friendlyMessage;
          swal.fire("GOSHRM", message, "error");
        }
      );
  }
  initializeForm() {
    this.keyPerformanceIndicatorForm = this.formBuilder.group({
      id: [0],
      kpiCategoryId: [0],
      kpi: [""],
      description: [""],
      resultFromExternal: [0],
    });
  }

  getKpiCategory() {
    return this.performanceManagementService.getKpiCategory().subscribe(
      (data) => {
        this.categories = data["setupList"];
      },
      (err) => {}
    );
  }
  getSavedKPIndicators() {
    this.loadingService.show();
    return this.performanceManagementService.getKPIndicators().subscribe(
      (data) => {
        this.loadingService.hide();
        this.kpIndicators = data["setupList"];
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  closeKPIndicatorModal() {
    $("#kp_indicator_modal").modal("hide");
    this.initializeForm();
  }
  openUploadModal() {
    this.initializeForm();
    $("#upload_kp_indicator").modal("show");
  }
  closeModal() {
    $("#upload_kp_indicator").modal("hide");
  }

  checkAllBoxes(event: Event) {
    this.selectedId = this.utilitiesService.checkAllBoxes(
      event,
      this.kpIndicators
    );
  }
  addItemId(event: Event, id: number) {
    this.utilitiesService.deleteArray(event, id, this.selectedId);
  }

  editKPIndicator(kpIndicator) {
    this.keyPerformanceIndicatorForm.patchValue({
      id: kpIndicator.id,
      kpiCategoryId: kpIndicator.kpiCategoryId,
      kpi: kpIndicator.kpi,
      description: kpIndicator.description,
    });
    $("#kp_indicator_modal").modal("show");
  }

  delete() {
    let payload: object;
    if (this.selectedKpis.length === 0) {
      return swal.fire("Error", "Select items to delete", "error");
    }
    this.selectedKpis.map((item) => {
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
            .deleteKPIndicator(payload)
            .subscribe(
              (res) => {
                this.loadingService.hide();
                const message = res.status.message.friendlyMessage;
                if (res.status.isSuccessful) {
                  swal.fire("GOSHRM", message, "success").then(() => {
                    this.getSavedKPIndicators();
                  });
                } else {
                  swal.fire("GOSHRM", message, "error");
                }
              },
              (err) => {
                this.loadingService.hide();
                this.utilitiesService.showMessage(err, "error");
              }
            );
        }
      });
    this.selectedKpis = [];
  }

  ngAfterViewInit(): void {
    // this.dtTrigger.next();
  }
  onSelectedFile(event: Event, form: FormGroup) {
    this.utilitiesService.uploadFileValidator(event, form, "hr");
  }
}
