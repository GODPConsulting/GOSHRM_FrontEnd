import { data } from "jquery";
import { Validators } from "@angular/forms";
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { PerfomanceManagementService } from "src/app/services/perfomance-management.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";
declare const $: any;
@Component({
  selector: "app-kpi-category",
  templateUrl: "./kpi-category.component.html",
  styleUrls: ["./kpi-category.component.css"],
})
export class KpiCategoryComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  cardFormTitle: string;
  pageLoading: boolean = false; // controls the visibility of the page loader
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
  employeeSetObjectives: string = "";
  name: string = "";
  description: string = "";
  weightModel: string = "";
  hrSelectReviewer: string = "";

  constructor(
    private formBuilder: FormBuilder,
    private performanceManagementService: PerfomanceManagementService,
    private utilitiesService: UtilitiesService
  ) {}

  ngOnInit(): void {
    this.dtOptions = {
      dom:
        "<'row'<'col-sm-8 col-md-5'f><'col-sm-4 col-md-6 align-self-end'l>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Start typing to search by any field",
      },

      columns: [{ orderable: false }, null, null, null, null, null],
      order: [[1, "asc"]],
    };
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
      name: this.name,
      description: this.description,
      weightModel: +this.weightModel,
      hrSelectReviewer: +this.hrSelectReviewer,
      employeeSetObjectives: this.employeeSetObjectives,
    };
    // payload.weightModel = +payload.weightModel;
    // payload.hrSelectReviewer = +payload.hrSelectReviewer;

    this.spinner = true;
    return this.performanceManagementService.postkpiCategory(payload).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          $("#kpi_category_modal").modal("hide");

          this.modelDisabled = true;
          this.hrDisabled = true;
          this.weightModel = "";
          this.hrSelectReviewer = "";
          this.name = "";
          this.description = "";
          this.employeeSetObjectives = "";
        }

        this.getkpiCategory();
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  getkpiCategory() {
    this.pageLoading = true;
    this.performanceManagementService.getkpiCategory().subscribe(
      (data) => {
        this.pageLoading = false;
        this.kpiCategory = data.setupList;
      },
      (err) => {
        this.pageLoading = false;
      }
    );
  }

  edit(row) {
    this.cardFormTitle = "Edit KPI Category";
    this.kpiCategoryForm.patchValue({
      id: row.id,
      name: row.name,
      employeePermitted: row.employeePermitted,
      hrSelectReviewer: row.hrSelectReviewer,
      weightModel: row.weightModel,
    });
    $("#kpi_category_modal").modal("show");
  }

  // Fixes the misleading error message "Cannot find a differ supporting object '[object Object]'"
  hack(val: any[]) {
    return Array.from(val);
  }

  onSelectedFile(event: Event, form: FormGroup) {
    this.utilitiesService.uploadFileValidator(event, form, this.staffId);
  }

  // Prevents the edit modal from popping up when checkbox is clicked
  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
  }

  delete() {
    let payload: object;
    if (this.selectedId.length === 0) {
      return swal.fire("Error", "Select items to delete", "error");
    } else {
      payload = {
        itemIds: this.selectedId,
      };
    }
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
          this.pageLoading = true;
          return this.performanceManagementService
            .deleteKpiCategory(payload)
            .subscribe(
              (res) => {
                this.pageLoading = false;
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
                this.pageLoading = false;
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

  setWeightModel(event) {
    console.log(+event.target.value);
    this.allLocation = +event.target.value;
    this.kpiCategoryForm.get("weightModel");
    if (this.allLocation === 1 || this.allLocation === 0) {
      // this.kpiCategoryForm.get("weightModel").enable();
      this.modelDisabled = false;
    }
    /* this.onclick = true;
    (data) => {
      this.onclick = false;
      this.employeeSetObjectives = data.onclick;
    } */
  }

  setHrReview(event) {
    console.log(+event.target.value);
    this.selectReview = +event.target.value;
    this.kpiCategoryForm.get("hrSelectReviewer");
    if (this.selectReview === 1 || this.selectReview === 3) {
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
}
