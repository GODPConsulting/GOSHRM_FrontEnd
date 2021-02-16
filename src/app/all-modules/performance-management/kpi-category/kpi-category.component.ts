import { Validators } from '@angular/forms';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PerfomanceManagementService } from 'src/app/services/perfomance-management.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import swal from "sweetalert2";
declare const $: any;
@Component({
  selector: 'app-kpi-category',
  templateUrl: './kpi-category.component.html',
  styleUrls: ['./kpi-category.component.css']
})
export class KpiCategoryComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  cardFormTitle: string;
  pageLoading: boolean = false; // controls the visibility of the page loader
  spinner: boolean = false;

  @ViewChild("fileInput")
  fileInput: ElementRef;

  //Form
  kpiCategoryForm: FormGroup;

  performanceKpiCategory: any = {};
  setupService: any;

  constructor(
    private formBuilder: FormBuilder,
    private performanceManagementService: PerfomanceManagementService,
    private utilitiesService: UtilitiesService
  ) { }

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

      columns: [{ orderable: false }, null, null, null, null],
      order: [[1, "asc"]],
    };
    this.getPerformancekpiCategory(this.staffId);
    this.initKpiCategoryForm();
  }
  initKpiCategoryForm() {
    this.cardFormTitle = "Add KPI Category";
    this.kpiCategoryForm = this.formBuilder.group({
      id: [0],
      name: ["", Validators.required],
      employeeSetObjectives: ["", Validators.required],
      hrSelectReviewer: ["", Validators.required],
    })
  }
  submitKpiCategoryForm(form: FormGroup) {
    if (!form.valid) {
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    const payload = form.value;

    this.spinner = true;
    return this.performanceManagementService.postKpiCategoryForm(payload).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          $("#dependent_contact_modal").modal("hide");
        }
        this.getPerformancekpiCategory(this.staffId);
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );

  }

  getPerformancekpiCategory(id: number) {
    this.performanceManagementService.getPerformancekpiCategoryByStaffId(id).subscribe(
      (date) => {
        if (date.) {
          this.
        }
      }
    )

  }
  
}
