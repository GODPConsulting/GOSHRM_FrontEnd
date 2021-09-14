import { data } from "jquery";
import { Validators } from "@angular/forms";
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { PerformanceManagementService } from "src/app/services/performance-management.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";

import { Subject } from "rxjs";
import { LoadingService } from "../../../../services/loading.service";
import { DataTableDirective } from "angular-datatables";
import { IKpiCategory, ISearchColumn } from "../../../../interface/interfaces";
declare const $: any;
@Component({
  selector: "app-kpi-category",
  templateUrl: "./kpi-category.component.html",
  styleUrls: ["./kpi-category.component.css"],
})
export class KpiCategoryComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  cardFormTitle: string;
  spinner: boolean = false;
  onclick: boolean = false;
  modelDisabled: boolean = true;
  hrDisabled: boolean = true;
  allLocation;
  selectReview;

  @ViewChild("fileInput")
  fileInput: ElementRef;

  @Input() staffId: number;

  //Form
  kpiCategoryForm: FormGroup;

  performanceKpiCategory: any = {};

  kpiCategory: any[] = [];
  selectedId: number[] = [];
  employeePermitted: string = "";
  name: string = "";
  description: string = "";
  weightModel: string = "";
  hrSelectReviewer: string = "";
  currentUserId: number;
  id: number = 0;
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;
  cols: ISearchColumn[] = [];
  selectedKpi: IKpiCategory[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private performanceManagementService: PerformanceManagementService,
    private utilitiesService: UtilitiesService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.cols = [
      {
        header: "name",
        field: "name",
      },
      {
        header: "employeePermittedName",
        field: "employeePermittedName",
      },
      {
        header: "weightModelName",
        field: "weightModelName",
      },
    ];
    this.getkpiCategory();
    this.initKpiCategoryForm();
  }
  initKpiCategoryForm() {
    this.cardFormTitle = "Add KPI Category";
    this.kpiCategoryForm = this.formBuilder.group({
      id: [0],
      name: ["", Validators.required],
      description: ["", Validators.required],
      employeeSetObjectives: ["", Validators.required],
      weightModel: [{ value: "", disabled: true }, Validators.required],
      hrSelectReviewer: [{ value: "", disabled: true }, Validators.required],
    });
  }
  submitKpiCategoryForm() {
    const payload = {
      id: this.id,
      name: this.name,
      description: this.description,
      weightModel: +this.weightModel,

      hrSelectReviewer: +this.hrSelectReviewer,
      employeePermitted: +this.employeePermitted,
    };
    // payload.weightModel = +payload.weightModel;
    // payload.hrSelectReviewer = +payload.hrSelectReviewer;
    // this.loadingService.show();
    return this.performanceManagementService.postkpiCategory(payload).subscribe(
      (res) => {
        // this.loadingService.hide();
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success").then(() => {
            $("#kpi_category_modal").modal("hide");
            this.modelDisabled = true;
            this.hrDisabled = true;
            this.weightModel = "n/a";
            this.hrSelectReviewer = "";
            this.name = "";
            this.description = "";
            this.employeePermitted = "";
            // this.rerender();
            this.getkpiCategory();
          });
        }
      },
      (err) => {
        // this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  getkpiCategory() {
    // this.loadingService.show();
    this.performanceManagementService.getkpiCategory().subscribe(
      (data) => {
        // this.loadingService.hide();
        this.kpiCategory = data.setupList;
        this.dtTrigger.next();
      },
      (err) => {
        // this.loadingService.hide();
      }
    );
  }

  edit(row) {
    this.cardFormTitle = "Edit KPI Category";
    // this.kpiCategoryForm.patchValue({
    //   id: row.id,
    //   name: row.name,
    //   employeePermitted: row.employeePermitted,
    //   hrSelectReviewer: row.hrSelectReviewer,
    //   weightModel: row.weightModel,
    // });
    console.log(row);
    this.id = row.id;
    this.name = row.name;
    this.hrSelectReviewer = row.hrSelectReviewer;
    this.employeePermitted = row.employeePermitted;
    this.weightModel = row.weightModel;
    this.description = row.description;
    this.selectReview = row.weightModel;
    this.setWeightModel(row.employeePermitted);
    this.hrDisabled = false;
    $("#kpi_category_modal").modal("show");
  }

  // Fixes the misleading error message "Cannot find a differ supporting object '[object Object]'"
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
    if (this.selectedKpi.length === 0) {
      return swal.fire("Error", "Select items to delete", "error");
    }
    this.selectedKpi.map((item) => {
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
            .deleteKpiCategory(payload)
            .subscribe(
              (res) => {
                // this.loadingService.hide();
                const message = res.status.message.friendlyMessage;
                if (res.status.isSuccessful) {
                  swal.fire("GOSHRM", message, "success").then(() => {
                    this.getkpiCategory();
                  });
                } else {
                  swal.fire("GOSHRM", message, "error");
                }
              },
              (err) => {
                // this.loadingService.hide();
                this.utilitiesService.showMessage(err, "error");
              }
            );
        }
      });
    this.selectedId = [];
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

  setWeightModel(value) {
    this.allLocation = +value;
    this.kpiCategoryForm.get("weightModel");
    if (this.allLocation === 1 || this.allLocation === 2) {
      // this.kpiCategoryForm.get("weightModel").enable();
      this.modelDisabled = false;
    }
  }

  setHrReview(event) {
    this.selectReview = +event.target.value;
    this.kpiCategoryForm.get("hrSelectReviewer");
    if (this.selectReview == 3) {
      // this.kpiCategoryForm.get("hrSelectReviewer").enable();
      this.hrDisabled = false;
    }
  }

  checkAll(event) {
    if (event.target.checked) {
      this.selectedId = this.performanceKpiCategory.map((item) => {
        return item.id;
      });
    } else {
      this.selectedId = [];
    }
  }

  downloadFile() {
    // this.loadingService.show();
    this.performanceManagementService.downloadKpiCategory().subscribe(
      (res) => {
        // this.loadingService.hide();
        return this.utilitiesService.byteToFile(res, "KPI Category.xlsx");
      },
      (err) => {
        // this.loadingService.hide();
      }
    );
  }

  // rerender(): void {
  //   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //     dtInstance.destroy();
  //     this.dtTrigger.next();
  //   });
  // }
  closeModal() {
    // this.initKpiCategoryForm();
    this.id = 0;
    this.name = "";
    this.hrSelectReviewer = "";
    this.employeePermitted = "";
    this.weightModel = "";
    this.description = "";
    this.setWeightModel(this.weightModel);
    $("#kpi_category_modal").modal("hide");
  }
}
